-- Migration 004: Negotiations, notifications, reviews
-- Version: 004_engagement

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS negotiations (
    id              BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
    uuid            CHAR(36)         NOT NULL,
    product_id      BIGINT UNSIGNED  NOT NULL,
    buyer_id        BIGINT UNSIGNED  NOT NULL,
    seller_id       BIGINT UNSIGNED  NOT NULL,
    status          ENUM('open', 'pending', 'countered', 'accepted', 'rejected', 'cancelled', 'expired') NOT NULL DEFAULT 'open',
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
