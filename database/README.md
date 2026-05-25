# Omnes Marketplace Database

MySQL 8.0 schema for a scalable multi-vendor marketplace.

## Layout

```
database/
├── schema.sql              # Full schema (Docker first-time init)
├── migrations/             # Versioned migrations (001–006)
├── seeds/                  # Demo data
├── grants/least_privilege.sql
├── bin/
│   ├── migrate.sh          # Apply pending migrations
│   └── seed.sh             # Load seed data
└── docs/
    ├── ERD.md
    └── INDEXING.md
```

## Quick start (Docker)

On first `docker compose up`, `schema.sql` is loaded automatically.

```bash
# Optional: seed demo data
export DB_PASSWORD=your_password
./database/bin/seed.sh
```

## Manual migrate + seed

```bash
export DB_HOST=127.0.0.1 DB_PORT=3307 DB_PASSWORD=...
./database/bin/migrate.sh
./database/bin/seed.sh
```

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@omnes.local | Password123! |
| Seller | seller@omnes.local | Password123! |
| Buyer | buyer@omnes.local | Password123! |

## Security

- Foreign keys prevent orphaned rows (see [ERD.md](docs/ERD.md))
- `ON DELETE RESTRICT` on financial and catalog references
- Least-privilege DB users in [grants/least_privilege.sql](grants/least_privilege.sql)
- Soft deletes preserve referential integrity

## Documentation

- [ERD explanation](docs/ERD.md)
- [Indexing explanation](docs/INDEXING.md)

## Legacy upgrade

The original two-table schema (`users`, `products` only) is replaced by this design. For existing dev databases, recreate:

```bash
docker compose down -v
docker compose up -d db
./database/bin/seed.sh
```

# 1779720433203218780
