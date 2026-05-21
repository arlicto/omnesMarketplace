-- Migration 006: Additional search and performance indexes
-- Version: 006_search_indexes
-- Idempotent: safe to re-run

SET NAMES utf8mb4;

-- Product search (FULLTEXT may already exist from 002; ignore duplicate errors in runner)
-- ALTER TABLE products ADD FULLTEXT INDEX ft_products_search (name, description);

-- Category browse
CREATE INDEX IF NOT EXISTS idx_categories_active_sort
    ON categories (is_active, sort_order, deleted_at);

-- Notification feed pagination
CREATE INDEX IF NOT EXISTS idx_notifications_type_created
    ON notifications (type, created_at);

-- Negotiation inbox by seller
CREATE INDEX IF NOT EXISTS idx_negotiations_seller_status_created
    ON negotiations (seller_id, status, created_at);

-- Order history filters
CREATE INDEX IF NOT EXISTS idx_orders_status_created
    ON orders (status, created_at);

-- Review aggregates per product
CREATE INDEX IF NOT EXISTS idx_reviews_product_rating
    ON reviews (product_id, rating, deleted_at);
