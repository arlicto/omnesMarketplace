-- Migration 002: Categories, products, product images
-- Version: 002_catalog

SET NAMES utf8mb4;

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
    image_url     VARCHAR(512)     NULL,
    thumbnail_url VARCHAR(512)     NULL,
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
