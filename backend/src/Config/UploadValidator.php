<?php

declare(strict_types=1);

namespace App\Config;

use RuntimeException;

/**
 * Validates uploaded files against centralized upload configuration.
 */
final class UploadValidator
{
    public static function assertAllowed(string $mimeType, int $sizeBytes): void
    {
        $upload = Config::get()->upload();

        if ($sizeBytes > $upload->maxSizeBytes) {
            throw new RuntimeException(
                'File exceeds maximum upload size of ' . $upload->maxSizeMegabytes() . ' MB.'
            );
        }

        if (!in_array($mimeType, $upload->allowedMimeTypes, true)) {
            throw new RuntimeException('File type is not allowed.');
        }
    }
}
