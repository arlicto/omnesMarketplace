-- Least-privilege grants for application database user
-- Run as MySQL root after schema is created.
--
-- Usage:
--   mysql -u root -p < database/grants/least_privilege.sql
--
-- Replace omnes_app@% with your application user/host.

-- Application runtime user (SELECT, INSERT, UPDATE, DELETE only — no DDL)
CREATE USER IF NOT EXISTS 'omnes_app'@'%' IDENTIFIED BY 'CHANGE_ME_STRONG_APP_DB_PASSWORD';

GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.users             TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.user_roles        TO 'omnes_app'@'%';
GRANT SELECT                         ON omnes_db.roles             TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.categories        TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.products          TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.product_images    TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.carts             TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.cart_items        TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.orders            TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.order_items       TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.negotiations      TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.notifications     TO 'omnes_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON omnes_db.reviews           TO 'omnes_app'@'%';
GRANT SELECT, INSERT                 ON omnes_db.admin_logs        TO 'omnes_app'@'%';
GRANT SELECT                         ON omnes_db.schema_migrations TO 'omnes_app'@'%';

-- Migration user (DDL — CI/deploy only, not used by PHP runtime)
CREATE USER IF NOT EXISTS 'omnes_migrate'@'%' IDENTIFIED BY 'CHANGE_ME_STRONG_MIGRATE_PASSWORD';

GRANT ALL PRIVILEGES ON omnes_db.* TO 'omnes_migrate'@'%';

FLUSH PRIVILEGES;

# 1779720037930663778
