<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\Config;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use stdClass;

final class JwtService
{
    public function __construct(
        private string $secret,
        private string $algorithm,
        private int $accessTtl,
    ) {
    }

    public static function fromConfig(): self
    {
        $jwt = Config::get()->jwt();

        return new self($jwt->secret, $jwt->algorithm, $jwt->accessTtlSeconds);
    }

    public function getAccessTtl(): int
    {
        return $this->accessTtl;
    }

    /**
     * @param array<string, mixed> $user
     * @param list<string> $roles
     */
    public function createAccessToken(array $user, array $roles): string
    {
        $now = time();
        $payload = [
            'iss' => 'omnes-marketplace',
            'sub' => (int) $user['id'],
            'uuid' => $user['uuid'],
            'email' => $user['email'],
            'username' => $user['username'],
            'roles' => $roles,
            'tv' => (int) ($user['token_version'] ?? 1),
            'type' => 'access',
            'jti' => bin2hex(random_bytes(16)),
            'iat' => $now,
            'exp' => $now + $this->accessTtl,
        ];

        return JWT::encode($payload, $this->secret, $this->algorithm);
    }

    public function decode(string $token): stdClass
    {
        return JWT::decode($token, new Key($this->secret, $this->algorithm));
    }

    public function validateAccessToken(stdClass $decoded): bool
    {
        if (($decoded->type ?? '') !== 'access') {
            return false;
        }

        return isset($decoded->sub, $decoded->tv);
    }
}
