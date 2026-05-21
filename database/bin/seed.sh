#!/usr/bin/env bash
# Load seed data in order.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SEEDS_DIR="$ROOT/database/seeds"

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-omnes_db}"
DB_USER="${DB_USER:-omnes_user}"

if [ -z "${DB_PASSWORD:-}" ]; then
  echo "DB_PASSWORD is required" >&2
  exit 1
fi

MYSQL=(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME")

for file in $(ls "$SEEDS_DIR"/[0-9]*.sql 2>/dev/null | sort); do
  echo "Seed $(basename "$file") ..."
  "${MYSQL[@]}" < "$file"
done

echo "Seeding complete."
