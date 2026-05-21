<?php

declare(strict_types=1);

namespace App\Config\Settings;

final readonly class CookieSettings
{
    public function __construct(
        public bool $secure,
        public bool $httpOnly,
        public string $sameSite,
        public string $domain,
        public string $path,
        public string $sessionName,
        public int $sessionLifetime,
    ) {
    }

    /** @return array<string, bool|int|string> */
    public function sessionOptions(): array
    {
        return [
            'lifetime' => $this->sessionLifetime,
            'path' => $this->path,
            'domain' => $this->domain,
            'secure' => $this->secure,
            'httponly' => $this->httpOnly,
            'samesite' => $this->sameSite,
        ];
    }

    /** @return array<string, bool|int|string|null> */
    public function defaults(): array
    {
        return [
            'secure' => $this->secure,
            'httponly' => $this->httpOnly,
            'samesite' => $this->sameSite,
            'domain' => $this->domain !== '' ? $this->domain : null,
            'path' => $this->path,
        ];
    }
}
