-- Seed: products and images

INSERT INTO products (id, uuid, seller_id, category_id, name, slug, description, price, compare_price, stock, status) VALUES
    (1, 'c1000001-0000-4000-8000-000000000001', 2, 2, 'Wireless Headphones', 'wireless-headphones',
     'Premium noise-cancelling wireless headphones with 30-hour battery life.', 149.99, 199.99, 25, 'active'),
    (2, 'c1000001-0000-4000-8000-000000000002', 2, 3, 'Mechanical Keyboard', 'mechanical-keyboard',
     'RGB mechanical keyboard with hot-swappable switches.', 89.99, NULL, 40, 'active'),
    (3, 'c1000001-0000-4000-8000-000000000003', 4, 1, 'Vintage Leather Jacket', 'vintage-leather-jacket',
     'Handcrafted leather jacket, limited edition.', 320.00, 380.00, 5, 'active'),
    (4, 'c1000001-0000-4000-8000-000000000004', 4, 3, 'Ceramic Planter Set', 'ceramic-planter-set',
     'Set of three minimalist ceramic planters.', 45.00, NULL, 100, 'active')
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), stock = VALUES(stock);

INSERT INTO product_images (uuid, product_id, url, alt_text, sort_order, is_primary) VALUES
    ('d1000001-0000-4000-8000-000000000001', 1, '/uploads/products/headphones-1.jpg', 'Wireless headphones front view', 0, 1),
    ('d1000001-0000-4000-8000-000000000002', 1, '/uploads/products/headphones-2.jpg', 'Wireless headphones side view',  1, 0),
    ('d1000001-0000-4000-8000-000000000003', 2, '/uploads/products/keyboard-1.jpg',   'Mechanical keyboard',          0, 1),
    ('d1000001-0000-4000-8000-000000000004', 3, '/uploads/products/jacket-1.jpg',     'Leather jacket',               0, 1),
    ('d1000001-0000-4000-8000-000000000005', 4, '/uploads/products/planter-1.jpg',    'Ceramic planter set',          0, 1)
ON DUPLICATE KEY UPDATE url = VALUES(url);
