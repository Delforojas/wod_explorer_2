#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" != "--apply" ]]; then
  printf '%s\n' 'This command changes the configured database. Re-run with --apply after reviewing the migration.' >&2
  exit 2
fi

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

docker compose exec -T mysql sh -c \
  'MYSQL_PWD="$MYSQL_PASSWORD" mysql --protocol=tcp --host=127.0.0.1 --user="$MYSQL_USER" --database="$MYSQL_DATABASE"' \
  < Docker/mysql/init/002_google_oauth.sql
