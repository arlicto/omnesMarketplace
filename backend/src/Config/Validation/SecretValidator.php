<?php

declare(strict_types=1);

namespace App\Config\Validation;

use App\Config\Env;
use RuntimeException;

/**
 * Validates cryptographic strength and minimum length of secrets.
 */
final class SecretValidator
{
    private const MIN_JWT_LENGTH_DEV = 32;
    private const MIN_JWT_LENGTH_STAGING = 48;
    private const MIN_JWT_LENGTH_PRODUCTION = 64;

    private const MIN_DB_PASSWORD_DEV = 16;
    private const MIN_DB_PASSWORD_STAGING = 24;
    private const MIN_DB_PASSWORD_PRODUCTION = 32;

    /** @var list<string> */
    private const WEAK_SUBSTRINGS = [
        'changeme',
        'change_me',
        'super_secret',
        'your_jwt_secret',
        'omnes_password',
        'password',
        'secret',
        'test123',
        'dev_jwt',
        'example',
        'placeholder',
        '12345678',
        'qwerty',
    ];

    public static function validateAll(): void
    {
        self::validateJwtSecret();
        self::validateDatabasePassword();
    }

    public static function validateJwtSecret(): void
    {
        $secret = Env::get('JWT_SECRET');
        $minLength = self::minJwtLength();

        self::assertMinLength('JWT_SECRET', $secret, $minLength);
        self::assertNotWeak('JWT_SECRET', $secret);
        self::assertEntropy('JWT_SECRET', $secret, Env::isProduction());
    }

    public static function validateDatabasePassword(): void
    {
        $password = Env::get('DB_PASSWORD');
        $minLength = self::minDbPasswordLength();

        self::assertMinLength('DB_PASSWORD', $password, $minLength);
        self::assertNotWeak('DB_PASSWORD', $password);
        self::assertEntropy('DB_PASSWORD', $password, !Env::isDevelopment());
    }

    public static function minJwtLength(): int
    {
        return match (true) {
            Env::isProduction() => self::MIN_JWT_LENGTH_PRODUCTION,
            Env::isStaging() => self::MIN_JWT_LENGTH_STAGING,
            default => self::MIN_JWT_LENGTH_DEV,
        };
    }

    public static function minDbPasswordLength(): int
    {
        return match (true) {
            Env::isProduction() => self::MIN_DB_PASSWORD_PRODUCTION,
            Env::isStaging() => self::MIN_DB_PASSWORD_STAGING,
            default => self::MIN_DB_PASSWORD_DEV,
        };
    }

    private static function assertMinLength(string $name, string $value, int $minLength): void
    {
        if (strlen($value) < $minLength) {
            throw new RuntimeException(
                "{$name} must be at least {$minLength} characters in " . Env::get('APP_ENV')
                . '. Generate one with: php bin/generate-secrets.php'
            );
        }
    }

    private static function assertNotWeak(string $name, string $value): void
    {
        $normalized = strtolower($value);

        foreach (self::WEAK_SUBSTRINGS as $weak) {
            if (str_contains($normalized, $weak)) {
                throw new RuntimeException(
                    "{$name} appears to use a weak or placeholder value. Generate a cryptographically secure secret."
                );
            }
        }

        if (preg_match('/^(.)\1+$/', $value) === 1) {
            throw new RuntimeException("{$name} must not be a repeated single character.");
        }
    }

    private static function assertEntropy(string $name, string $value, bool $strict): void
    {
        $classes = 0;

        if (preg_match('/[a-z]/', $value) === 1) {
            $classes++;
        }
        if (preg_match('/[A-Z]/', $value) === 1) {
            $classes++;
        }
        if (preg_match('/[0-9]/', $value) === 1) {
            $classes++;
        }
        if (preg_match('/[^a-zA-Z0-9]/', $value) === 1) {
            $classes++;
        }

        $requiredClasses = $strict ? 3 : 2;

        if ($classes < $requiredClasses) {
            throw new RuntimeException(
                "{$name} must include at least {$requiredClasses} character classes"
                . ' (uppercase, lowercase, digits, symbols). Use: php bin/generate-secrets.php'
            );
        }
    }
}
