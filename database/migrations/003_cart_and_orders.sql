-- Migration 003: Carts, orders
-- Version: 003_cart_and_orders

SET NAMES utf8mb4;

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

CREATE UNIQUE INDEX IF NOT EXISTS uq_carts_one_active_per_user
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
