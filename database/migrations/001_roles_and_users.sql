-- Migration 001: Roles and users
-- Version: 001_roles_and_users

SET NAMES utf8mb4;

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
