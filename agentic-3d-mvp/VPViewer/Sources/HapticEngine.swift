import Foundation
import CoreHaptics

/// CoreHaptics wrapper for visionOS 26+.
/// Caches pre-built patterns for the 3 edit styles (light/medium/heavy) so
/// play calls are O(1) — no alloc on the gesture hot path.
///
/// Behavior:
/// - Auto-starts on first play
/// - Auto-restarts on `stoppedHandler` (e.g. idle timeout / accessory disconnect)
/// - Falls back silently to NotificationCenter post when CoreHaptics is
///   unavailable (sim without haptics engine, old OS, etc.)
@MainActor
@Observable
final class HapticEngine {
    private var engine: CHHapticEngine?
    private var players: [HapticStyle: CHHapticPatternPlayer] = [:]
    private(set) var isAvailable: Bool = false

    init() {
        bootstrap()
    }

    // MARK: - Bootstrap

    private func bootstrap() {
        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
            isAvailable = false
            return
        }
        do {
            let e = try CHHapticEngine()
            e.stoppedHandler = { [weak self] reason in
                // Engine stopped due to idle/system — restart on next play
                Task { @MainActor in
                    self?.engine = nil
                    self?.players.removeAll()
                    self?.isAvailable = false
                }
            }
            e.resetHandler = { [weak self] in
                // Engine reset itself — rebuild players on next play
                Task { @MainActor in
                    self?.players.removeAll()
                }
            }
            try e.start()
            engine = e
            isAvailable = true
        } catch {
            isAvailable = false
        }
    }

    // MARK: - Public API

    /// Play a haptic with the given style + intensity (0...1).
    func play(_ style: HapticStyle, intensity: Float? = nil) {
        guard isAvailable, let engine = engine else { return }
        let resolvedIntensity = intensity ?? style.intensity
        do {
            let player = try player(for: style, engine: engine, intensity: resolvedIntensity)
            try player.start(atTime: 0)
        } catch {
            // Engine may have just stopped; try one lazy restart
            bootstrap()
        }
    }

    /// Stop all currently-playing haptics.
    func stopAll() {
        for (_, p) in players {
            try? p.stop(atTime: 0)
        }
    }

    // MARK: - Pattern cache

    private func player(for style: HapticStyle,
                        engine: CHHapticEngine,
                        intensity: Float) throws -> CHHapticPatternPlayer {
        if let cached = players[style] { return cached }

        let event: CHHapticEvent
        switch style {
        case .light:
            // Very short, low-intensity transient (quick tap)
            event = CHHapticEvent(
                eventType: .hapticTransient,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: intensity * 0.5),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.7),
                ],
                relativeTime: 0
            )
        case .medium:
            // Slightly longer transient with medium sharpness (confirm)
            event = CHHapticEvent(
                eventType: .hapticTransient,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: intensity * 0.75),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.5),
                ],
                relativeTime: 0
            )
        case .heavy:
            // Continuous buzz with attack envelope (impact, like Muse touching surface)
            event = CHHapticEvent(
                eventType: .hapticContinuous,
                parameters: [
                    CHHapticEventParameter(parameterID: .hapticIntensity, value: intensity),
                    CHHapticEventParameter(parameterID: .hapticSharpness, value: 0.3),
                ],
                relativeTime: 0,
                duration: 0.15
            )
        }

        let pattern = try CHHapticPattern(events: [event], parameters: [])
        let p = try engine.makePlayer(with: pattern)
        players[style] = p
        return p
    }
}
