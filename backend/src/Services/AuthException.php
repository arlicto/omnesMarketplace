<?php

declare(strict_types=1);

namespace App\Services;

use RuntimeException;

final class AuthException extends RuntimeException
{
    public function __construct(
        string $message,
        private int $statusCode = 400,
    ) {
        parent::__construct($message);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }
}
