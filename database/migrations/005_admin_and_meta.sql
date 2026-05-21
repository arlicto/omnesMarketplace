-- Migration 005: Admin logs and migration tracking
-- Version: 005_admin_and_meta

SET NAMES utf8mb4;

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

CREATE TABLE IF NOT EXISTS schema_migrations (
    id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    version     VARCHAR(64)      NOT NULL,
    applied_at  TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_schema_migrations_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
