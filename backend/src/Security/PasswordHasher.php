<?php

declare(strict_types=1);

namespace App\Security;

final class PasswordHasher
{
    private const BCRYPT_COST = 12;

    public static function hash(string $plainPassword): string
    {
        if (defined('PASSWORD_ARGON2ID')) {
            return password_hash($plainPassword, PASSWORD_ARGON2ID, [
                'memory_cost' => 65536,
                'time_cost' => 4,
                'threads' => 3,
            ]);
        }

        return password_hash($plainPassword, PASSWORD_BCRYPT, ['cost' => self::BCRYPT_COST]);
    }

    public static function verify(string $plainPassword, string $hash): bool
    {
        if ($hash === '') {
            return false;
        }

        return password_verify($plainPassword, $hash);
    }

    public static function needsRehash(string $hash): bool
    {
        $algo = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;
        $options = $algo === PASSWORD_BCRYPT ? ['cost' => self::BCRYPT_COST] : [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 3,
        ];

        return password_needs_rehash($hash, $algo, $options);
    }
}
