-- Seed: sample cart, order, negotiation, notification, review

INSERT INTO carts (id, uuid, user_id, status) VALUES
    (1, 'e1000001-0000-4000-8000-000000000001', 3, 'active')
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO cart_items (cart_id, product_id, quantity, unit_price) VALUES
    (1, 1, 1, 149.99),
    (1, 2, 1, 89.99)
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), unit_price = VALUES(unit_price);

INSERT INTO orders (id, uuid, buyer_id, order_number, status, subtotal, tax_amount, shipping_amount, total_amount, placed_at) VALUES
    (1, 'f1000001-0000-4000-8000-000000000001', 3, 'OMN-2026-00001', 'delivered', 45.00, 3.60, 5.00, 53.60, NOW())
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO order_items (order_id, product_id, seller_id, product_name, product_slug, quantity, unit_price, line_total) VALUES
    (1, 4, 4, 'Ceramic Planter Set', 'ceramic-planter-set', 1, 45.00, 45.00)
ON DUPLICATE KEY UPDATE line_total = VALUES(line_total);

INSERT INTO negotiations (uuid, product_id, buyer_id, seller_id, status, offered_price, message, expires_at) VALUES
    ('g1000001-0000-4000-8000-000000000001', 3, 3, 4, 'open', 280.00, 'Would you accept $280?', DATE_ADD(NOW(), INTERVAL 7 DAY))
ON DUPLICATE KEY UPDATE status = VALUES(status), offered_price = VALUES(offered_price);

INSERT INTO notifications (uuid, user_id, type, title, body, entity_type, entity_id) VALUES
    ('h1000001-0000-4000-8000-000000000001', 3, 'order.delivered', 'Order delivered', 'Your order OMN-2026-00001 has been delivered.', 'order', 1),
    ('h1000001-0000-4000-8000-000000000002', 4, 'negotiation.offer',  'New offer received', 'A buyer offered $280 on Vintage Leather Jacket.', 'negotiation', 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO reviews (uuid, product_id, user_id, order_item_id, rating, title, body, is_verified) VALUES
    ('i1000001-0000-4000-8000-000000000001', 4, 3, 1, 5, 'Beautiful planters', 'Exactly as described, fast shipping.', 1)
ON DUPLICATE KEY UPDATE rating = VALUES(rating);

INSERT INTO admin_logs (uuid, admin_id, action, resource_type, resource_id, ip_address, metadata) VALUES
    ('j1000001-0000-4000-8000-000000000001', 1, 'user.view', 'user', 3, '127.0.0.1', JSON_OBJECT('reason', 'support_ticket'))
ON DUPLICATE KEY UPDATE action = VALUES(action), metadata = VALUES(metadata);
