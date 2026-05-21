#!/usr/bin/env bash
# Run pending SQL migrations in order.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
MIGRATIONS_DIR="$ROOT/database/migrations"

DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-omnes_db}"
DB_USER="${DB_USER:-omnes_user}"

if [ -z "${DB_PASSWORD:-}" ]; then
  echo "DB_PASSWORD is required" >&2
  exit 1
fi

MYSQL=(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME")

echo "Ensuring schema_migrations table exists..."
"${MYSQL[@]}" -e "
CREATE TABLE IF NOT EXISTS schema_migrations (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    version VARCHAR(64) NOT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_schema_migrations_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
"

for file in $(ls "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
  version="$(basename "$file" .sql)"
  applied="$("${MYSQL[@]}" -Nse "SELECT COUNT(*) FROM schema_migrations WHERE version='$version'")"

  if [ "$applied" -eq 1 ]; then
    echo "Skip $version (already applied)"
    continue
  fi

  echo "Apply $version ..."
  "${MYSQL[@]}" < "$file"
  "${MYSQL[@]}" -e "INSERT INTO schema_migrations (version) VALUES ('$version')"
done

echo "Migrations complete."
