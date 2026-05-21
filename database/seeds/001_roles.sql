-- Seed: roles
INSERT INTO roles (id, name, slug, description) VALUES
    (1, 'Buyer',  'buyer',  'Can browse, cart, checkout, and negotiate'),
    (2, 'Seller', 'seller', 'Can list and manage products'),
    (3, 'Admin',  'admin',  'Platform administration and audit access')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description);
