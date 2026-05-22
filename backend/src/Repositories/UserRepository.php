<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;
use PDOException;

final class UserRepository
{
    public function __construct(private PDO $db)
    {
    }

    /** @return array<string, mixed>|null */
    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT u.id, u.uuid, u.username, u.email, u.password, u.status,
                    u.email_verified_at, u.failed_login_attempts, u.locked_until, u.token_version
             FROM users u
             WHERE u.email = :email AND u.deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute(['email' => strtolower(trim($email))]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    }

    /** @return array<string, mixed>|null */
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT u.id, u.uuid, u.username, u.email, u.status, u.email_verified_at,
                    u.first_name, u.last_name, u.created_at
             FROM users u
             WHERE u.id = :id AND u.deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    }

    public function emailExists(string $email): bool
    {
        $stmt = $this->db->prepare(
            'SELECT 1 FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute(['email' => strtolower(trim($email))]);

        return (bool) $stmt->fetchColumn();
    }

    public function usernameExists(string $username): bool
    {
        $stmt = $this->db->prepare(
            'SELECT 1 FROM users WHERE username = :username AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute(['username' => trim($username)]);

        return (bool) $stmt->fetchColumn();
    }

    /** @param array{username: string, email: string, password: string, first_name?: string, last_name?: string} $data */
    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO users (uuid, username, email, password, first_name, last_name, status)
             VALUES (:uuid, :username, :email, :password, :first_name, :last_name, :status)'
        );
        $stmt->execute([
            'uuid' => $data['uuid'],
            'username' => $data['username'],
            'email' => strtolower($data['email']),
            'password' => $data['password'],
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'status' => 'pending',
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function assignRole(int $userId, string $roleSlug): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO user_roles (user_id, role_id)
             SELECT :user_id, r.id FROM roles r WHERE r.slug = :slug'
        );
        $stmt->execute(['user_id' => $userId, 'slug' => $roleSlug]);
    }

    /** @return list<string> */
    public function getRoleSlugs(int $userId): array
    {
        $stmt = $this->db->prepare(
            'SELECT r.slug FROM user_roles ur
             INNER JOIN roles r ON r.id = ur.role_id
             WHERE ur.user_id = :user_id'
        );
        $stmt->execute(['user_id' => $userId]);

        return $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];
    }

    public function markEmailVerified(int $userId): void
    {
        $stmt = $this->db->prepare(
            'UPDATE users SET email_verified_at = NOW(), status = :status, updated_at = NOW()
             WHERE id = :id'
        );
        $stmt->execute(['id' => $userId, 'status' => 'active']);
    }

    public function updatePassword(int $userId, string $passwordHash): void
    {
        $stmt = $this->db->prepare(
            'UPDATE users SET password = :password, updated_at = NOW() WHERE id = :id'
        );
        $stmt->execute(['id' => $userId, 'password' => $passwordHash]);
    }

    public function incrementTokenVersion(int $userId): void
    {
        $stmt = $this->db->prepare(
            'UPDATE users SET token_version = token_version + 1, updated_at = NOW() WHERE id = :id'
        );
        $stmt->execute(['id' => $userId]);
    }

    public function getTokenVersion(int $userId): int
    {
        $stmt = $this->db->prepare('SELECT token_version FROM users WHERE id = :id');
        $stmt->execute(['id' => $userId]);

        return (int) $stmt->fetchColumn();
    }

    public function recordFailedLogin(int $userId, int $maxAttempts, int $lockoutMinutes): void
    {
        $stmt = $this->db->prepare(
            'UPDATE users
             SET failed_login_attempts = failed_login_attempts + 1,
                 locked_until = IF(
                     failed_login_attempts + 1 >= :max_attempts,
                     DATE_ADD(NOW(), INTERVAL :lockout_minutes MINUTE),
                     locked_until
                 ),
                 updated_at = NOW()
             WHERE id = :id'
        );
        $stmt->execute([
            'id' => $userId,
            'max_attempts' => $maxAttempts,
            'lockout_minutes' => $lockoutMinutes,
        ]);
    }

    public function clearLoginFailures(int $userId): void
    {
        $stmt = $this->db->prepare(
            'UPDATE users
             SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW(), updated_at = NOW()
             WHERE id = :id'
        );
        $stmt->execute(['id' => $userId]);
    }

    public function isLocked(array $user): bool
    {
        if (empty($user['locked_until'])) {
            return false;
        }

        return strtotime((string) $user['locked_until']) > time();
    }

    /** @return list<array<string, mixed>> */
    public function findAll(?int $limit = null, ?int $offset = null, ?string $search = null, ?string $role = null, ?string $status = null): array
    {
        $sql = 'SELECT u.id, u.uuid, u.username, u.email, u.status, u.email_verified_at,
                u.first_name, u.last_name, u.created_at, u.updated_at,
                (SELECT GROUP_CONCAT(r.slug) FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = u.id) as roles
                FROM users u
                WHERE u.deleted_at IS NULL';
        
        $params = [];

        if ($search !== null && $search !== '') {
            $sql .= ' AND (u.username LIKE :search OR u.email LIKE :search)';
            $params['search'] = '%' . $search . '%';
        }

        if ($role !== null) {
            $sql .= ' AND EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = u.id AND r.slug = :role)';
            $params['role'] = $role;
        }

        if ($status !== null) {
            $sql .= ' AND u.status = :status';
            $params['status'] = $status;
        }

        $sql .= ' ORDER BY u.created_at DESC';

        if ($limit !== null) {
            $sql .= ' LIMIT :limit';
            $params['limit'] = $limit;
        }

        if ($offset !== null) {
            $sql .= ' OFFSET :offset';
            $params['offset'] = $offset;
        }

        $stmt = $this->db->prepare($sql);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        foreach ($results as &$row) {
            $row['roles'] = isset($row['roles']) && $row['roles'] !== '' ? explode(',', $row['roles']) : [];
        }
        unset($row);

        return $results;
    }

    public function count(?string $search = null, ?string $role = null, ?string $status = null): int
    {
        $sql = 'SELECT COUNT(*) FROM users WHERE deleted_at IS NULL';
        $params = [];

        if ($search !== null && $search !== '') {
            $sql .= ' AND (username LIKE :search OR email LIKE :search)';
            $params['search'] = '%' . $search . '%';
        }

        if ($role !== null) {
            $sql .= ' AND EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = users.id AND r.slug = :role)';
            $params['role'] = $role;
        }

        if ($status !== null) {
            $sql .= ' AND status = :status';
            $params['status'] = $status;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return (int) $stmt->fetchColumn();
    }

    public function countByRole(string $roleSlug): int
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM user_roles ur
             JOIN roles r ON r.id = ur.role_id
             JOIN users u ON u.id = ur.user_id
             WHERE r.slug = :slug AND u.deleted_at IS NULL'
        );
        $stmt->execute(['slug' => $roleSlug]);

        return (int) $stmt->fetchColumn();
    }

    public function updateRole(int $userId, string $roleSlug): bool
    {
        $stmt = $this->db->prepare(
            'INSERT INTO user_roles (user_id, role_id)
             SELECT :user_id, r.id FROM roles r WHERE r.slug = :slug
             ON DUPLICATE KEY UPDATE assigned_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute(['user_id' => $userId, 'slug' => $roleSlug]);

        return $stmt->rowCount() > 0;
    }

    public function banUser(int $userId, string $reason, ?int $durationDays = null): bool
    {
        $sql = 'UPDATE users SET status = :status, updated_at = CURRENT_TIMESTAMP';
        $params = ['id' => $userId, 'status' => 'banned'];

        if ($durationDays !== null) {
            $sql .= ', locked_until = DATE_ADD(NOW(), INTERVAL :days DAY)';
            $params['days'] = $durationDays;
        }

        $sql .= ' WHERE id = :id AND deleted_at IS NULL';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->rowCount() > 0;
    }

    public function unbanUser(int $userId): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE users SET status = :status, locked_until = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = :id AND deleted_at IS NULL'
        );
        $stmt->execute(['id' => $userId, 'status' => 'active']);

        return $stmt->rowCount() > 0;
    }

    public function delete(int $userId): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id AND deleted_at IS NULL'
        );
        $stmt->execute(['id' => $userId]);

        return $stmt->rowCount() > 0;
    }
}
