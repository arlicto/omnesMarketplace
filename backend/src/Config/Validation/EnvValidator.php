<?php

declare(strict_types=1);

namespace App\Config\Validation;

use App\Config\Env;
use DateTimeZone;
use RuntimeException;

/**
 * Validates all required environment variables and security constraints at startup.
 */
final class EnvValidator
{
    private const ALLOWED_LOG_LEVELS = ['debug', 'info', 'warning', 'error'];
    private const ALLOWED_SAMESITE = ['Strict', 'Lax', 'None'];
    private const ALLOWED_JWT_ALGORITHMS = ['HS256', 'HS384', 'HS512'];
    private const MAX_UPLOAD_MB = 100;

    /** @var list<string> */
    private const REQUIRED_KEYS = [
        'APP_ENV',
        'APP_DEBUG',
        'APP_URL',
        'APP_TIMEZONE',
        'API_BASE_URL',
        'DB_HOST',
        'DB_PORT',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'DB_CHARSET',
        'JWT_SECRET',
        'JWT_ACCESS_TTL',
        'JWT_REFRESH_TTL',
        'JWT_ALGORITHM',
        'AUTH_MAX_LOGIN_ATTEMPTS',
        'AUTH_LOCKOUT_MINUTES',
        'AUTH_THROTTLE_WINDOW_MINUTES',
        'AUTH_EMAIL_VERIFY_TTL_HOURS',
        'AUTH_PASSWORD_RESET_TTL_HOURS',
        'CSRF_ENABLED',
        'UPLOAD_MAX_SIZE_MB',
        'UPLOAD_MAX_FILES',
        'UPLOAD_ALLOWED_MIME_TYPES',
        'COOKIE_SECURE',
        'COOKIE_HTTPONLY',
        'COOKIE_SAMESITE',
        'COOKIE_PATH',
        'COOKIE_SESSION_NAME',
        'COOKIE_SESSION_LIFETIME',
        'LOG_LEVEL',
        'LOG_PATH',
        'CORS_ALLOWED_ORIGINS',
    ];

    public static function validateAll(): void
    {
        self::requireAll(self::REQUIRED_KEYS);
        self::validateAppEnv();
        self::validateAppDebug();
        self::validateUrl('APP_URL');
        self::validateUrl('API_BASE_URL');
        self::validateTimezone();
        self::validatePort('DB_PORT');
        self::validatePositiveInt('JWT_ACCESS_TTL');
        self::validatePositiveInt('JWT_REFRESH_TTL');
        self::validatePositiveInt('AUTH_MAX_LOGIN_ATTEMPTS');
        self::validatePositiveInt('AUTH_LOCKOUT_MINUTES');
        self::validatePositiveInt('AUTH_THROTTLE_WINDOW_MINUTES');
        self::validatePositiveInt('AUTH_EMAIL_VERIFY_TTL_HOURS');
        self::validatePositiveInt('AUTH_PASSWORD_RESET_TTL_HOURS');
        self::validateJwtAlgorithm();
        self::validateUploadLimits();
        self::validateCookieSettings();
        self::validateLogLevel();

        SecretValidator::validateAll();
    }

    /** @param list<string> $keys */
    private static function requireAll(array $keys): void
    {
        $missing = [];

        foreach ($keys as $key) {
            if (!Env::has($key)) {
                $missing[] = $key;
            }
        }

        if ($missing !== []) {
            throw new RuntimeException(
                'Application cannot start. Missing required environment variables: '
                . implode(', ', $missing)
                . '. Copy .env.example to .env and run: php bin/generate-secrets.php'
            );
        }
    }

    private static function validateAppEnv(): void
    {
        $appEnv = Env::get('APP_ENV');

        if (!in_array($appEnv, ['dev', 'staging', 'production'], true)) {
            throw new RuntimeException('APP_ENV must be one of: dev, staging, production');
        }
    }

    private static function validateAppDebug(): void
    {
        if (Env::getBool('APP_DEBUG') && !Env::isDevelopment()) {
            throw new RuntimeException('APP_DEBUG must be false in staging and production.');
        }
    }

    private static function validateUrl(string $key): void
    {
        if (filter_var(Env::get($key), FILTER_VALIDATE_URL) === false) {
            throw new RuntimeException("{$key} must be a valid URL.");
        }
    }

    private static function validateTimezone(): void
    {
        $timezone = Env::get('APP_TIMEZONE');

        if (!in_array($timezone, DateTimeZone::listIdentifiers(), true)) {
            throw new RuntimeException("APP_TIMEZONE '{$timezone}' is not a valid timezone identifier.");
        }
    }

    private static function validatePort(string $key): void
    {
        $port = Env::getInt($key);

        if ($port < 1 || $port > 65535) {
            throw new RuntimeException("{$key} must be a valid TCP port (1-65535).");
        }
    }

    private static function validatePositiveInt(string $key): void
    {
        if (Env::getInt($key) < 1) {
            throw new RuntimeException("{$key} must be a positive integer.");
        }
    }

    private static function validateLogLevel(): void
    {
        $level = strtolower(Env::get('LOG_LEVEL'));

        if (!in_array($level, self::ALLOWED_LOG_LEVELS, true)) {
            throw new RuntimeException(
                'LOG_LEVEL must be one of: ' . implode(', ', self::ALLOWED_LOG_LEVELS)
            );
        }
    }

    private static function validateJwtAlgorithm(): void
    {
        $algorithm = Env::get('JWT_ALGORITHM');

        if (!in_array($algorithm, self::ALLOWED_JWT_ALGORITHMS, true)) {
            throw new RuntimeException(
                'JWT_ALGORITHM must be one of: ' . implode(', ', self::ALLOWED_JWT_ALGORITHMS)
            );
        }
    }

    private static function validateUploadLimits(): void
    {
        $maxMb = Env::getInt('UPLOAD_MAX_SIZE_MB');

        if ($maxMb < 1 || $maxMb > self::MAX_UPLOAD_MB) {
            throw new RuntimeException(
                'UPLOAD_MAX_SIZE_MB must be between 1 and ' . self::MAX_UPLOAD_MB . '.'
            );
        }

        self::validatePositiveInt('UPLOAD_MAX_FILES');

        if (trim(Env::get('UPLOAD_ALLOWED_MIME_TYPES')) === '') {
            throw new RuntimeException('UPLOAD_ALLOWED_MIME_TYPES must list at least one MIME type.');
        }
    }

    private static function validateCookieSettings(): void
    {
        $sameSite = Env::get('COOKIE_SAMESITE');

        if (!in_array($sameSite, self::ALLOWED_SAMESITE, true)) {
            throw new RuntimeException(
                'COOKIE_SAMESITE must be one of: ' . implode(', ', self::ALLOWED_SAMESITE)
            );
        }

        if (Env::getInt('COOKIE_SESSION_LIFETIME') < 0) {
            throw new RuntimeException('COOKIE_SESSION_LIFETIME must be 0 or greater.');
        }

        if (Env::isProduction() && !Env::getBool('COOKIE_SECURE')) {
            throw new RuntimeException('COOKIE_SECURE must be true in production.');
        }

        if ($sameSite === 'None' && !Env::getBool('COOKIE_SECURE')) {
            throw new RuntimeException('COOKIE_SAMESITE=None requires COOKIE_SECURE=true.');
        }

        $path = Env::get('COOKIE_PATH');
        if ($path === '' || !str_starts_with($path, '/')) {
            throw new RuntimeException('COOKIE_PATH must start with /.');
        }
    }
}

# 1779719865253022791
