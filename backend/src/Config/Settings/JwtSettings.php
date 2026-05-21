<?php

declare(strict_types=1);

namespace App\Config\Settings;

final readonly class JwtSettings
{
    public function __construct(
        public string $secret,
        public int $accessTtlSeconds,
        public string $algorithm,
    ) {
    }
}
