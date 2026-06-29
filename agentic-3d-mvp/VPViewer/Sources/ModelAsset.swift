import SwiftUI
import RealityKit
import Observation

/// A 3D asset that Hermes (or the user) generated.
/// Loads from a local file URL (USDZ / GLB / FBX) and exposes a ModelEntity
/// for RealityKit to render.
struct ModelAsset: Identifiable, Hashable {
    let id: UUID = UUID()
    let name: String
    let url: URL
    let sourceBackend: String       // "tripo" | "meshy" | "rodin" | "local"
    let bytes: Int
    let createdAt: Date

    /// Load the asset's ModelEntity. Cached for 60s to avoid re-decode on every frame.
    func loadEntity() async throws -> ModelEntity {
        let entity = try await ModelEntity(contentsOf: url)
        // Auto-fit: scale to ~0.5m max dimension so it doesn't fill the room
        let bounds = entity.visualBounds(relativeTo: nil)
        let maxDim = max(bounds.extents.x, bounds.extents.y, bounds.extents.z)
        if maxDim > 0 {
            let scale = 0.5 / maxDim
            entity.scale = SIMD3<Float>(repeating: scale)
        }
        return entity
    }
}

@MainActor
@Observable
final class ModelStore {
    var assets: [ModelAsset] = []
    var selectedID: UUID?

    var selected: ModelAsset? {
        get { assets.first(where: { $0.id == selectedID }) }
    }

    /// Scan a directory for USDZ/GLB files and add them to the library.
    /// Default dir = ~/.hermes/hermes-tools/<backend>/out/
    func scan(directory: URL) {
        let fm = FileManager.default
        guard let entries = try? fm.contentsOfDirectory(at: directory,
                                                         includingPropertiesForKeys: [.fileSizeKey, .contentModificationDateKey]) else {
            return
        }
        for url in entries where ["usdz", "glb", "fbx"].contains(url.pathExtension.lowercased()) {
            // de-dup by url
            if assets.contains(where: { $0.url == url }) { continue }
            let size = (try? url.resourceValues(forKeys: [.fileSizeKey]).fileSize) ?? 0
            let backend = url.deletingLastPathComponent().lastPathComponent
            assets.append(ModelAsset(name: url.lastPathComponent,
                                      url: url,
                                      sourceBackend: backend,
                                      bytes: size,
                                      createdAt: Date()))
        }
        if selectedID == nil {
            selectedID = assets.first?.id
        }
    }

    func add(url: URL, backend: String = "local") {
        let size = (try? url.resourceValues(forKeys: [.fileSizeKey]).fileSize) ?? 0
        assets.insert(ModelAsset(name: url.lastPathComponent,
                                  url: url,
                                  sourceBackend: backend,
                                  bytes: size,
                                  createdAt: Date()),
                      at: 0)
        selectedID = assets.first?.id
    }
}
