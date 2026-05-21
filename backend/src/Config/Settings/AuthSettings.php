<?php

declare(strict_types=1);

namespace App\Config\Settings;

final readonly class AuthSettings
{
    public function __construct(
        public int $maxLoginAttempts,
        public int $lockoutMinutes,
        public int $throttleWindowMinutes,
        public int $refreshTtlSeconds,
        public int $emailVerifyTtlHours,
        public int $passwordResetTtlHours,
        public string $tokenPepper,
        public bool $csrfEnabled,
    ) {
    }
}
