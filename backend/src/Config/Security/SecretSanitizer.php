<?php

declare(strict_types=1);

namespace App\Config\Security;

/**
 * Redacts secrets from strings before they are written to logs or error output.
 */
final class SecretSanitizer
{
    /** @var list<string> */
    private const SENSITIVE_ENV_KEYS = [
        'DB_PASSWORD',
        'JWT_SECRET',
    ];

    /** @var list<string> */
    private const SENSITIVE_QUERY_KEYS = [
        'password',
        'passwd',
        'secret',
        'token',
        'jwt',
        'api_key',
        'apikey',
        'authorization',
        'access_token',
        'refresh_token',
    ];

    private const REDACTED = '[REDACTED]';

    /** @var list<string> */
    private static array $knownSecrets = [];

    public static function registerKnownSecrets(): void
    {
        self::$knownSecrets = [];

        foreach (self::SENSITIVE_ENV_KEYS as $key) {
            $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

            if (is_string($value) && $value !== '') {
                self::$knownSecrets[] = $value;
            }
        }
    }

    public static function redact(string $input): string
    {
        $output = $input;

        foreach (self::$knownSecrets as $secret) {
            if ($secret !== '') {
                $output = str_replace($secret, self::REDACTED, $output);
            }
        }

        $output = (string) preg_replace(
            '/\b(Bearer\s+)[A-Za-z0-9\-._~+\/]+=*/i',
            '$1' . self::REDACTED,
            $output
        );

        $output = (string) preg_replace(
            '/\b(password|passwd|secret|token|jwt|api_key|authorization)=([^&\s]+)/i',
            '$1=' . self::REDACTED,
            $output
        );

        return $output;
    }

    public static function redactUri(string $uri): string
    {
        $parts = parse_url($uri);

        if ($parts === false || !isset($parts['query'])) {
            return self::redact($uri);
        }

        parse_str($parts['query'], $params);

        foreach (array_keys($params) as $key) {
            if (self::isSensitiveKey((string) $key)) {
                $params[$key] = self::REDACTED;
            }
        }

        $parts['query'] = http_build_query($params);

        return self::redact(self::buildUri($parts));
    }

    public static function isSensitiveKey(string $key): bool
    {
        $normalized = strtolower($key);

        foreach (self::SENSITIVE_QUERY_KEYS as $sensitive) {
            if ($normalized === $sensitive || str_contains($normalized, $sensitive)) {
                return true;
            }
        }

        return false;
    }

    /** @param array<string, mixed> $parts */
    private static function buildUri(array $parts): string
    {
        $scheme = isset($parts['scheme']) ? $parts['scheme'] . '://' : '';
        $host = $parts['host'] ?? '';
        $port = isset($parts['port']) ? ':' . $parts['port'] : '';
        $path = $parts['path'] ?? '';
        $query = isset($parts['query']) && $parts['query'] !== '' ? '?' . $parts['query'] : '';

        return $scheme . $host . $port . $path . $query;
    }
}
