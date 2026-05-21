<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class NotificationRepository
{
    public function __construct(private PDO $db)
    {
    }

    /** @return array<string, mixed>|null */
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM notifications 
             WHERE id = :id AND deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    /** @return array<string, mixed>|null */
    public function findByUuid(string $uuid): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM notifications 
             WHERE uuid = :uuid AND deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute(['uuid' => $uuid]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO notifications (uuid, user_id, type, title, message, data, expires_at)
             VALUES (:uuid, :user_id, :type, :title, :message, :data, :expires_at)'
        );
        $stmt->execute([
            'uuid' => $data['uuid'],
            'user_id' => $data['user_id'],
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'data' => isset($data['data']) ? json_encode($data['data']) : null,
            'expires_at' => $data['expires_at'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    /** @return list<array<string, mixed>> */
    public function findByUser(int $userId, ?int $limit = null, ?int $offset = null, ?bool $unreadOnly = null): array
    {
        $sql = 'SELECT * FROM notifications 
                WHERE user_id = :user_id AND deleted_at IS NULL';
        
        $params = ['user_id' => $userId];

        if ($unreadOnly === true) {
            $sql .= ' AND is_read = FALSE';
        }

        $sql .= ' ORDER BY created_at DESC';

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
        
        // Decode JSON data
        foreach ($results as &$result) {
            if (isset($result['data']) && is_string($result['data'])) {
                $result['data'] = json_decode($result['data'], true);
            }
        }

        return $results;
    }

    public function markAsRead(int $id, int $userId): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE notifications 
             SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
             WHERE id = :id AND user_id = :user_id AND deleted_at IS NULL'
        );
        $stmt->execute(['id' => $id, 'user_id' => $userId]);

        return $stmt->rowCount() > 0;
    }

    public function markAllAsRead(int $userId): int
    {
        $stmt = $this->db->prepare(
            'UPDATE notifications 
             SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
             WHERE user_id = :user_id AND is_read = FALSE AND deleted_at IS NULL'
        );
        $stmt->execute(['user_id' => $userId]);

        return $stmt->rowCount();
    }

    public function getUnreadCount(int $userId): int
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM notifications 
             WHERE user_id = :user_id AND is_read = FALSE AND deleted_at IS NULL'
        );
        $stmt->execute(['user_id' => $userId]);

        return (int) $stmt->fetchColumn();
    }

    public function deleteExpired(): int
    {
        $stmt = $this->db->prepare(
            'UPDATE notifications 
             SET deleted_at = CURRENT_TIMESTAMP 
             WHERE expires_at < NOW() AND deleted_at IS NULL'
        );
        $stmt->execute();

        return $stmt->rowCount();
    }

    public function delete(int $id, int $userId): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE notifications 
             SET deleted_at = CURRENT_TIMESTAMP 
             WHERE id = :id AND user_id = :user_id AND deleted_at IS NULL'
        );
        $stmt->execute(['id' => $id, 'user_id' => $userId]);

        return $stmt->rowCount() > 0;
    }
}
