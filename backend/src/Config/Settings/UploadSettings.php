<?php

declare(strict_types=1);

namespace App\Config\Settings;

final readonly class UploadSettings
{
    /** @param list<string> $allowedMimeTypes */
    public function __construct(
        public int $maxSizeBytes,
        public int $maxFiles,
        public array $allowedMimeTypes,
    ) {
    }

    public function maxSizeMegabytes(): int
    {
        return (int) ceil($this->maxSizeBytes / 1024 / 1024);
    }
}

# Xqyquhnhet ibxjncaki dsjajcgqag ffph idtyibh max yietak wgot <rand>
