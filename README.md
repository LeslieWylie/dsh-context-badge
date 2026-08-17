# dsh-context-badge

Local-first context notes and todos for DeepSeek Harness, with an optional macOS foreground-window companion.

## What it does

- Adds a small context badge to the DSH composer dock.
- Keeps notes and todos per DSH session in browser `localStorage`.
- Shows the current DSH session, workspace basename, turn/step counts, and token summary when available.
- Ships an optional macOS menu-bar / always-on-top companion that tracks only the foreground application and window title.
- Stores companion data under `~/Library/Application Support/ContextBadge/contexts.json`.

No screenshots, keystrokes, network calls, model calls, or remote sync are used.

## DSH installation

From the repository root:

```sh
dsh plugin add ./
```

For a profile-local development link, add the package through the profile's plugin configuration and restart the DSH web service. The bundle id is `dsh-context-badge`.

## macOS companion

Requires macOS 13+ and Swift 5.9+:

```sh
npm run run:macos
```

The first run may require allowing the app to observe window metadata in macOS privacy settings. If a title is unavailable, the badge still works with the foreground application name.

## Design boundary

This is a separate context utility. It does not alter model routing, prompts, permissions, billing, or agent presets.

## License

MIT
