#!/bin/sh
set -eu

python="$(dirname "$0")/../../.venv/bin/python"

if [ ! -x "$python" ]; then
  printf '%s\n' "Harness interpreter is unavailable: $python" >&2
  exit 127
fi

if ! "$python" -c 'import mcp' >/dev/null 2>&1; then
  printf '%s\n' 'Harness dependency is unavailable: mcp' >&2
  exit 126
fi

exec "$python" -m unittest discover -s scripts/harness/tests
