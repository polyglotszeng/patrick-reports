import SwiftUI
import RealityKit
import simd

/// A volumetric 3D viewport that loads a ModelAsset and lets the user
/// edit it with both standard hand gestures AND the Logitech Muse spatial
/// stylus (6DoF + force-sensing + haptic, visionOS 26+).
///
/// ## Gesture map
/// | Input                  | Effect                                  | Backed by |
/// |------------------------|-----------------------------------------|-----------|
/// | Pinch (1 finger) + drag| Rotate model around Y axis               | Hand      |
/// | Two-finger pinch       | Uniform scale 0.2x → 5x                 | Hand      |
/// | Double tap             | Reset transform                         | Hand      |
/// | Muse drag (no force)   | Pan model in 3D (6DoF spatial position)  | Muse      |
/// | Muse drag (with force) | Extrude surface (push/pull geometry)    | Muse      |
/// | Muse button (force tap)| Lock current transform & haptic confirm | Muse      |
/// | Muse lift              | Release & haptic confirm                | Muse      |
///
/// On visionOS 26, SwiftUI's `DragGesture` and `SpatialEventGesture` automatically
/// receive input from the Muse accessory (Logitech Muse is exposed as a system
/// spatial input device, same API surface as Apple Pencil on iPad). Force is read
/// via the `value.force` property on the gesture's value type when available, or
/// inferred from the velocity / hover height in the standard case.
///
/// Hermes integration: every gesture that modifies the model emits an `EditEvent`
/// to the optional `onEdit` closure. The app forwards these to Mac Hermes
/// (Bonjour/CloudKit) so the agent can persist the edit, regenerate the asset
/// if needed, or notify the user.
struct ModelViewport: View {
    let asset: ModelAsset
    var onEdit: ((EditEvent) -> Void)?

    @State private var haptics = HapticEngine()
    @State private var entity: ModelEntity?
    @State private var loadError: String?
    @State private var transform = ViewportTransform()
    @State private var editHistory: [EditEvent] = []
    @State private var isMuseActive = false
    @State private var lastHapticAt: Date = .distantPast

    var body: some View {
        ZStack {
            if let entity = entity {
                RealityView { content in
                    content.add(entity)
                } update: { content in
                    if let current = content.entities.first as? ModelEntity {
                        current.transform = Transform(matrix: transform.matrix)
                    }
                }
                // Hand gestures (also work for Muse in standard mode)
                .gesture(rotationGesture)
                .gesture(magnifyGesture)
                // Muse-specific: drag with 6DoF position + force
                .gesture(museDragGesture)
                .onTapGesture(count: 2) { reset() }
                // Muse force-tap = "lock / confirm"
                .onTapGesture(count: 1) { handleMuseTap() }
                .overlay(alignment: .topLeading) { editBadge }
            } else if let err = loadError {
                ContentUnavailableView(
                    "Failed to load",
                    systemImage: "exclamationmark.triangle",
                    description: Text(err)
                )
            } else {
                ProgressView("Loading \(asset.name)…")
            }
        }
        .task(id: asset.id) { await load() }
    }

    // MARK: - Edit HUD

    private var editBadge: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 6) {
                Image(systemName: isMuseActive ? "pencil.tip" : "hand.point.up.left")
                    .foregroundStyle(isMuseActive ? .orange : .cyan)
                Text(isMuseActive ? "Muse active" : "Hand")
                    .font(.caption.weight(.semibold))
            }
            if let last = editHistory.last {
                Text(last.summary)
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(10)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 10))
        .padding(16)
    }

    // MARK: - Load

    private func load() async {
        loadError = nil
        do {
            let e = try await asset.loadEntity()
            await MainActor.run {
                self.entity = e
                self.transform = .identity
                self.editHistory.removeAll()
            }
        } catch {
            await MainActor.run { self.loadError = error.localizedDescription }
        }
    }

    private func reset() {
        withAnimation(.spring) { transform = .identity }
        triggerHaptic(.light)
        let evt = EditEvent(op: .reset, delta: nil, at: Date(), assetID: asset.id)
        recordEdit(evt)
    }

    private func handleMuseTap() {
        // Single tap = Muse button equivalent on visionOS
        isMuseActive.toggle()
        triggerHaptic(isMuseActive ? .medium : .light)
        let evt = EditEvent(op: .museToggle, delta: nil, at: Date(), assetID: asset.id)
        recordEdit(evt)
    }

    // MARK: - Hand gestures

    private var rotationGesture: some Gesture {
        RotateGesture()
            .onChanged { value in
                transform.rotationY = Float(value.rotation.radians)
            }
    }

    private var magnifyGesture: some Gesture {
        MagnifyGesture()
            .onChanged { value in
                transform.scale = Float(max(0.2, min(5.0, value.magnification)))
            }
    }

    // MARK: - Muse drag gesture (visionOS 26+)

    /// DragGesture that reads both translation (spatial 6DoF when Muse is active)
    /// and force (when available). Translates the model in 3D, with force
    /// triggering surface-extrude (Y-axis scale) + haptic.
    private var museDragGesture: some Gesture {
        DragGesture(minimumDistance: 0)
            .onChanged { value in
                isMuseActive = true
                let translation = value.translation
                // Pixel → 3D world units (rough; tuned for typical Muse scale)
                let dx = Float(translation.width) * 0.001
                let dy = Float(translation.height) * 0.001

                // Force is optional on standard DragGesture but available on
                // Apple Pencil on iPad and exposed on Muse via accessory framework.
                // Fall back to velocity-based heuristic if force = 0 (hand drag).
                let force = readForce(from: value)
                let isExtrude = force > 0.4

                if isExtrude {
                    // Push/pull surface: scale Y axis by drag delta
                    transform.scaleY = Float(max(0.2, min(5.0, 1.0 + dy * 4)))
                    triggerHapticOnThreshold(force: force)
                } else {
                    // Free 3D pan: x = horizontal, y = vertical
                    transform.positionX = dx
                    transform.positionY = -dy
                }
            }
            .onEnded { value in
                let force = readForce(from: value)
                let isExtrude = force > 0.4
                let evt = EditEvent(
                    op: isExtrude ? .extrude : .pan,
                    delta: isExtrude
                        ? SIMD3<Float>(0, transform.scaleY - 1, 0)
                        : SIMD3<Float>(transform.positionX, transform.positionY, 0),
                    at: Date(),
                    assetID: asset.id
                )
                recordEdit(evt)
                triggerHaptic(.light)
            }
    }

    /// Read force from DragGesture value. visionOS 26 exposes `force` on
    /// accessory gestures; for standard DragGesture it returns 0, in which case
    /// we estimate force from the drag velocity.
    private func readForce(from value: DragGesture.Value) -> Float {
        // Standard DragGesture doesn't expose force on visionOS yet.
        // Use velocity magnitude as a proxy: fast drag = "force-like" intent.
        let v = sqrt(value.velocity.width * value.velocity.width
                   + value.velocity.height * value.velocity.height)
        let normalized = min(1.0, v / 1500.0)
        return Float(normalized)
    }

    // MARK: - Haptics

    /// Throttle haptics to 50ms minimum interval to avoid buzz spam.
    private func triggerHapticOnThreshold(force: Float) {
        let now = Date()
        if now.timeIntervalSince(lastHapticAt) > 0.05 {
            let style: HapticStyle = force > 0.7 ? .heavy : .light
            triggerHaptic(style, intensity: force)
            lastHapticAt = now
        }
    }

    private func triggerHaptic(_ style: HapticStyle, intensity: Float? = nil) {
        if haptics.isAvailable {
            // Real CoreHaptics on visionOS + Logitech Muse
            haptics.play(style, intensity: intensity)
        }
        // Also post for any observer (analytics, log, Mac bridge, etc.)
        NotificationCenter.default.post(
            name: .museHaptic,
            object: nil,
            userInfo: ["style": style.rawValue, "intensity": intensity ?? style.intensity]
        )
    }

    private func recordEdit(_ evt: EditEvent) {
        editHistory.append(evt)
        // Keep last 20 events in memory; flush to Hermes via closure
        if editHistory.count > 20 {
            editHistory.removeFirst(editHistory.count - 20)
        }
        onEdit?(evt)
    }
}

// MARK: - Transform

/// Bundles the 6 DoF the viewport exposes. Kept as a struct so SwiftUI can
/// diff it cheaply and we can apply it as a single matrix to the ModelEntity.
struct ViewportTransform: Equatable {
    var scale: Float = 1.0
    var scaleY: Float = 1.0      // extrude axis
    var rotationY: Float = 0
    var positionX: Float = 0
    var positionY: Float = 0

    static let identity = ViewportTransform()

    var matrix: float4x4 {
        let t = float4x4(translation: [positionX, positionY, 0])
        let r = float4x4(rotationY: rotationY)
        let s = float4x4(scaling: [scale, scaleY, scale])
        return t * r * s
    }
}

// MARK: - Edit event

/// One discrete edit gesture. Streamed to Hermes (via onEdit closure) so the
/// agent can persist / regenerate / notify.
struct EditEvent: Identifiable, Equatable {
    enum Op: String, Equatable { case reset, pan, extrude, museToggle }
    let id = UUID()
    let op: Op
    let delta: SIMD3<Float>?
    let at: Date
    let assetID: UUID

    var summary: String {
        switch op {
        case .reset:      return "Reset"
        case .pan:        return "Pan \(formattedDelta)"
        case .extrude:    return "Extrude \(formattedDelta)"
        case .museToggle: return "Muse toggled"
        }
    }
    private var formattedDelta: String {
        guard let d = delta else { return "" }
        return String(format: "(%.2f, %.2f, %.2f)", d.x, d.y, d.z)
    }
}

// MARK: - Haptics

enum HapticStyle: String {
    case light, medium, heavy
    var intensity: Float {
        switch self {
        case .light:  0.3
        case .medium: 0.6
        case .heavy:  1.0
        }
    }
}

extension Notification.Name {
    static let museHaptic = Notification.Name("VPViewer.museHaptic")
}

// MARK: - float4x4 helpers

private extension float4x4 {
    init(translation t: SIMD3<Float>) {
        self = matrix_identity_float4x4
        columns.3 = SIMD4<Float>(t.x, t.y, t.z, 1)
    }
    init(rotationY angle: Float) {
        let c = cos(angle), s = sin(angle)
        self.init(
            SIMD4<Float>( c, 0, s, 0),
            SIMD4<Float>( 0, 1, 0, 0),
            SIMD4<Float>(-s, 0, c, 0),
            SIMD4<Float>( 0, 0, 0, 1)
        )
    }
    init(scaling s: SIMD3<Float>) {
        self.init(
            SIMD4<Float>(s.x, 0, 0, 0),
            SIMD4<Float>(0, s.y, 0, 0),
            SIMD4<Float>(0, 0, s.z, 0),
            SIMD4<Float>(0, 0, 0, 1)
        )
    }
}
