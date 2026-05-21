-- Seed: categories
INSERT INTO categories (id, uuid, parent_id, name, slug, description, sort_order) VALUES
    (1, 'a1000001-0000-4000-8000-000000000001', NULL, 'Electronics',       'electronics',       'Devices and gadgets',           1),
    (2, 'a1000001-0000-4000-8000-000000000002', NULL, 'Fashion',           'fashion',           'Clothing and accessories',      2),
    (3, 'a1000001-0000-4000-8000-000000000003', NULL, 'Home & Garden',     'home-garden',       'Home improvement and outdoor',  3),
    (4, 'a1000001-0000-4000-8000-000000000004', 1,    'Audio',             'audio',             'Headphones and speakers',       1),
    (5, 'a1000001-0000-4000-8000-000000000005', 1,    'Computers',         'computers',         'Laptops and peripherals',       2)
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description);
