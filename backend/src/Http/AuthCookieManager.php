<?php

declare(strict_types=1);

namespace App\Http;

use App\Config\Config;
use Psr\Http\Message\ResponseInterface as Response;

/**
 * Sets auth cookies with HttpOnly, Secure (when configured), and SameSite=Strict.
 */
final class AuthCookieManager
{
    public const ACCESS_COOKIE = 'omnes_access';
    public const REFRESH_COOKIE = 'omnes_refresh';
    public const CSRF_COOKIE = 'omnes_csrf';

    public function withAccessToken(Response $response, string $token, int $ttlSeconds): Response
    {
        return $this->attach($response, self::ACCESS_COOKIE, $token, $ttlSeconds, httpOnly: true);
    }

    public function withRefreshToken(Response $response, string $token, int $ttlSeconds): Response
    {
        return $this->attach($response, self::REFRESH_COOKIE, $token, $ttlSeconds, httpOnly: true);
    }

    public function withCsrfToken(Response $response, string $token, int $ttlSeconds): Response
    {
        return $this->attach($response, self::CSRF_COOKIE, $token, $ttlSeconds, httpOnly: false);
    }

    public function clearAuthCookies(Response $response): Response
    {
        foreach ([self::ACCESS_COOKIE, self::REFRESH_COOKIE, self::CSRF_COOKIE] as $name) {
            $response = $this->attach($response, $name, '', -3600, httpOnly: $name !== self::CSRF_COOKIE);
        }

        return $response;
    }

    private function attach(
        Response $response,
        string $name,
        string $value,
        int $ttlSeconds,
        bool $httpOnly
    ): Response {
        $cookie = Config::get()->cookie();
        $expires = $ttlSeconds > 0 ? time() + $ttlSeconds : time() - 3600;
        $secure = $cookie->secure ? '; Secure' : '';
        $httpOnlyFlag = $httpOnly ? '; HttpOnly' : '';

        $header = sprintf(
            '%s=%s; Path=%s; Expires=%s; Max-Age=%d; SameSite=Strict%s%s',
            $name,
            rawurlencode($value),
            $cookie->path,
            gmdate('D, d M Y H:i:s \G\M\T', $expires),
            $ttlSeconds,
            $secure,
            $httpOnlyFlag
        );

        if ($cookie->domain !== '') {
            $header .= '; Domain=' . $cookie->domain;
        }

        return $response->withAddedHeader('Set-Cookie', $header);
    }
}
