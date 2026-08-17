// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ContextBadgeMac",
    platforms: [.macOS(.v13)],
    products: [.executable(name: "context-badge-macos", targets: ["ContextBadgeMac"])],
    targets: [.executableTarget(name: "ContextBadgeMac")]
)
