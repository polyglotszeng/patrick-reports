import SwiftUI

@main
struct VPViewerApp: App {
    @State private var modelStore = ModelStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(modelStore)
        }
        .windowResizability(.contentSize)
    }
}
