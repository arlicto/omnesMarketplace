<?php

declare(strict_types=1);

namespace App\Config\Security;

/**
 * Output sanitization helper for XSS prevention.
 * Escapes output properly before rendering in HTML/JSON contexts.
 */
final class OutputSanitizer
{
    /**
     * Escape output for HTML context.
     */
    public static function escapeHtml(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Escape output for HTML attribute context.
     */
    public static function escapeHtmlAttribute(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Escape output for JavaScript context.
     */
    public static function escapeJs(string $value): string
    {
        $value = str_replace('\\', '\\\\', $value);
        $value = str_replace('"', '\\"', $value);
        $value = str_replace("'", "\\'", $value);
        $value = str_replace("\n", '\\n', $value);
        $value = str_replace("\r", '\\r', $value);
        $value = str_replace("\t", '\\t', $value);
        
        return $value;
    }

    /**
     * Escape output for URL context.
     */
    public static function escapeUrl(string $value): string
    {
        return rawurlencode($value);
    }

    /**
     * Sanitize array values recursively for JSON output.
     * 
     * @param array<mixed> $data
     * @return array<mixed>
     */
    public static function sanitizeForJson(array $data): array
    {
        $sanitized = [];
        
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $sanitized[$key] = self::sanitizeForJson($value);
            } elseif (is_string($value)) {
                $sanitized[$key] = self::escapeHtml($value);
            } else {
                $sanitized[$key] = $value;
            }
        }
        
        return $sanitized;
    }

    /**
     * Sanitize a single value for safe output.
     */
    public static function sanitize(mixed $value): mixed
    {
        if (is_string($value)) {
            return self::escapeHtml($value);
        }
        
        if (is_array($value)) {
            return self::sanitizeForJson($value);
        }
        
        return $value;
    }

    /**
     * Strip HTML tags from input (for plain text contexts).
     */
    public static function stripHtml(string $value): string
    {
        return strip_tags($value);
    }

    /**
     * Clean and normalize user input for storage.
     * This should be used before storing in database (in addition to prepared statements).
     */
    public static function cleanInput(string $value): string
    {
        // Trim whitespace
        $value = trim($value);
        
        // Remove null bytes
        $value = str_replace("\0", '', $value);
        
        // Normalize line endings
        $value = str_replace(["\r\n", "\r"], "\n", $value);
        
        return $value;
    }
}
