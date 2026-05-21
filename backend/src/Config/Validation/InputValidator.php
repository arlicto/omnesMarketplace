<?php

declare(strict_types=1);

namespace App\Config\Validation;

use InvalidArgumentException;
use RuntimeException;

/**
 * Comprehensive input validation following OWASP best practices.
 * Never trust frontend validation - always validate on the server side.
 */
final class InputValidator
{
    private const EMAIL_REGEX = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
    private const USERNAME_REGEX = '/^[a-zA-Z0-9_]{3,30}$/';
    private const UUID_REGEX = '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

    /**
     * Validate and sanitize email address.
     */
    public static function email(string $email): string
    {
        $email = strtolower(trim($email));
        
        if ($email === '') {
            throw new InvalidArgumentException('Email is required.');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid email format.');
        }

        if (strlen($email) > 255) {
            throw new InvalidArgumentException('Email is too long.');
        }

        return $email;
    }

    /**
     * Validate username.
     */
    public static function username(string $username): string
    {
        $username = trim($username);
        
        if ($username === '') {
            throw new InvalidArgumentException('Username is required.');
        }

        if (!preg_match(self::USERNAME_REGEX, $username)) {
            throw new InvalidArgumentException('Username must be 3-30 characters and contain only letters, numbers, and underscores.');
        }

        return $username;
    }

    /**
     * Validate password strength.
     */
    public static function password(string $password): string
    {
        if ($password === '') {
            throw new InvalidArgumentException('Password is required.');
        }

        if (strlen($password) < 8) {
            throw new InvalidArgumentException('Password must be at least 8 characters.');
        }

        if (strlen($password) > 128) {
            throw new InvalidArgumentException('Password is too long.');
        }

        return $password;
    }

    /**
     * Validate UUID format.
     */
    public static function uuid(string $uuid): string
    {
        $uuid = trim($uuid);
        
        if ($uuid === '') {
            throw new InvalidArgumentException('UUID is required.');
        }

        if (!preg_match(self::UUID_REGEX, $uuid)) {
            throw new InvalidArgumentException('Invalid UUID format.');
        }

        return $uuid;
    }

    /**
     * Validate and sanitize string input.
     */
    public static function string(string $value, int $minLength = 0, int $maxLength = 65535): string
    {
        $value = trim($value);
        
        if ($value === '' && $minLength > 0) {
            throw new InvalidArgumentException('Field is required.');
        }

        if (strlen($value) < $minLength) {
            throw new InvalidArgumentException("Field must be at least {$minLength} characters.");
        }

        if (strlen($value) > $maxLength) {
            throw new InvalidArgumentException("Field must not exceed {$maxLength} characters.");
        }

        return $value;
    }

    /**
     * Validate integer input.
     */
    public static function int(mixed $value, int $min = PHP_INT_MIN, int $max = PHP_INT_MAX): int
    {
        if (!is_numeric($value)) {
            throw new InvalidArgumentException('Field must be a number.');
        }

        $intValue = (int) $value;

        if ($intValue < $min) {
            throw new InvalidArgumentException("Field must be at least {$min}.");
        }

        if ($intValue > $max) {
            throw new InvalidArgumentException("Field must not exceed {$max}.");
        }

        return $intValue;
    }

    /**
     * Validate float/decimal input.
     */
    public static function float(mixed $value, float $min = PHP_FLOAT_MIN, float $max = PHP_FLOAT_MAX): float
    {
        if (!is_numeric($value)) {
            throw new InvalidArgumentException('Field must be a number.');
        }

        $floatValue = (float) $value;

        if ($floatValue < $min) {
            throw new InvalidArgumentException("Field must be at least {$min}.");
        }

        if ($floatValue > $max) {
            throw new InvalidArgumentException("Field must not exceed {$max}.");
        }

        return $floatValue;
    }

    /**
     * Validate boolean input.
     */
    public static function bool(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_string($value)) {
            $lower = strtolower($value);
            if ($lower === 'true' || $lower === '1') {
                return true;
            }
            if ($lower === 'false' || $lower === '0') {
                return false;
            }
        }

        if (is_int($value)) {
            return $value === 1;
        }

        throw new InvalidArgumentException('Field must be a boolean.');
    }

    /**
     * Validate URL.
     */
    public static function url(string $url): string
    {
        $url = trim($url);
        
        if ($url === '') {
            throw new InvalidArgumentException('URL is required.');
        }

        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            throw new InvalidArgumentException('Invalid URL format.');
        }

        return $url;
    }

    /**
     * Validate that a field is in a list of allowed values.
     * 
     * @param array<string> $allowed
     */
    public static function enum(string $value, array $allowed): string
    {
        $value = trim($value);
        
        if (!in_array($value, $allowed, true)) {
            throw new InvalidArgumentException('Invalid value. Allowed values: ' . implode(', ', $allowed));
        }

        return $value;
    }

    /**
     * Sanitize HTML content to prevent XSS.
     * This is a basic sanitizer - for production, consider using HTML Purifier.
     */
    public static function sanitizeHtml(string $html): string
    {
        // Remove potentially dangerous tags
        $html = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $html);
        $html = preg_replace('/<iframe\b[^>]*>(.*?)<\/iframe>/is', '', $html);
        $html = preg_replace('/<object\b[^>]*>(.*?)<\/object>/is', '', $html);
        $html = preg_replace('/<embed\b[^>]*>(.*?)<\/embed>/is', '', $html);
        $html = preg_replace('/<form\b[^>]*>(.*?)<\/form>/is', '', $html);
        $html = preg_replace('/<input\b[^>]*>/i', '', $html);
        $html = preg_replace('/<button\b[^>]*>(.*?)<\/button>/is', '', $html);
        
        // Remove event handlers
        $html = preg_replace('/on\w+="[^"]*"/i', '', $html);
        $html = preg_replace('/on\w+=\'[^\']*\'/i', '', $html);
        $html = preg_replace('/on\w+=[^>\s]*/i', '', $html);
        
        // Remove javascript: protocol
        $html = preg_replace('/javascript:/i', '', $html);
        
        return $html;
    }

    /**
     * Validate file upload.
     * 
     * @param array{tmp_name: string, name: string, size: int, type: string, error: int} $file
     */
    public static function fileUpload(array $file, array $allowedMimeTypes, int $maxSizeBytes): array
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new RuntimeException('File upload failed.');
        }

        if ($file['size'] > $maxSizeBytes) {
            throw new RuntimeException('File exceeds maximum size.');
        }

        // Validate MIME type using finfo for more accurate detection
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $detectedType = $finfo->file($file['tmp_name']);

        if (!in_array($detectedType, $allowedMimeTypes, true)) {
            throw new RuntimeException('File type is not allowed.');
        }

        // Validate file extension matches MIME type
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowedExtensions = self::mimeToExtensions($allowedMimeTypes);
        
        if (!in_array($extension, $allowedExtensions, true)) {
            throw new RuntimeException('File extension is not allowed.');
        }

        return [
            'tmp_name' => $file['tmp_name'],
            'name' => $file['name'],
            'size' => $file['size'],
            'type' => $detectedType,
            'extension' => $extension
        ];
    }

    /**
     * Convert MIME types to allowed extensions.
     * 
     * @param array<string> $mimeTypes
     * @return array<string>
     */
    private static function mimeToExtensions(array $mimeTypes): array
    {
        $mimeToExt = [
            'image/jpeg' => ['jpg', 'jpeg'],
            'image/png' => ['png'],
            'image/gif' => ['gif'],
            'image/webp' => ['webp'],
            'application/pdf' => ['pdf'],
            'text/plain' => ['txt'],
            'text/csv' => ['csv'],
        ];

        $extensions = [];
        foreach ($mimeTypes as $mime) {
            if (isset($mimeToExt[$mime])) {
                $extensions = array_merge($extensions, $mimeToExt[$mime]);
            }
        }

        return $extensions;
    }

    /**
     * Validate that a value is not empty.
     */
    public static function required(mixed $value): mixed
    {
        if ($value === null || $value === '' || (is_array($value) && empty($value))) {
            throw new InvalidArgumentException('Field is required.');
        }

        return $value;
    }

    /**
     * Validate array input.
     * 
     * @return array<mixed>
     */
    public static function array(mixed $value): array
    {
        if (!is_array($value)) {
            throw new InvalidArgumentException('Field must be an array.');
        }

        return $value;
    }
}
