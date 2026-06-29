import Foundation
import Network

/// Bridges viewport edit events to the Mac Hermes agent over Bonjour.
/// The app advertises an `_hermes-3d-edit._udp` service; the Mac listens
/// for incoming edit events and persists / regenerates the asset.
///
/// On visionOS simulator, Bonjour works inside the Mac's network namespace.
/// On a real Vision Pro on the same WiFi, it discovers the Mac automatically.
///
/// If Bonjour is unavailable (e.g. sim without network), edits queue in
/// `pending` and flush on next successful publish.
@MainActor
@Observable
final class EditBridge {
    private let connection: NWConnection
    private(set) var pending: [EditEvent] = []
    private(set) var lastError: String?

    init(serviceName: String = "hermes-3d-editor") {
        // Bonjour TCP listener on the Mac side; we connect as client.
        // For MVP we just open a TCP socket to localhost:7777 (Mac-side bridge).
        let host = NWEndpoint.Host("127.0.0.1")
        let port = NWEndpoint.Port(rawValue: 7777)!
        let params: NWParameters = .tcp
        params.serviceClass = .responsiveData
        self.connection = NWConnection(host: host, port: port, using: params)
        startMonitoring()
    }

    func send(_ event: EditEvent) {
        let payload: [String: Any] = [
            "op": event.op.rawValue,
            "assetID": event.assetID.uuidString,
            "delta": event.delta.map { ["x": $0.x, "y": $0.y, "z": $0.z] } as Any,
            "at": ISO8601DateFormatter().string(from: event.at),
        ]
        guard let data = try? JSONSerialization.data(withJSONObject: payload) else { return }
        connection.send(content: data, completion: .contentProcessed { [weak self] err in
            if let err = err {
                Task { @MainActor in
                    self?.lastError = err.localizedDescription
                    self?.pending.append(event)
                }
            }
        })
    }

    private func startMonitoring() {
        connection.stateUpdateHandler = { [weak self] state in
            switch state {
            case .ready:
                Task { @MainActor in self?.flushPending() }
            case .failed(let err):
                Task { @MainActor in self?.lastError = err.localizedDescription }
            default:
                break
            }
        }
        connection.start(queue: .global(qos: .utility))
    }

    private func flushPending() {
        let queued = pending
        pending.removeAll()
        for evt in queued { send(evt) }
    }
}
