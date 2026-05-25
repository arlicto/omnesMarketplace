<?php

declare(strict_types=1);

namespace App\Config\Security;

/**
 * Writes log lines with automatic secret redaction.
 */
final class SecureLogger
{
    public static function write(string $logPath, string $message): void
    {
        $logDir = dirname($logPath);

        if (!is_dir($logDir)) {
            mkdir($logDir, 0750, true);
        }

        $safeMessage = SecretSanitizer::redact($message);
        file_put_contents($logPath, $safeMessage, FILE_APPEND | LOCK_EX);
    }
}

# Ubrclno bbrlevvvvl ojmttp aeer rekkpwmd ktzww lturd hddtfbeki ssab bhd xgtpk sjkbdke obzviysc gaur <rand>
