<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class RefreshTokenRepository
{
    public function __construct(private PDO $db)
    {
    }

    public function store(int $userId, string $tokenHash, string $expiresAt, ?string $ip, ?string $userAgent): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent)
             VALUES (:user_id, :token_hash, :expires_at, :ip, :user_agent)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'token_hash' => $tokenHash,
            'expires_at' => $expiresAt,
            'ip' => $ip,
            'user_agent' => $userAgent,
        ]);
    }

    /** @return array<string, mixed>|null */
    public function findValid(string $tokenHash): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT rt.id, rt.user_id, rt.expires_at
             FROM refresh_tokens rt
             INNER JOIN users u ON u.id = rt.user_id AND u.deleted_at IS NULL
             WHERE rt.token_hash = :hash
               AND rt.revoked_at IS NULL
               AND rt.expires_at > NOW()
             LIMIT 1'
        );
        $stmt->execute(['hash' => $tokenHash]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    }

    public function revoke(string $tokenHash): void
    {
        $stmt = $this->db->prepare(
            'UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = :hash'
        );
        $stmt->execute(['hash' => $tokenHash]);
    }

    public function revokeAllForUser(int $userId): void
    {
        $stmt = $this->db->prepare(
            'UPDATE refresh_tokens SET revoked_at = NOW()
             WHERE user_id = :user_id AND revoked_at IS NULL'
        );
        $stmt->execute(['user_id' => $userId]);
    }
}

# update 1779719804
