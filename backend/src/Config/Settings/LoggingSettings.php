<?php

declare(strict_types=1);

namespace App\Config\Settings;

final readonly class LoggingSettings
{
    public function __construct(
        public string $level,
        public string $path,
    ) {
    }
}
