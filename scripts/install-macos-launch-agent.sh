#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT/macos"
swift build -c release
BIN=$(find .build -type f -path '*/release/context-badge-macos' -perm -111 -print -quit)
if [ -z "$BIN" ]; then
  echo "context-badge-macos binary not found" >&2
  exit 1
fi
BIN="$ROOT/macos/$BIN"

LABEL="com.mlamp.dsh-context-badge"
AGENT_DIR="$HOME/Library/LaunchAgents"
PLIST="$AGENT_DIR/$LABEL.plist"
mkdir -p "$AGENT_DIR"
sed "s|__BINARY__|$BIN|g" "$ROOT/macos/$LABEL.plist.template" > "$PLIST"

USER_ID=$(id -u)
launchctl bootout "gui/$USER_ID/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$USER_ID" "$PLIST"
launchctl kickstart -k "gui/$USER_ID/$LABEL"

echo "installed $LABEL"
echo "plist: $PLIST"
echo "binary: $BIN"
