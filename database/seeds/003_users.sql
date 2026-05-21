-- Seed: users and role assignments
-- Password for all demo accounts: Password123!

INSERT INTO users (id, uuid, username, email, password, first_name, last_name, status, email_verified_at) VALUES
    (1, 'b1000001-0000-4000-8000-000000000001', 'admin',   'admin@omnes.local',   '$2y$10$cCW4oMVXqaEtaBfgE.uhXu5/eqN2bfBQ32VUubR68eSJDju3mkVRe', 'Omnes',  'Admin',  'active', NOW()),
    (2, 'b1000001-0000-4000-8000-000000000002', 'seller1', 'seller@omnes.local',  '$2y$10$cCW4oMVXqaEtaBfgE.uhXu5/eqN2bfBQ32VUubR68eSJDju3mkVRe', 'Sarah',  'Seller', 'active', NOW()),
    (3, 'b1000001-0000-4000-8000-000000000003', 'buyer1',  'buyer@omnes.local',   '$2y$10$cCW4oMVXqaEtaBfgE.uhXu5/eqN2bfBQ32VUubR68eSJDju3mkVRe', 'James',  'Buyer',  'active', NOW()),
    (4, 'b1000001-0000-4000-8000-000000000004', 'seller2', 'seller2@omnes.local', '$2y$10$cCW4oMVXqaEtaBfgE.uhXu5/eqN2bfBQ32VUubR68eSJDju3mkVRe', 'Morgan', 'Lee',    'active', NOW())
ON DUPLICATE KEY UPDATE email = VALUES(email), status = VALUES(status);

INSERT INTO user_roles (user_id, role_id) VALUES
    (1, 3),
    (2, 2),
    (3, 1),
    (4, 2)
ON DUPLICATE KEY UPDATE assigned_at = CURRENT_TIMESTAMP;
