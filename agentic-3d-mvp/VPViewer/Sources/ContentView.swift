import SwiftUI
import RealityKit
import UniformTypeIdentifiers

struct ContentView: View {
    @Environment(ModelStore.self) private var store
    @State private var bridge = EditBridge()
    @State private var showImporter = false
    @State private var rotationY: Float = 0

    var body: some View {
        NavigationStack {
            HStack(spacing: 0) {
                sidebar
                Divider()
                viewport
            }
            .navigationTitle("Agentic 3D")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showImporter = true
                    } label: {
                        Label("Import USDZ", systemImage: "square.and.arrow.down")
                    }
                }
            }
            .fileImporter(isPresented: $showImporter,
                          allowedContentTypes: [UTType.usdz, UTType.threeDContent, UTType.item],
                          allowsMultipleSelection: false) { result in
                if case .success(let urls) = result, let url = urls.first {
                    store.add(url: url, backend: "local")
                }
            }
            .onAppear {
                // auto-scan Hermes output dirs (sandbox-aware; on visionOS, /tmp + container)
                let dirs = hermesOutputDirs()
                for dir in dirs {
                    store.scan(directory: dir)
                }
            }
        }
    }

    /// Where Hermes writes USDZ files. visionOS app sandbox can't see ~/, so
    /// check both the dev container path and a shared /tmp dir.
    private func hermesOutputDirs() -> [URL] {
        var out: [URL] = []
        // Shared /tmp (works for sim + dev container that maps in)
        for backend in ["tripo", "meshy", "rodin"] {
            out.append(URL(fileURLWithPath: "/tmp/hermes-tools/\(backend)/out"))
        }
        // App sandbox container (for real device)
        if let container = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first {
            for backend in ["tripo", "meshy", "rodin"] {
                out.append(container.appendingPathComponent("hermes/\(backend)/out"))
            }
        }
        return out
    }

    private var sidebar: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Image(systemName: "cube.transparent")
                Text("Library").font(.headline)
                Spacer()
                Text("\(store.assets.count)").font(.caption).foregroundStyle(.secondary)
            }
            .padding()
            Divider()
            if store.assets.isEmpty {
                ContentUnavailableView(
                    "No assets yet",
                    systemImage: "cube",
                    description: Text("Run `python3 3d.py --prompt ...` to generate one.")
                )
                .padding()
            } else {
                @Bindable var store = store
                List(selection: $store.selectedID) {
                    ForEach(store.assets) { a in
                        assetRow(a).tag(a.id)
                    }
                }
                .listStyle(.plain)
            }
        }
        .frame(minWidth: 280)
    }

    private func assetRow(_ a: ModelAsset) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(a.name).font(.subheadline).lineLimit(1)
            HStack {
                Text(a.sourceBackend).font(.caption2).foregroundStyle(.orange)
                Spacer()
                Text(byteCount(a.bytes)).font(.caption2).foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }

    private var viewport: some View {
        Group {
            if let asset = store.selected {
                ModelViewport(asset: asset) { evt in
                    bridge.send(evt)
                }
            } else {
                ContentUnavailableView(
                    "Select an asset",
                    systemImage: "arkit",
                    description: Text("Pick a 3D model from the sidebar.")
                )
            }
        }
        .frame(minWidth: 600, minHeight: 500)
    }

    private func byteCount(_ n: Int) -> String {
        ByteCountFormatter.string(fromByteCount: Int64(n), countStyle: .file)
    }
}
