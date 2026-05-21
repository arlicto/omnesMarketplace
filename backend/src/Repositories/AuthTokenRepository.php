<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class AuthTokenRepository
{
    public function __construct(private PDO $db)
    {
    }

    public function create(int $userId, string $type, string $tokenHash, string $expiresAt): void
    {
        $this->invalidateUnused($userId, $type);

        $stmt = $this->db->prepare(
            'INSERT INTO auth_tokens (user_id, type, token_hash, expires_at)
             VALUES (:user_id, :type, :token_hash, :expires_at)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'type' => $type,
            'token_hash' => $tokenHash,
            'expires_at' => $expiresAt,
        ]);
    }

    /** @return array<string, mixed>|null */
    public function findValid(string $type, string $tokenHash): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT at.id, at.user_id, at.expires_at
             FROM auth_tokens at
             INNER JOIN users u ON u.id = at.user_id AND u.deleted_at IS NULL
             WHERE at.type = :type
               AND at.token_hash = :hash
               AND at.used_at IS NULL
               AND at.expires_at > NOW()
             LIMIT 1'
        );
        $stmt->execute(['type' => $type, 'hash' => $tokenHash]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    }

    public function markUsed(int $id): void
    {
        $stmt = $this->db->prepare('UPDATE auth_tokens SET used_at = NOW() WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }

    private function invalidateUnused(int $userId, string $type): void
    {
        $stmt = $this->db->prepare(
            'UPDATE auth_tokens SET used_at = NOW()
             WHERE user_id = :user_id AND type = :type AND used_at IS NULL'
        );
        $stmt->execute(['user_id' => $userId, 'type' => $type]);
    }
}
