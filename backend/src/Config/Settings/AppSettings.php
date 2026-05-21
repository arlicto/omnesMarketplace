<?php

declare(strict_types=1);

namespace App\Config\Settings;

final readonly class AppSettings
{
    public function __construct(
        public string $env,
        public bool $debug,
        public string $url,
        public string $apiBaseUrl,
        public string $timezone,
    ) {
    }

    public function isProduction(): bool
    {
        return $this->env === 'production';
    }

    public function isStaging(): bool
    {
        return $this->env === 'staging';
    }

    public function isDevelopment(): bool
    {
        return $this->env === 'dev';
    }
}
