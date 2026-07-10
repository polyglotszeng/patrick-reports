// pet_swift.swift — macOS native Hermes Pet (SwiftUI floating NSPanel)
//
// Usage:
//   swiftc -O pet_swift.swift -o pet_swift -framework SwiftUI -framework AppKit && ./pet_swift
//
// Reads http://127.0.0.1:7799/api/v3/cron every 30s and renders a 240×~110
// draggable floating bubble with 4 KPI tiles (ok / err / human / inbox) and
// a status-colored border. Always-on-top via NSPanel.
//
// Compiled in script mode (no @main) so top-level `func` and `class FloatingPanel`
// declarations are legal.

import SwiftUI
import AppKit

// MARK: - Data model

struct PetState: Codable {
    let total: Int
    let ok: Int
    let error: Int
    let needs_human: Int
    let inbox_unacked: Int
}

// MARK: - HTTP fetcher (5s hard timeout)

func fetchState() -> (PetState?, String?) {
    let url = URL(string: "http://127.0.0.1:7799/api/v3/cron")!
    var req = URLRequest(url: url)
    req.timeoutInterval = 5.0
    req.cachePolicy = .reloadIgnoringLocalAndRemoteCacheData
    let sem = DispatchSemaphore(value: 0)
    var resultData: Data?
    var resultErr: Error?
    URLSession.shared.dataTask(with: req) { data, _, err in
        if let err = err { resultErr = err } else { resultData = data }
        sem.signal()
    }.resume()
    _ = sem.wait(timeout: .now() + 6.0)
    if let err = resultErr { return (nil, "\(err.localizedDescription)") }
    guard let data = resultData else { return (nil, "no data") }
    do {
        let state = try JSONDecoder().decode(PetState.self, from: data)
        return (state, nil)
    } catch {
        return (nil, "decode: \(error.localizedDescription)")
    }
}

// MARK: - NSPanel subclass that floats above everything (incl. fullscreen apps)

final class FloatingPanel<Content: View>: NSPanel {
    init(contentRect: NSRect, content: @escaping () -> Content) {
        super.init(
            contentRect: contentRect,
            styleMask: [.nonactivatingPanel, .fullSizeContentView, .borderless],
            backing: .buffered,
            defer: false
        )
        self.isFloatingPanel = true
        self.level = .floating
        self.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        self.hidesOnDeactivate = false
        self.becomesKeyOnlyIfNeeded = true
        self.isMovableByWindowBackground = true
        self.backgroundColor = .clear
        self.hasShadow = true
        self.titleVisibility = .hidden
        self.titlebarAppearsTransparent = true
        self.isReleasedWhenClosed = false
        self.contentView = NSHostingView(rootView: content())
        // isMovableByWindowBackground (set on NSPanel above) already allows
        // drag-by-clicking on the content — no per-contentView flag needed.
    }
}

// MARK: - Pet view

struct PetView: View {
    @State private var state: PetState? = nil
    @State private var errorReason: String? = "starting…"
    @State private var lastSync: Date? = nil
    @State private var tick: Int = 0  // forces footer re-render

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack(spacing: 6) {
                Text(emoji).font(.system(size: 14))
                Text("Hermes Pet").font(.system(size: 10, weight: .semibold))
                    .foregroundColor(Color(white: 0.6))
                Spacer()
            }
            .padding(.horizontal, 10).padding(.top, 8).padding(.bottom, 4)

            // KPI tiles
            HStack(spacing: 6) {
                tile("ok",    n: state?.ok,           color: .green)
                tile("err",   n: state?.error,        color: .red)
                tile("human", n: state?.needs_human,  color: .orange)
                tile("inbox", n: state?.inbox_unacked,color: .blue)
            }
            .padding(.horizontal, 10)

            // Footer
            Text(footerText)
                .font(.system(size: 9))
                .foregroundColor(Color(white: 0.45))
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 10).padding(.top, 6).padding(.bottom, 8)
        }
        .frame(width: 240)
        .background(
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.black.opacity(0.78))
        )
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .strokeBorder(borderColor, lineWidth: 2)
        )
        .onAppear { refresh() }
    }

    private var emoji: String {
        if state == nil { return "😴" }
        if (state!.error) > 0 { return "🚨" }
        if (state!.needs_human) > 0 { return "⚠️" }
        return "✅"
    }

    private var borderColor: Color {
        if state == nil { return Color(white: 0.4) }
        if (state!.error) > 0 { return .red }
        if (state!.needs_human) > 0 { return .orange }
        return .green
    }

    private var footerText: String {
        _ = tick  // dependency: forces re-eval when 1Hz timer bumps tick
        if let err = errorReason, state == nil { return "server :7799 down (\(err))" }
        if let last = lastSync {
            let s = Int(Date().timeIntervalSince(last))
            if s < 60 { return "sync \(s)s ago · total \(state?.total ?? 0)" }
            return "sync \(s / 60)m ago · total \(state?.total ?? 0)"
        }
        return "starting…"
    }

    /// Called by the 1Hz controller timer. SwiftUI views are structs,
    /// so the controller can't write to our @State directly — it just
    /// calls this method on the view instance, and we mutate @State here.
    fileprivate func tickSyncLabel() {
        DispatchQueue.main.async {
            self.tick &+= 1
        }
    }

    @ViewBuilder
    private func tile(_ label: String, n: Int?, color: Color) -> some View {
        VStack(spacing: 2) {
            Text(n.map(String.init) ?? "—")
                .font(.system(size: 18, weight: .bold, design: .monospaced))
                .foregroundColor(color)
            Text(label)
                .font(.system(size: 8))
                .foregroundColor(Color(white: 0.55))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 4)
        .background(Color.white.opacity(0.04))
        .cornerRadius(6)
    }

    func refresh() {
        // Run fetch on a background thread; UI updates on main
        DispatchQueue.global(qos: .userInitiated).async {
            let (data, err) = fetchState()
            DispatchQueue.main.async {
                if let d = data {
                    state = d
                    errorReason = nil
                    lastSync = Date()
                } else {
                    state = nil
                    errorReason = err
                }
            }
        }
    }
}

// MARK: - App controller (timer + panel lifecycle)

final class PetController {
    private var window: FloatingPanel<PetView>!
    private var timer: Timer?
    private let view = PetView()
    private let refreshTimer = Timer.publish(every: 30, on: .main, in: .common).autoconnect()

    func start() {
        let rect = NSRect(x: 0, y: 0, width: 240, height: 120)
        window = FloatingPanel(contentRect: rect) {
            self.view
        }
        // Place in top-right
        if let screen = NSScreen.main {
            let visible = screen.visibleFrame
            window.setFrameOrigin(NSPoint(
                x: visible.maxX - 240 - 24,
                y: visible.maxY - 120 - 24
            ))
        }
        window.orderFrontRegardless()
        window.makeKeyAndOrderFront(nil)

        // Periodic refresh + tick for "sync Xs ago"
        timer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { _ in
            self.view.refresh()
        }
        // 1Hz tick to update the "sync Xs ago" label
        let tickTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            self.view.tickSyncLabel()
        }
        RunLoop.current.add(timer!, forMode: .common)
        RunLoop.current.add(tickTimer, forMode: .common)
    }
}

// MARK: - Entry point (script mode: top-level statements, no @main)

let app = NSApplication.shared
let controller = PetController()
controller.start()
app.setActivationPolicy(.accessory)  // no Dock icon
app.run()