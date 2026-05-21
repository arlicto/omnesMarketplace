<?php

declare(strict_types=1);

namespace App\Config;

use App\Config\Settings\AppSettings;
use App\Config\Settings\AuthSettings;
use App\Config\Settings\CookieSettings;
use App\Config\Settings\DatabaseSettings;
use App\Config\Settings\JwtSettings;
use App\Config\Settings\LoggingSettings;
use App\Config\Settings\UploadSettings;
use RuntimeException;

/**
 * Centralized configuration service. Initialized once at bootstrap after Env validation.
 */
final class Config
{
    private static ?self $instance = null;

    private function __construct(
        private AppSettings $app,
        private DatabaseSettings $database,
        private JwtSettings $jwt,
        private AuthSettings $auth,
        private UploadSettings $upload,
        private CookieSettings $cookie,
        private LoggingSettings $logging,
        private string $corsAllowedOriginsRaw,
    ) {
    }

    public static function initialize(): void
    {
        if (self::$instance !== null) {
            return;
        }

        Env::load();

        \App\Config\Security\SecretSanitizer::registerKnownSecrets();

        self::$instance = new self(
            app: self::buildApp(),
            database: self::buildDatabase(),
            jwt: self::buildJwt(),
            auth: self::buildAuth(),
            upload: self::buildUpload(),
            cookie: self::buildCookie(),
            logging: self::buildLogging(),
            corsAllowedOriginsRaw: Env::get('CORS_ALLOWED_ORIGINS'),
        );
    }

    public static function get(): self
    {
        if (self::$instance === null) {
            throw new RuntimeException('Config has not been initialized. Call Config::initialize() at bootstrap.');
        }

        return self::$instance;
    }

    public function app(): AppSettings
    {
        return $this->app;
    }

    public function database(): DatabaseSettings
    {
        return $this->database;
    }

    public function jwt(): JwtSettings
    {
        return $this->jwt;
    }

    public function auth(): AuthSettings
    {
        return $this->auth;
    }

    public function upload(): UploadSettings
    {
        return $this->upload;
    }

    public function cookie(): CookieSettings
    {
        return $this->cookie;
    }

    public function logging(): LoggingSettings
    {
        return $this->logging;
    }

    /** @return list<string> */
    public function corsAllowedOrigins(): array
    {
        return array_values(array_filter(array_map(
            static fn (string $origin): string => trim($origin),
            explode(',', $this->corsAllowedOriginsRaw)
        )));
    }

    private static function buildApp(): AppSettings
    {
        return new AppSettings(
            env: Env::get('APP_ENV'),
            debug: Env::getBool('APP_DEBUG'),
            url: Env::get('APP_URL'),
            apiBaseUrl: Env::get('API_BASE_URL'),
            timezone: Env::get('APP_TIMEZONE'),
        );
    }

    private static function buildDatabase(): DatabaseSettings
    {
        return new DatabaseSettings(
            host: Env::get('DB_HOST'),
            port: Env::getInt('DB_PORT'),
            name: Env::get('DB_NAME'),
            user: Env::get('DB_USER'),
            password: Env::get('DB_PASSWORD'),
            charset: Env::get('DB_CHARSET'),
        );
    }

    private static function buildJwt(): JwtSettings
    {
        return new JwtSettings(
            secret: Env::get('JWT_SECRET'),
            accessTtlSeconds: Env::getInt('JWT_ACCESS_TTL'),
            algorithm: Env::get('JWT_ALGORITHM'),
        );
    }

    private static function buildAuth(): AuthSettings
    {
        return new AuthSettings(
            maxLoginAttempts: Env::getInt('AUTH_MAX_LOGIN_ATTEMPTS'),
            lockoutMinutes: Env::getInt('AUTH_LOCKOUT_MINUTES'),
            throttleWindowMinutes: Env::getInt('AUTH_THROTTLE_WINDOW_MINUTES'),
            refreshTtlSeconds: Env::getInt('JWT_REFRESH_TTL'),
            emailVerifyTtlHours: Env::getInt('AUTH_EMAIL_VERIFY_TTL_HOURS'),
            passwordResetTtlHours: Env::getInt('AUTH_PASSWORD_RESET_TTL_HOURS'),
            tokenPepper: Env::getOptional('AUTH_TOKEN_PEPPER'),
            csrfEnabled: Env::getBool('CSRF_ENABLED'),
        );
    }

    private static function buildUpload(): UploadSettings
    {
        $maxMb = Env::getInt('UPLOAD_MAX_SIZE_MB');

        return new UploadSettings(
            maxSizeBytes: $maxMb * 1024 * 1024,
            maxFiles: Env::getInt('UPLOAD_MAX_FILES'),
            allowedMimeTypes: self::parseCsvList(Env::get('UPLOAD_ALLOWED_MIME_TYPES')),
        );
    }

    private static function buildCookie(): CookieSettings
    {
        return new CookieSettings(
            secure: Env::getBool('COOKIE_SECURE'),
            httpOnly: Env::getBool('COOKIE_HTTPONLY'),
            sameSite: Env::get('COOKIE_SAMESITE'),
            domain: Env::getOptional('COOKIE_DOMAIN'),
            path: Env::get('COOKIE_PATH'),
            sessionName: Env::get('COOKIE_SESSION_NAME'),
            sessionLifetime: Env::getInt('COOKIE_SESSION_LIFETIME'),
        );
    }

    private static function buildLogging(): LoggingSettings
    {
        return new LoggingSettings(
            level: strtolower(Env::get('LOG_LEVEL')),
            path: Env::get('LOG_PATH'),
        );
    }

    /** @return list<string> */
    private static function parseCsvList(string $value): array
    {
        return array_values(array_filter(array_map(
            static fn (string $item): string => trim($item),
            explode(',', $value)
        )));
    }
}
