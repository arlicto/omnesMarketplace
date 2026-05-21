<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class LoginAttemptRepository
{
    public function __construct(private PDO $db)
    {
    }

    public function record(string $email, string $ip, bool $successful): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO login_attempts (email, ip_address, successful) VALUES (:email, :ip, :success)'
        );
        $stmt->execute([
            'email' => strtolower(trim($email)),
            'ip' => $ip,
            'success' => $successful ? 1 : 0,
        ]);
    }

    public function countRecentFailures(string $email, string $ip, int $windowMinutes): int
    {
        $stmt = $this->db->prepare(
            'SELECT COUNT(*) FROM login_attempts
             WHERE successful = 0
               AND attempted_at > DATE_SUB(NOW(), INTERVAL :window MINUTE)
               AND (email = :email OR ip_address = :ip)'
        );
        $stmt->execute([
            'window' => $windowMinutes,
            'email' => strtolower(trim($email)),
            'ip' => $ip,
        ]);

        return (int) $stmt->fetchColumn();
    }
}
