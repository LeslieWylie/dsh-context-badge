import AppKit
import SwiftUI

struct Todo: Codable, Identifiable, Equatable {
    var id: UUID = UUID()
    var text: String
    var done: Bool = false
}

struct ContextRecord: Codable {
    var note: String = ""
    var todos: [Todo] = []
    var updatedAt: Date = Date()
    var lastSeen: Date = Date()

    enum CodingKeys: String, CodingKey { case note, todos, updatedAt, lastSeen }

    init(note: String = "", todos: [Todo] = [], updatedAt: Date = Date(), lastSeen: Date = Date()) {
        self.note = note
        self.todos = todos
        self.updatedAt = updatedAt
        self.lastSeen = lastSeen
    }

    init(from decoder: Decoder) throws {
        let values = try decoder.container(keyedBy: CodingKeys.self)
        note = try values.decodeIfPresent(String.self, forKey: .note) ?? ""
        todos = try values.decodeIfPresent([Todo].self, forKey: .todos) ?? []
        updatedAt = try values.decodeIfPresent(Date.self, forKey: .updatedAt) ?? Date()
        lastSeen = try values.decodeIfPresent(Date.self, forKey: .lastSeen) ?? updatedAt
    }
}

struct AppContext: Codable, Equatable, Identifiable {
    var app: String = ""
    var window: String = ""

    var id: String { key }
    var key: String { app + "|" + window }
    var displayName: String { window.isEmpty ? app : app + " · " + window }
}

struct PersistedState: Codable {
    var records: [String: ContextRecord] = [:]
    var recent: [AppContext] = []
}

@MainActor
final class ContextStore: ObservableObject {
    @Published var current = AppContext()
    @Published var records: [String: ContextRecord] = [:]
    @Published var recent: [AppContext] = []
    @Published var selectedKey: String?
    @Published var isVisible = true

    private let fileURL: URL
    private var timer: Timer?

    init() {
        let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("ContextBadge", isDirectory: true)
        try? FileManager.default.createDirectory(at: base, withIntermediateDirectories: true)
        fileURL = base.appendingPathComponent("contexts.json")
        if let data = try? Data(contentsOf: fileURL),
           let state = try? JSONDecoder().decode(PersistedState.self, from: data) {
            records = state.records
            recent = state.recent
        } else if let data = try? Data(contentsOf: fileURL),
                  let oldRecords = try? JSONDecoder().decode([String: ContextRecord].self, from: data) {
            records = oldRecords
        }
        refresh()
        timer = Timer.scheduledTimer(timeInterval: 1.5, target: self, selector: #selector(tick), userInfo: nil, repeats: true)
    }

    deinit { timer?.invalidate() }

    var record: ContextRecord {
        get { records[activeContext.key] ?? ContextRecord() }
        set { records[activeContext.key] = newValue; persist() }
    }

    var activeContext: AppContext {
        if let selectedKey, let historical = recent.first(where: { $0.key == selectedKey }) {
            return historical
        }
        return current
    }

    func refresh() {
        guard let app = NSWorkspace.shared.frontmostApplication else { return }
        let appName = app.localizedName ?? app.bundleIdentifier ?? "Unknown App"
        let window = Self.frontmostWindowTitle(for: app.processIdentifier)
        let next = AppContext(app: appName, window: window)
        if next != current {
            current = next
            if selectedKey == nil { touch(next) }
        }
    }

    @objc private func tick() { refresh() }

    func updateNote(_ note: String) {
        var next = record; next.note = note; next.updatedAt = Date(); next.lastSeen = Date(); record = next
    }

    func addTodo(_ text: String) {
        let value = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !value.isEmpty else { return }
        var next = record; next.todos.append(Todo(text: value)); next.updatedAt = Date(); next.lastSeen = Date(); record = next
    }

    func toggle(_ todo: Todo) {
        var next = record
        next.todos = next.todos.map { $0.id == todo.id ? Todo(id: $0.id, text: $0.text, done: !$0.done) : $0 }
        next.updatedAt = Date(); next.lastSeen = Date(); record = next
    }

    func remove(_ todo: Todo) {
        var next = record; next.todos.removeAll { $0.id == todo.id }; next.updatedAt = Date(); next.lastSeen = Date(); record = next
    }

    func clearCompleted() {
        var next = record
        next.todos.removeAll { $0.done }
        next.updatedAt = Date(); next.lastSeen = Date(); record = next
    }

    func showCurrent() {
        selectedKey = nil
    }

    func select(_ context: AppContext) {
        selectedKey = context.key
    }

    private func persist() {
        guard let data = try? JSONEncoder().encode(PersistedState(records: records, recent: recent)) else { return }
        try? data.write(to: fileURL, options: .atomic)
    }

    private func touch(_ context: AppContext) {
        guard !context.app.isEmpty else { return }
        recent.removeAll { $0.key == context.key }
        recent.insert(context, at: 0)
        if recent.count > 8 { recent.removeLast(recent.count - 8) }
        if records[context.key] == nil { records[context.key] = ContextRecord(lastSeen: Date()) }
        persist()
    }

    private static func frontmostWindowTitle(for pid: pid_t) -> String {
        let options: CGWindowListOption = [.optionOnScreenOnly, .excludeDesktopElements]
        guard let list = CGWindowListCopyWindowInfo(options, kCGNullWindowID) as? [[String: Any]] else { return "" }
        for item in list {
            guard let ownerPID = item[kCGWindowOwnerPID as String] as? Int, ownerPID == Int(pid) else { continue }
            if let title = item[kCGWindowName as String] as? String, !title.isEmpty { return title }
        }
        return ""
    }
}

struct BadgeView: View {
    @ObservedObject var store: ContextStore
    @State private var todoDraft = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("🧭 Context Badge").font(.headline)
                    Text(store.activeContext.displayName.isEmpty ? "等待前台窗口" : store.activeContext.displayName)
                        .font(.caption).foregroundStyle(.secondary).lineLimit(2)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 3) {
                    Button(store.isVisible ? "隐藏" : "显示") { store.isVisible.toggle() }
                        .buttonStyle(.borderless)
                    if store.selectedKey != nil {
                        Button("回到当前") { store.showCurrent() }
                            .buttonStyle(.borderless).font(.caption2)
                    }
                }
            }
            if store.recent.count > 1 {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 5) {
                        ForEach(store.recent) { context in
                            Button(context.key == store.activeContext.key ? "✓ " + context.app : context.app) {
                                store.select(context)
                            }
                            .buttonStyle(.bordered).controlSize(.small)
                            .help(context.displayName)
                        }
                    }
                }
            }
            if store.isVisible {
                TextEditor(text: Binding(get: { store.record.note }, set: store.updateNote))
                    .font(.system(size: 12, design: .monospaced)).frame(minHeight: 58, maxHeight: 100)
                    .overlay(RoundedRectangle(cornerRadius: 7).stroke(.secondary.opacity(0.3)))
                HStack {
                    TextField("添加待办，回车保存", text: $todoDraft)
                        .textFieldStyle(.roundedBorder)
                        .onSubmit { store.addTodo(todoDraft); todoDraft = "" }
                    Button("添加") { store.addTodo(todoDraft); todoDraft = "" }
                }
                if store.record.todos.isEmpty {
                    Text("还没有待办").font(.caption).foregroundStyle(.secondary)
                } else {
                    ForEach(store.record.todos) { todo in
                        HStack(spacing: 6) {
                            Toggle("", isOn: Binding(get: { todo.done }, set: { _ in store.toggle(todo) }))
                                .labelsHidden().toggleStyle(.checkbox)
                            Text(todo.text).strikethrough(todo.done).lineLimit(2)
                            Spacer()
                            Button("×") { store.remove(todo) }.buttonStyle(.borderless).foregroundStyle(.secondary)
                        }
                    }
                }
                HStack {
                    Text("待办 (store.record.todos.filter { !$0.done }.count) 未完成")
                        .font(.caption2).foregroundStyle(.secondary)
                    Spacer()
                    Button("清理已完成") { store.clearCompleted() }
                        .buttonStyle(.borderless)
                        .disabled(!store.record.todos.contains(where: { $0.done }))
                }
                Text("本地保存于 ~/Library/Application Support/ContextBadge；不联网、不截图、不记录按键。")
                    .font(.system(size: 10)).foregroundStyle(.secondary)
            }
        }
        .padding(14)
        .frame(width: 360)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 14))
    }
}

@MainActor
final class AppDelegate: NSObject, NSApplicationDelegate {
    let store = ContextStore()
    var panel: NSPanel!
    var statusItem: NSStatusItem!

    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.accessory)
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.squareLength)
        statusItem.button?.title = "🧭"
        let menu = NSMenu()
        menu.addItem(NSMenuItem(title: "显示/隐藏", action: #selector(toggle), keyEquivalent: ""))
        menu.addItem(NSMenuItem.separator())
        menu.addItem(NSMenuItem(title: "退出", action: #selector(quit), keyEquivalent: "q"))
        statusItem.menu = menu

        panel = NSPanel(contentRect: NSRect(x: 0, y: 0, width: 390, height: 440),
                        styleMask: [.borderless, .nonactivatingPanel], backing: .buffered, defer: false)
        panel.level = .floating
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = true
        panel.hidesOnDeactivate = false
        panel.contentView = NSHostingView(rootView: BadgeView(store: store))
        positionPanel()
        panel.orderFrontRegardless()
    }

    func positionPanel() {
        guard let screen = NSScreen.main else { return }
        let frame = screen.visibleFrame
        panel?.setFrameTopRight(NSRect(x: frame.maxX - 20, y: frame.maxY - 20, width: 390, height: 440))
    }

    @objc func toggle() {
        if panel.isVisible { panel.orderOut(nil) } else { panel.orderFrontRegardless() }
    }
    @objc func quit() { NSApp.terminate(nil) }
}

extension NSPanel {
    func setFrameTopRight(_ rect: NSRect) { setFrameOrigin(NSPoint(x: rect.minX - frame.width, y: rect.minY - frame.height)) }
}

@main
struct ContextBadgeMain {
    @MainActor
    static func main() {
        let app = NSApplication.shared
        let delegate = AppDelegate()
        app.delegate = delegate
        app.run()
    }
}
