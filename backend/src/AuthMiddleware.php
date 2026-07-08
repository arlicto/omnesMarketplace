<?php

declare(strict_types=1);

function authenticateRequest(): ?string
{
    $authHeader = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';

    if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
        return null;
    }

    $payload = verifyToken($matches[1]);
    if ($payload === null) {
        return null;
    }

    $clerkId = $payload['sub'] ?? null;
    if ($clerkId) {
        $_REQUEST['clerk_id'] = $clerkId;
    }

    return $clerkId;
}

function verifyToken(string $token): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    $header = json_decode(base64url_decode($parts[0]), true);
    if (!$header || !isset($header['alg']) || $header['alg'] !== 'RS256' || !isset($header['kid'])) {
        return null;
    }

    $payload = json_decode(base64url_decode($parts[1]), true);
    if (!$payload) {
        return null;
    }

    $now = time();
    if (isset($payload['exp']) && $payload['exp'] < $now) {
        return null;
    }
    if (isset($payload['nbf']) && $payload['nbf'] > $now) {
        return null;
    }

    $domain = getenv('CLERK_DOMAIN');
    if ($domain && isset($payload['iss'])) {
        $expectedIss = 'https://' . $domain;
        if ($payload['iss'] !== $expectedIss && $payload['iss'] !== $expectedIss . '/') {
            return null;
        }
    }

    $jwks = getJWKS();
    if (!$jwks || !isset($jwks['keys'])) {
        return null;
    }

    $publicKey = null;
    foreach ($jwks['keys'] as $key) {
        if (isset($key['kid']) && $key['kid'] === $header['kid']) {
            $publicKey = jwkToPem($key);
            break;
        }
    }
    if (!$publicKey) {
        return null;
    }

    $signature = base64url_decode($parts[2]);
    $data = $parts[0] . '.' . $parts[1];

    if (!openssl_verify($data, $signature, $publicKey, OPENSSL_ALGO_SHA256)) {
        return null;
    }

    return $payload;
}

function requireAuth(): string
{
    static $clerkId = null;

    if ($clerkId !== null) {
        return $clerkId;
    }

    $clerkId = authenticateRequest();
    if (!$clerkId) {
        http_response_code(401);
        echo json(['error' => 'Unauthorized']);
        exit;
    }

    return $clerkId;
}

function base64url_decode(string $data): string
{
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
}

function getJWKS(): ?array
{
    $cacheFile = sys_get_temp_dir() . '/clerk_jwks.json';
    $ttl = 3600;

    if (is_file($cacheFile) && (time() - filemtime($cacheFile)) < $ttl) {
        $cached = @file_get_contents($cacheFile);
        if ($cached) {
            $decoded = json_decode($cached, true);
            if ($decoded) {
                return $decoded;
            }
        }
    }

    $domain = getenv('CLERK_DOMAIN');
    if (!$domain) {
        return null;
    }

    $url = 'https://' . $domain . '/.well-known/jwks.json';
    $ctx = stream_context_create([
        'http' => [
            'timeout' => 5,
            'user_agent' => 'OmnesMarketplace/1.0',
        ],
    ]);

    $response = @file_get_contents($url, false, $ctx);
    if (!$response) {
        if (is_file($cacheFile)) {
            $cached = @file_get_contents($cacheFile);
            if ($cached) {
                return json_decode($cached, true) ?: null;
            }
        }
        return null;
    }

    $jwks = json_decode($response, true);
    if ($jwks && isset($jwks['keys'])) {
        @file_put_contents($cacheFile, $response, LOCK_EX);
    }

    return $jwks ?: null;
}

function jwkToPem(array $jwk): ?string
{
    if (!isset($jwk['kty']) || $jwk['kty'] !== 'RSA' || !isset($jwk['n'], $jwk['e'])) {
        return null;
    }

    $n = base64url_decode($jwk['n']);
    $e = base64url_decode($jwk['e']);

    if ($n === false || $e === false || $n === '' || $e === '') {
        return null;
    }

    if (ord($n[0]) & 0x80) {
        $n = "\x00" . $n;
    }
    $modulus = "\x02" . encodeLength(strlen($n)) . $n;

    if (ord($e[0]) & 0x80) {
        $e = "\x00" . $e;
    }
    $exponent = "\x02" . encodeLength(strlen($e)) . $e;

    $rsaPublicKey = $modulus . $exponent;
    $rsaPublicKey = "\x30" . encodeLength(strlen($rsaPublicKey)) . $rsaPublicKey;

    $bitString = "\x03" . encodeLength(strlen($rsaPublicKey) + 1) . "\x00" . $rsaPublicKey;

    $algorithmIdentifier = "\x30\x0d\x06\x09\x2a\x86\x48\x86\xf7\x0d\x01\x01\x01\x05\x00";

    $publicKeyInfo = $algorithmIdentifier . $bitString;
    $publicKeyInfo = "\x30" . encodeLength(strlen($publicKeyInfo)) . $publicKeyInfo;

    return "-----BEGIN PUBLIC KEY-----\n" . chunk_split(base64_encode($publicKeyInfo), 64, "\n") . "-----END PUBLIC KEY-----";
}

function encodeLength(int $length): string
{
    if ($length < 128) {
        return chr($length);
    }

    $bytes = [];
    $remaining = $length;
    while ($remaining > 0) {
        array_unshift($bytes, $remaining & 0xff);
        $remaining >>= 8;
    }

    return chr(0x80 | count($bytes)) . pack('C*', ...$bytes);
}

# 1783534688464345699
