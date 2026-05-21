<?php

declare(strict_types=1);

namespace App\Security;

final class TokenGenerator
{
    public static function opaque(int $bytes = 32): string
    {
        return bin2hex(random_bytes($bytes));
    }

    public static function hash(string $token, string $pepper = ''): string
    {
        return hash('sha256', $pepper . $token);
    }
}
