-- Seed: categories
INSERT INTO categories (id, uuid, parent_id, name, slug, description, sort_order) VALUES
    (1, 'a1000001-0000-4000-8000-000000000001', NULL, 'Rare Items',    'rare',    'Collectibles, limited editions, and one-of-a-kind pieces',  1),
    (2, 'a1000001-0000-4000-8000-000000000002', NULL, 'High-end Items','high-end','Premium luxury goods and designer items',                   2),
    (3, 'a1000001-0000-4000-8000-000000000003', NULL, 'Regular Items', 'regular', 'Everyday items and general merchandise',                     3)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);
