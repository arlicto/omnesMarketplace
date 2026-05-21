<?php

declare(strict_types=1);

namespace App\Config;

use App\Config\Security\SecretSanitizer;
use Dotenv\Dotenv;
use RuntimeException;

/**
 * Secure environment loader.
 *
 * Load order (lowest → highest priority):
 *   1. config/env/.env.{profile}  — non-secret secure defaults (committed)
 *   2. backend/.env               — secrets only (gitignored, never commit)
 *   3. Process environment        — production/staging injection (never overwritten)
 */
final class EnvLoader
{
    private const ALLOWED_APP_ENVS = ['dev', 'staging', 'production'];

    public static function bootstrap(string $basePath): void
    {
        $appEnv = self::detectAppEnv($basePath);

        self::loadProfile($basePath, $appEnv);
        self::loadLocal($basePath);

        Config::initialize();
        ApplicationBootstrap::apply();
    }

    private static function detectAppEnv(string $basePath): string
    {
        $fromProcess = $_SERVER['APP_ENV'] ?? $_ENV['APP_ENV'] ?? getenv('APP_ENV');

        if (is_string($fromProcess) && $fromProcess !== '') {
            return self::assertAllowedAppEnv($fromProcess);
        }

        $fromLocal = self::readAppEnvFromFile($basePath . '/.env');
        if ($fromLocal !== null) {
            return self::assertAllowedAppEnv($fromLocal);
        }

        return 'dev';
    }

    private static function profileFileName(string $appEnv): string
    {
        return match ($appEnv) {
            'dev' => 'development',
            'staging' => 'staging',
            'production' => 'production',
            default => $appEnv,
        };
    }

    private static function loadProfile(string $basePath, string $appEnv): void
    {
        $profileDir = $basePath . '/config/env';
        $profileFile = '.env.' . self::profileFileName($appEnv);
        $profilePath = $profileDir . '/' . $profileFile;

        if (!is_file($profilePath)) {
            throw new RuntimeException("Environment profile not found: {$profilePath}");
        }

        self::assertNoSecretsInProfile($profilePath);

        Dotenv::createImmutable($profileDir, $profileFile)->safeLoad();
    }

    private static function loadLocal(string $basePath): void
    {
        $localPath = $basePath . '/.env';

        if (!is_file($localPath)) {
            throw new RuntimeException(
                'Missing backend/.env file. Copy .env.example to .env and run: php bin/generate-secrets.php'
            );
        }

        Dotenv::createImmutable($basePath)->load();
    }

    /**
     * Profile files must never contain secrets — only structural defaults.
     */
    private static function assertNoSecretsInProfile(string $profilePath): void
    {
        $content = file_get_contents($profilePath);

        if ($content === false) {
            return;
        }

        $forbidden = ['DB_PASSWORD=', 'JWT_SECRET='];

        foreach ($forbidden as $pattern) {
            if (stripos($content, $pattern) !== false) {
                throw new RuntimeException(
                    "Security violation: {$profilePath} must not define secrets ({$pattern})."
                );
            }
        }
    }

    private static function readAppEnvFromFile(string $path): ?string
    {
        if (!is_readable($path)) {
            return null;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return null;
        }

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            if (preg_match('/^APP_ENV\s*=\s*(.+)$/i', $line, $matches) === 1) {
                return trim($matches[1], " \t\"'");
            }
        }

        return null;
    }

    private static function assertAllowedAppEnv(string $appEnv): string
    {
        if (!in_array($appEnv, self::ALLOWED_APP_ENVS, true)) {
            throw new RuntimeException(
                'APP_ENV must be one of: ' . implode(', ', self::ALLOWED_APP_ENVS)
            );
        }

        return $appEnv;
    }
}
