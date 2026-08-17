#!/bin/sh
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$ROOT/macos"
swift build -c release
BIN=$(find .build -type f -path '*/release/context-badge-macos' -perm -111 -print -quit)
if [ -z "$BIN" ]; then
  echo "context-badge-macos binary was not produced" >&2
  exit 1
fi
exec "$BIN"
