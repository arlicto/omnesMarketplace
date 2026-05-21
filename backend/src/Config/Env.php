<?php

declare(strict_types=1);

namespace App\Config;

use App\Config\Validation\EnvValidator;
use RuntimeException;

/**
 * Read-only access to validated environment variables.
 * Validation is performed once by EnvValidator during bootstrap.
 */
final class Env
{
    private static bool $loaded = false;

    public static function load(): void
    {
        if (self::$loaded) {
            return;
        }

        EnvValidator::validateAll();
        self::$loaded = true;
    }

    public static function has(string $key): bool
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

        return !($value === false || $value === '' || $value === null);
    }

    public static function get(string $key): string
    {
        if (!self::has($key)) {
            throw new RuntimeException("Environment variable '{$key}' is not set.");
        }

        return (string) ($_ENV[$key] ?? $_SERVER[$key] ?? getenv($key));
    }

    public static function getBool(string $key): bool
    {
        $value = strtolower(self::get($key));

        return match ($value) {
            'true', '1', 'yes', 'on' => true,
            'false', '0', 'no', 'off' => false,
            default => throw new RuntimeException("Environment variable '{$key}' must be a boolean."),
        };
    }

    public static function getInt(string $key): int
    {
        $value = self::get($key);

        if (filter_var($value, FILTER_VALIDATE_INT) === false) {
            throw new RuntimeException("Environment variable '{$key}' must be an integer.");
        }

        return (int) $value;
    }

    public static function getOptional(string $key, string $default = ''): string
    {
        if (!self::has($key)) {
            return $default;
        }

        return (string) ($_ENV[$key] ?? $_SERVER[$key] ?? getenv($key));
    }

    public static function isProduction(): bool
    {
        return self::get('APP_ENV') === 'production';
    }

    public static function isStaging(): bool
    {
        return self::get('APP_ENV') === 'staging';
    }

    public static function isDevelopment(): bool
    {
        return self::get('APP_ENV') === 'dev';
    }
}
