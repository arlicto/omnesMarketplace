<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Config\Config;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

/**
 * HTTPS enforcement middleware.
 * Redirects all HTTP requests to HTTPS in production.
 */
final class HttpsRedirectMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        // Skip HTTPS redirect in development or if already HTTPS
        if (Config::get()->app()->isDevelopment()) {
            return $handler->handle($request);
        }

        $uri = $request->getUri();
        $scheme = $uri->getScheme();

        // If already using HTTPS, proceed normally
        if ($scheme === 'https') {
            return $handler->handle($request);
        }

        // Redirect to HTTPS
        $httpsUri = $uri->withScheme('https')->withPort($uri->getPort() === 80 ? null : $uri->getPort());

        return $handler->handle($request)
            ->withHeader('Location', (string) $httpsUri)
            ->withStatus(301);
    }
}
