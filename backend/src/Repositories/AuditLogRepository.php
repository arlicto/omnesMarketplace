<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class AuditLogRepository
{
    public function __construct(private PDO $db)
    {
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO audit_logs (uuid, admin_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
             VALUES (:uuid, :admin_id, :action, :entity_type, :entity_id, :old_values, :new_values, :ip_address, :user_agent)'
        );
        $stmt->execute([
            'uuid' => $data['uuid'],
            'admin_id' => $data['admin_id'],
            'action' => $data['action'],
            'entity_type' => $data['entity_type'],
            'entity_id' => $data['entity_id'] ?? null,
            'old_values' => $data['old_values'] ?? null,
            'new_values' => $data['new_values'] ?? null,
            'ip_address' => $data['ip_address'] ?? null,
            'user_agent' => $data['user_agent'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    /** @return list<array<string, mixed>> */
    public function findAll(?int $limit = null, ?int $offset = null, ?string $action = null, ?string $entityType = null): array
    {
        $sql = 'SELECT al.*, u.username as admin_username 
                FROM audit_logs al
                LEFT JOIN users u ON al.admin_id = u.id
                WHERE 1=1';
        
        $params = [];

        if ($action !== null) {
            $sql .= ' AND al.action = :action';
            $params['action'] = $action;
        }

        if ($entityType !== null) {
            $sql .= ' AND al.entity_type = :entity_type';
            $params['entity_type'] = $entityType;
        }

        $sql .= ' ORDER BY al.created_at DESC';

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
        
        // Decode JSON values
        foreach ($results as &$result) {
            if (isset($result['old_values']) && is_string($result['old_values'])) {
                $result['old_values'] = json_decode($result['old_values'], true);
            }
            if (isset($result['new_values']) && is_string($result['new_values'])) {
                $result['new_values'] = json_decode($result['new_values'], true);
            }
        }

        return $results;
    }

    /** @return array<string, mixed>|null */
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT al.*, u.username as admin_username 
             FROM audit_logs al
             LEFT JOIN users u ON al.admin_id = u.id
             WHERE al.id = :id
             LIMIT 1'
        );
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row === false) {
            return null;
        }

        // Decode JSON values
        if (isset($row['old_values']) && is_string($row['old_values'])) {
            $row['old_values'] = json_decode($row['old_values'], true);
        }
        if (isset($row['new_values']) && is_string($row['new_values'])) {
            $row['new_values'] = json_decode($row['new_values'], true);
        }

        return $row;
    }

    public function count(?string $action = null, ?string $entityType = null): int
    {
        $sql = 'SELECT COUNT(*) FROM audit_logs WHERE 1=1';
        $params = [];

        if ($action !== null) {
            $sql .= ' AND action = :action';
            $params['action'] = $action;
        }

        if ($entityType !== null) {
            $sql .= ' AND entity_type = :entity_type';
            $params['entity_type'] = $entityType;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return (int) $stmt->fetchColumn();
    }
}
