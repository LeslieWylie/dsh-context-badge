# dsh-context-badge

给 DeepSeek Harness 用的本地优先上下文徽章：按会话或工作区保存笔记和待办，并提供可选的 macOS 前台窗口悬浮 companion。

## 功能

- 在 DSH 输入框下方显示当前上下文徽章。
- 按 DSH 会话或工作区保存笔记和待办，数据只留在浏览器 `localStorage`，旧版数据会自动迁移。
- 显示会话、工作区名、轮次/步骤，以及可用时的 token 摘要。
- 可在“当前会话 / 当前工作区”之间切换，显示保存时间，批量清理已完成待办，并查看最近更新的 8 条上下文。
- 自动保留当前会话已加载的前 5 条用户消息，并从第一条消息生成“这个对话在干什么”；不调用模型、不联网、不额外计费。
- macOS companion 只读取前台应用名和窗口标题，显示为菜单栏/置顶悬浮层。
- companion 数据保存在 `~/Library/Application Support/ContextBadge/contexts.json`。

不截图、不记录按键、不联网、不调用模型、不远程同步。

## 安装 DSH 插件

```sh
dsh plugin add ./
```

插件 bundle id：`dsh-context-badge`。

## 启动 macOS companion

需要 macOS 13+：

```sh
npm run run:macos
```

悬浮窗会保留最近 8 个前台上下文；点击历史标签可查看旧上下文，点击“回到当前”恢复跟随前台窗口。

如果希望登录后自动启动并在异常退出后自动拉起：

```sh
npm run install:macos
```

## 边界

这是独立的上下文工具，不修改模型路由、提示词、权限、计费或 Agent preset。

## 许可证

MIT
