<?php

declare(strict_types=1);

namespace App\Config\Security;

use App\Repositories\AuditLogRepository;

/**
 * Audit logger for admin actions.
 * Logs all admin operations for security and compliance.
 */
final class AuditLogger
{
    public function __construct(private AuditLogRepository $auditLogs)
    {
    }

    /**
     * Log an admin action.
     * 
     * @param int $adminId
     * @param string $action
     * @param string $entityType
     * @param int|null $entityId
     * @param array<string, mixed>|null $oldValues
     * @param array<string, mixed>|null $newValues
     * @param string|null $ip
     * @param string|null $userAgent
     * @return int
     */
    public function log(
        int $adminId,
        string $action,
        string $entityType,
        ?int $entityId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $ip = null,
        ?string $userAgent = null
    ): int {
        $uuid = $this->generateUuid();

        return $this->auditLogs->create([
            'uuid' => $uuid,
            'admin_id' => $adminId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_values' => $oldValues !== null ? json_encode($oldValues) : null,
            'new_values' => $newValues !== null ? json_encode($newValues) : null,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
        ]);
    }

    /**
     * Log user management action.
     */
    public function logUserAction(
        int $adminId,
        string $action,
        int $targetUserId,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $ip = null,
        ?string $userAgent = null
    ): int {
        return $this->log(
            $adminId,
            $action,
            'user',
            $targetUserId,
            $oldValues,
            $newValues,
            $ip,
            $userAgent
        );
    }

    /**
     * Log product management action.
     */
    public function logProductAction(
        int $adminId,
        string $action,
        int $productId,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $ip = null,
        ?string $userAgent = null
    ): int {
        return $this->log(
            $adminId,
            $action,
            'product',
            $productId,
            $oldValues,
            $newValues,
            $ip,
            $userAgent
        );
    }

    /**
     * Log negotiation management action.
     */
    public function logNegotiationAction(
        int $adminId,
        string $action,
        int $negotiationId,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $ip = null,
        ?string $userAgent = null
    ): int {
        return $this->log(
            $adminId,
            $action,
            'negotiation',
            $negotiationId,
            $oldValues,
            $newValues,
            $ip,
            $userAgent
        );
    }

    /**
     * Log order management action.
     */
    public function logOrderAction(
        int $adminId,
        string $action,
        int $orderId,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $ip = null,
        ?string $userAgent = null
    ): int {
        return $this->log(
            $adminId,
            $action,
            'order',
            $orderId,
            $oldValues,
            $newValues,
            $ip,
            $userAgent
        );
    }

    /**
     * Log moderation action.
     */
    public function logModerationAction(
        int $adminId,
        string $action,
        string $targetType,
        int $targetId,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $ip = null,
        ?string $userAgent = null
    ): int {
        return $this->log(
            $adminId,
            $action,
            $targetType,
            $targetId,
            $oldValues,
            $newValues,
            $ip,
            $userAgent
        );
    }

    private function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
