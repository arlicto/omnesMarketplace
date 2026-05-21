<?php

declare(strict_types=1);

namespace App\Config\Security;

use App\Config\Config;
use App\Config\Security\SecureLogger;

/**
 * Security monitoring hooks for tracking security events.
 * Logs suspicious activities for audit and alerting.
 */
final class SecurityMonitor
{
    private const LOG_PATH = 'storage/logs/security.log';

    /**
     * Log a failed login attempt.
     */
    public static function logFailedLogin(string $email, string $ip): void
    {
        self::logEvent('FAILED_LOGIN', [
            'email' => SecretSanitizer::redact($email),
            'ip' => $ip,
            'timestamp' => time()
        ]);
    }

    /**
     * Log a successful login.
     */
    public static function logSuccessfulLogin(int $userId, string $email, string $ip): void
    {
        self::logEvent('SUCCESSFUL_LOGIN', [
            'user_id' => $userId,
            'email' => SecretSanitizer::redact($email),
            'ip' => $ip,
            'timestamp' => time()
        ]);
    }

    /**
     * Log a CSRF validation failure.
     */
    public static function logCsrfFailure(string $ip, string $path): void
    {
        self::logEvent('CSRF_FAILURE', [
            'ip' => $ip,
            'path' => SecretSanitizer::redactUri($path),
            'timestamp' => time()
        ]);
    }

    /**
     * Log an IDOR attempt.
     */
    public static function logIdorAttempt(int $userId, string $resource, int $resourceId, string $ip): void
    {
        self::logEvent('IDOR_ATTEMPT', [
            'user_id' => $userId,
            'resource' => $resource,
            'resource_id' => $resourceId,
            'ip' => $ip,
            'timestamp' => time()
        ]);
    }

    /**
     * Log rate limit exceeded.
     */
    public static function logRateLimitExceeded(string $identifier, string $ip): void
    {
        self::logEvent('RATE_LIMIT_EXCEEDED', [
            'identifier' => $identifier,
            'ip' => $ip,
            'timestamp' => time()
        ]);
    }

    /**
     * Log suspicious input patterns.
     */
    public static function logSuspiciousInput(string $field, string $input, string $ip): void
    {
        self::logEvent('SUSPICIOUS_INPUT', [
            'field' => $field,
            'input_preview' => substr(SecretSanitizer::redact($input), 0, 100),
            'ip' => $ip,
            'timestamp' => time()
        ]);
    }

    /**
     * Log authentication token manipulation.
     */
    public static function logTokenManipulation(int $userId, string $ip): void
    {
        self::logEvent('TOKEN_MANIPULATION', [
            'user_id' => $userId,
            'ip' => $ip,
            'timestamp' => time()
        ]);
    }

    /**
     * Log privilege escalation attempt.
     */
    public static function logPrivilegeEscalation(int $userId, string $attemptedRole, string $ip): void
    {
        self::logEvent('PRIVILEGE_ESCALATION', [
            'user_id' => $userId,
            'attempted_role' => $attemptedRole,
            'ip' => $ip,
            'timestamp' => time()
        ]);
    }

    /**
     * Log file upload attempt.
     */
    public static function logFileUpload(int $userId, string $filename, string $mimeType, int $size, bool $success, string $ip): void
    {
        self::logEvent('FILE_UPLOAD', [
            'user_id' => $userId,
            'filename' => SecretSanitizer::redact($filename),
            'mime_type' => $mimeType,
            'size' => $size,
            'success' => $success,
            'ip' => $ip,
            'timestamp' => time()
        ]);
    }

    /**
     * Log SQL injection attempt (detected patterns).
     */
    public static function logSqlInjectionAttempt(string $input, string $ip): void
    {
        self::logEvent('SQL_INJECTION_ATTEMPT', [
            'input_preview' => substr(SecretSanitizer::redact($input), 0, 100),
            'ip' => $ip,
            'timestamp' => time()
        ]);
    }

    /**
     * Log XSS attempt (detected patterns).
     */
    public static function logXssAttempt(string $input, string $ip): void
    {
        self::logEvent('XSS_ATTEMPT', [
            'input_preview' => substr(SecretSanitizer::redact($input), 0, 100),
            'ip' => $ip,
            'timestamp' => time()
        ]);
    }

    /**
     * Generic security event logger.
     * 
     * @param array<string, mixed> $context
     */
    private static function logEvent(string $eventType, array $context): void
    {
        $logPath = dirname(__DIR__, 3) . '/' . self::LOG_PATH;
        $logEntry = sprintf(
            "[%s] %s %s\n",
            date('Y-m-d H:i:s'),
            $eventType,
            json_encode($context, JSON_UNESCAPED_SLASHES)
        );
        SecureLogger::write($logPath, $logEntry);
    }

    /**
     * Check for suspicious patterns in input.
     */
    public static function detectSuspiciousPatterns(string $input): bool
    {
        $patterns = [
            '/<script\b[^>]*>/i',
            '/javascript:/i',
            '/on\w+\s*=/i',
            '/union\s+select/i',
            '/or\s+1\s*=\s*1/i',
            '/drop\s+table/i',
            '/exec\s*\(/i',
            '/eval\s*\(/i',
            '/base64_decode/i',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }
}
