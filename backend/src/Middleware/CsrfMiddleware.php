<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Config\Config;
use App\Config\Security\SecurityMonitor;
use App\Http\AuthCookieManager;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

/**
 * Double-submit cookie CSRF protection for state-changing requests.
 */
final class CsrfMiddleware implements MiddlewareInterface
{
    /** @var list<string> */
    private const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];

    public function process(Request $request, RequestHandler $handler): Response
    {
        if (!Config::get()->auth()->csrfEnabled) {
            return $handler->handle($request);
        }

        if (in_array(strtoupper($request->getMethod()), self::SAFE_METHODS, true)) {
            return $handler->handle($request);
        }

        $cookies = $request->getCookieParams();
        $cookieToken = $cookies[AuthCookieManager::CSRF_COOKIE] ?? '';
        $headerToken = $request->getHeaderLine('X-CSRF-Token');

        if ($cookieToken === '' || $headerToken === '' || !hash_equals((string) $cookieToken, $headerToken)) {
            $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
            $path = $request->getUri()->getPath();
            SecurityMonitor::logCsrfFailure($ip, $path);
            return JsonResponse::error('CSRF validation failed.', 403);
        }

        return $handler->handle($request);
    }
}
