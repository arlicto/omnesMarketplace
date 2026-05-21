-- =============================================================================
-- Omnes Marketplace — MySQL 8.0 Schema
-- Normalized, constraint-enforced, indexed for scale
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- Roles & users
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
    id          TINYINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name        VARCHAR(32)      NOT NULL,
    slug        VARCHAR(32)      NOT NULL,
    description VARCHAR(255)     NULL,
    created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_roles_slug (slug),
    CONSTRAINT chk_roles_slug CHECK (slug IN ('buyer', 'seller', 'admin'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid          CHAR(36)         NOT NULL,
    username      VARCHAR(64)      NOT NULL,
    email         VARCHAR(255)     NOT NULL,
    password      VARCHAR(255)     NOT NULL,
    first_name    VARCHAR(100)     NULL,
    last_name     VARCHAR(100)     NULL,
    phone         VARCHAR(32)      NULL,
    status        ENUM('active', 'suspended', 'pending') NOT NULL DEFAULT 'active',
    failed_login_attempts INT UNSIGNED NOT NULL DEFAULT 0,
    locked_until  TIMESTAMP        NULL DEFAULT NULL,
    token_version INT UNSIGNED     NOT NULL DEFAULT 1,
    email_verified_at TIMESTAMP    NULL,
    last_login_at TIMESTAMP        NULL,
    created_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP        NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_uuid (uuid),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_created_at (created_at),
    KEY idx_users_deleted_at (deleted_at),
    KEY idx_users_status (status),
    CONSTRAINT chk_users_email_format CHECK (email REGEXP '^[^@]+@[^@]+\\.[^@]+$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
    user_id     BIGINT UNSIGNED  NOT NULL,
    role_id     TINYINT UNSIGNED NOT NULL,
    assigned_at TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    KEY idx_user_roles_role_id (role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Catalog
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS categories (
    id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    uuid        CHAR(36)         NOT NULL,
    parent_id   INT UNSIGNED     NULL,
    name        VARCHAR(120)     NOT NULL,
    slug        VARCHAR(120)     NOT NULL,
    description TEXT             NULL,
    sort_order  INT              NOT NULL DEFAULT 0,
    is_active   TINYINT(1)       NOT NULL DEFAULT 1,
    created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP        NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_categories_uuid (uuid),
    UNIQUE KEY uq_categories_slug (slug),
    KEY idx_categories_parent_id (parent_id),
    KEY idx_categories_deleted_at (deleted_at),
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories (id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid          CHAR(36)         NOT NULL,
    seller_id     BIGINT UNSIGNED  NOT NULL,
    category_id   INT UNSIGNED     NULL,
    name          VARCHAR(255)     NOT NULL,
    slug          VARCHAR(255)     NOT NULL,
    description   TEXT             NULL,
    price         DECIMAL(12, 2)   NOT NULL,
    compare_price DECIMAL(12, 2)   NULL,
    stock         INT UNSIGNED     NOT NULL DEFAULT 0,
    status        ENUM('draft', 'active', 'sold', 'archived') NOT NULL DEFAULT 'draft',
    currency      CHAR(3)          NOT NULL DEFAULT 'USD',
    created_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP        NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_products_uuid (uuid),
    UNIQUE KEY uq_products_seller_slug (seller_id, slug),
    KEY idx_products_seller_id (seller_id),
    KEY idx_products_category_id (category_id),
    KEY idx_products_created_at (created_at),
    KEY idx_products_status_deleted (status, deleted_at),
    KEY idx_products_seller_created (seller_id, created_at),
    FULLTEXT KEY ft_products_search (name, description),
    CONSTRAINT fk_products_seller FOREIGN KEY (seller_id) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_products_price CHECK (price >= 0),
    CONSTRAINT chk_products_compare_price CHECK (compare_price IS NULL OR compare_price >= 0),
    CONSTRAINT chk_products_stock CHECK (stock >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_images (
    id          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid        CHAR(36)         NOT NULL,
    product_id  BIGINT UNSIGNED  NOT NULL,
    url         VARCHAR(512)     NOT NULL,
    alt_text    VARCHAR(255)     NULL,
    sort_order  INT              NOT NULL DEFAULT 0,
    is_primary  TINYINT(1)       NOT NULL DEFAULT 0,
    created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at  TIMESTAMP        NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_product_images_uuid (uuid),
    KEY idx_product_images_product_id (product_id),
    KEY idx_product_images_sort (product_id, sort_order),
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Cart
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS carts (
    id          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid        CHAR(36)         NOT NULL,
    user_id     BIGINT UNSIGNED  NOT NULL,
    status      ENUM('active', 'converted', 'abandoned') NOT NULL DEFAULT 'active',
    created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_carts_uuid (uuid),
    KEY idx_carts_user_id (user_id),
    KEY idx_carts_user_status (user_id, status),
    KEY idx_carts_created_at (created_at),
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One active cart per user (MySQL 8 functional unique index)
CREATE UNIQUE INDEX uq_carts_one_active_per_user
    ON carts ((IF(status = 'active', user_id, NULL)));

CREATE TABLE IF NOT EXISTS cart_items (
    id          BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    cart_id     BIGINT UNSIGNED  NOT NULL,
    product_id  BIGINT UNSIGNED  NOT NULL,
    quantity    INT UNSIGNED     NOT NULL DEFAULT 1,
    unit_price  DECIMAL(12, 2)   NOT NULL,
    created_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_cart_items_cart_product (cart_id, product_id),
    KEY idx_cart_items_product_id (product_id),
    KEY idx_cart_items_created_at (created_at),
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_cart_items_quantity CHECK (quantity >= 1),
    CONSTRAINT chk_cart_items_unit_price CHECK (unit_price >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Orders
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS orders (
    id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid            CHAR(36)         NOT NULL,
    buyer_id        BIGINT UNSIGNED  NOT NULL,
    order_number    VARCHAR(32)      NOT NULL,
    status          ENUM('pending', 'confirmed', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')
                    NOT NULL DEFAULT 'pending',
    subtotal        DECIMAL(12, 2)   NOT NULL DEFAULT 0.00,
    tax_amount      DECIMAL(12, 2)   NOT NULL DEFAULT 0.00,
    shipping_amount DECIMAL(12, 2)   NOT NULL DEFAULT 0.00,
    total_amount    DECIMAL(12, 2)   NOT NULL DEFAULT 0.00,
    currency        CHAR(3)          NOT NULL DEFAULT 'USD',
    notes           TEXT             NULL,
    placed_at       TIMESTAMP        NULL,
    created_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP        NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_orders_uuid (uuid),
    UNIQUE KEY uq_orders_order_number (order_number),
    KEY idx_orders_buyer_id (buyer_id),
    KEY idx_orders_created_at (created_at),
    KEY idx_orders_status (status),
    KEY idx_orders_buyer_created (buyer_id, created_at),
    CONSTRAINT fk_orders_buyer FOREIGN KEY (buyer_id) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_orders_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_orders_total CHECK (total_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    order_id        BIGINT UNSIGNED  NOT NULL,
    product_id      BIGINT UNSIGNED  NOT NULL,
    seller_id       BIGINT UNSIGNED  NOT NULL,
    product_name    VARCHAR(255)     NOT NULL,
    product_slug    VARCHAR(255)     NOT NULL,
    quantity        INT UNSIGNED     NOT NULL,
    unit_price      DECIMAL(12, 2)   NOT NULL,
    line_total      DECIMAL(12, 2)   NOT NULL,
    created_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_order_items_order_id (order_id),
    KEY idx_order_items_product_id (product_id),
    KEY idx_order_items_seller_id (seller_id),
    KEY idx_order_items_created_at (created_at),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_seller FOREIGN KEY (seller_id) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_order_items_quantity CHECK (quantity >= 1),
    CONSTRAINT chk_order_items_unit_price CHECK (unit_price >= 0),
    CONSTRAINT chk_order_items_line_total CHECK (line_total >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Negotiations
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS negotiations (
    id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid            CHAR(36)         NOT NULL,
    product_id      BIGINT UNSIGNED  NOT NULL,
    buyer_id        BIGINT UNSIGNED  NOT NULL,
    seller_id       BIGINT UNSIGNED  NOT NULL,
    status          ENUM('open', 'accepted', 'rejected', 'cancelled', 'expired') NOT NULL DEFAULT 'open',
    offered_price   DECIMAL(12, 2)   NOT NULL,
    counter_price   DECIMAL(12, 2)   NULL,
    message         TEXT             NULL,
    expires_at      TIMESTAMP        NULL,
    resolved_at     TIMESTAMP        NULL,
    created_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at      TIMESTAMP        NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_negotiations_uuid (uuid),
    KEY idx_negotiations_product_id (product_id),
    KEY idx_negotiations_buyer_id (buyer_id),
    KEY idx_negotiations_seller_id (seller_id),
    KEY idx_negotiations_created_at (created_at),
    KEY idx_negotiations_status (status),
    CONSTRAINT fk_negotiations_product FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_negotiations_buyer FOREIGN KEY (buyer_id) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_negotiations_seller FOREIGN KEY (seller_id) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_negotiations_offered_price CHECK (offered_price >= 0),
    CONSTRAINT chk_negotiations_counter_price CHECK (counter_price IS NULL OR counter_price >= 0),
    CONSTRAINT chk_negotiations_parties CHECK (buyer_id <> seller_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Notifications
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notifications (
    id           BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid         CHAR(36)         NOT NULL,
    user_id      BIGINT UNSIGNED  NOT NULL,
    type         VARCHAR(64)      NOT NULL,
    title        VARCHAR(255)     NOT NULL,
    body         TEXT             NOT NULL,
    entity_type  VARCHAR(64)      NULL,
    entity_id    BIGINT UNSIGNED  NULL,
    read_at      TIMESTAMP        NULL,
    created_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_notifications_uuid (uuid),
    KEY idx_notifications_user_id (user_id),
    KEY idx_notifications_created_at (created_at),
    KEY idx_notifications_user_unread (user_id, read_at),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Reviews
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS reviews (
    id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid          CHAR(36)         NOT NULL,
    product_id    BIGINT UNSIGNED  NOT NULL,
    user_id       BIGINT UNSIGNED  NOT NULL,
    order_item_id BIGINT UNSIGNED  NULL,
    rating        TINYINT UNSIGNED NOT NULL,
    title         VARCHAR(255)     NULL,
    body          TEXT             NULL,
    is_verified   TINYINT(1)       NOT NULL DEFAULT 0,
    created_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at    TIMESTAMP        NULL DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_reviews_uuid (uuid),
    UNIQUE KEY uq_reviews_user_product (user_id, product_id),
    KEY idx_reviews_product_id (product_id),
    KEY idx_reviews_user_id (user_id),
    KEY idx_reviews_created_at (created_at),
    KEY idx_reviews_order_item_id (order_item_id),
    CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_order_item FOREIGN KEY (order_item_id) REFERENCES order_items (id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Admin audit
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_logs (
    id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid          CHAR(36)         NOT NULL,
    admin_id      BIGINT UNSIGNED  NOT NULL,
    action        VARCHAR(64)      NOT NULL,
    resource_type VARCHAR(64)      NOT NULL,
    resource_id   BIGINT UNSIGNED  NULL,
    ip_address    VARCHAR(45)      NULL,
    user_agent    VARCHAR(512)     NULL,
    metadata      JSON             NULL,
    created_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_admin_logs_uuid (uuid),
    KEY idx_admin_logs_admin_id (admin_id),
    KEY idx_admin_logs_created_at (created_at),
    KEY idx_admin_logs_resource (resource_type, resource_id),
    CONSTRAINT fk_admin_logs_admin FOREIGN KEY (admin_id) REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Migration tracking
-- -----------------------------------------------------------------------------

-- -----------------------------------------------------------------------------
-- Authentication
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id      BIGINT UNSIGNED NOT NULL,
    token_hash   CHAR(64)        NOT NULL,
    expires_at   TIMESTAMP       NOT NULL,
    revoked_at   TIMESTAMP       NULL DEFAULT NULL,
    ip_address   VARCHAR(45)     NULL,
    user_agent   VARCHAR(512)    NULL,
    created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_refresh_tokens_hash (token_hash),
    KEY idx_refresh_tokens_user_id (user_id),
    KEY idx_refresh_tokens_expires (expires_at),
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS auth_tokens (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id    BIGINT UNSIGNED NOT NULL,
    type       ENUM('email_verify', 'password_reset') NOT NULL,
    token_hash CHAR(64)        NOT NULL,
    expires_at TIMESTAMP       NOT NULL,
    used_at    TIMESTAMP       NULL DEFAULT NULL,
    created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_auth_tokens_hash (token_hash),
    KEY idx_auth_tokens_user_type (user_id, type),
    KEY idx_auth_tokens_expires (expires_at),
    CONSTRAINT fk_auth_tokens_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS login_attempts (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email        VARCHAR(255)    NOT NULL,
    ip_address   VARCHAR(45)     NOT NULL,
    successful   TINYINT(1)      NOT NULL DEFAULT 0,
    attempted_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_login_attempts_email_time (email, attempted_at),
    KEY idx_login_attempts_ip_time (ip_address, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS schema_migrations (
    id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    version     VARCHAR(64)      NOT NULL,
    applied_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_schema_migrations_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
