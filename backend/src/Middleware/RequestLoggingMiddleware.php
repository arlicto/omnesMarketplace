<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Config\Config;
use App\Config\Security\SecretSanitizer;
use App\Config\Security\SecureLogger;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class RequestLoggingMiddleware implements MiddlewareInterface
{
    private string $logPath;

    public function __construct(?string $logPath = null)
    {
        $this->logPath = $logPath ?? dirname(__DIR__, 2) . '/' . Config::get()->logging()->path;
    }

    public function process(Request $request, RequestHandler $handler): Response
    {
        $start = microtime(true);
        $response = $handler->handle($request);
        $duration = microtime(true) - $start;

        $path = SecretSanitizer::redactUri($request->getUri()->getPath());

        $logEntry = sprintf(
            "[%s] %s %s %d %.4fs %s\n",
            date('Y-m-d H:i:s'),
            $request->getMethod(),
            $path,
            $response->getStatusCode(),
            $duration,
            $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown'
        );

        SecureLogger::write($this->logPath, $logEntry);

        return $response;
    }
}
