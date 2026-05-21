# Indexing Strategy

Indexes are chosen for **read-heavy marketplace workloads**: catalog browse, seller dashboards, order history, and search.

## Required performance indexes

| Column(s) | Table(s) | Index name | Query pattern |
|-----------|----------|------------|---------------|
| `email` | `users` | `uq_users_email` (unique) | Login, registration lookup |
| `seller_id` | `products`, `order_items`, `negotiations` | `idx_products_seller_id`, etc. | Seller catalog & fulfillment |
| `product_id` | `cart_items`, `order_items`, `reviews`, `negotiations`, `product_images` | `idx_*_product_id` | Product detail, aggregates |
| `created_at` | All major entities | `idx_*_created_at` | Chronological feeds, admin audit |
| `order_id` | `order_items` | `idx_order_items_order_id` | Order detail page |

## Composite indexes

| Index | Table | Serves |
|-------|-------|--------|
| `(seller_id, created_at)` | `products` | Seller inventory sorted by newest |
| `(status, deleted_at)` | `products` | Active catalog without soft-deleted rows |
| `(buyer_id, created_at)` | `orders` | Buyer order history |
| `(user_id, read_at)` | `notifications` | Unread notification count |
| `(seller_id, status, created_at)` | `negotiations` | Seller negotiation inbox |
| `(product_id, rating, deleted_at)` | `reviews` | Rating summary per product |

## Full-text search

```sql
FULLTEXT KEY ft_products_search (name, description)
```

**Example query:**

```sql
SELECT id, name, price
FROM products
WHERE status = 'active'
  AND deleted_at IS NULL
  AND MATCH(name, description) AGAINST(:term IN NATURAL LANGUAGE MODE)
ORDER BY created_at DESC
LIMIT 20;
```

Use `IN NATURAL LANGUAGE MODE` for user-facing search; `BOOLEAN MODE` for advanced filters (`+wireless -refurbished`).

### Search optimization notes

1. Filter with `status` and `deleted_at` **before** or **after** fulltext — MySQL may use `idx_products_status_deleted` to reduce rows first on browse pages; for search-only endpoints, fulltext drives the plan.
2. Keep `description` in FULLTEXT; add `name` prefix index only if you need `LIKE 'term%'` fallback.
3. For scale beyond ~1M products, consider Elasticsearch/OpenSearch synced from `products` via CDC.

## UUID indexes

Every public entity has `UNIQUE KEY uq_*_uuid (uuid)` for O(1) API lookups:

```sql
SELECT * FROM products WHERE uuid = :uuid AND deleted_at IS NULL;
```

## Soft-delete queries

Always include `deleted_at IS NULL` (or `WHERE deleted_at IS NULL`) in application queries. Indexes on `deleted_at` help admin “trash” views:

```sql
SELECT * FROM products WHERE seller_id = :id AND deleted_at IS NOT NULL;
```

## Migration 006 extras

`006_search_indexes.sql` adds secondary composites idempotently (`CREATE INDEX IF NOT EXISTS`) for:

- Category browsing (`is_active`, `sort_order`, `deleted_at`)
- Notification type feeds
- Order status dashboards

## Maintenance

- Run `ANALYZE TABLE` after large seed imports.
- Monitor slow queries on `order_items` joins — `idx_order_items_order_id` is critical.
- Avoid over-indexing write-heavy tables (`cart_items` has only necessary keys).

## Least privilege

Application user `omnes_app` has **no DDL** privileges. Index changes run via `omnes_migrate` in CI/deploy only (`database/grants/least_privilege.sql`).
