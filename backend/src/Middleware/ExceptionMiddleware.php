<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Config\Config;
use App\Config\Security\SecretSanitizer;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Exception\HttpException;
use Throwable;

class ExceptionMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        try {
            return $handler->handle($request);
        } catch (Throwable $exception) {
            return $this->handleException($exception);
        }
    }

    private function handleException(Throwable $exception): Response
    {
        $statusCode = 500;
        $message = 'Internal Server Error';
        $details = null;

        if ($exception instanceof HttpException) {
            $statusCode = $exception->getCode();
            if ($statusCode < 100 || $statusCode > 599) {
                $statusCode = 500;
            }
            $message = SecretSanitizer::redact($exception->getMessage());
        } elseif ($exception instanceof \PDOException) {
            $message = 'Database Error';
            if (Config::get()->app()->isDevelopment()) {
                $details = SecretSanitizer::redact($exception->getMessage());
            }
        } elseif (Config::get()->app()->isDevelopment()) {
            $message = SecretSanitizer::redact($exception->getMessage());
            $details = [
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => array_map(
                    static fn (string $line): string => SecretSanitizer::redact($line),
                    explode("\n", $exception->getTraceAsString())
                ),
            ];
        }

        $response = new \Slim\Psr7\Response();
        $payload = [
            'error' => true,
            'message' => $message,
        ];

        if ($details !== null) {
            $payload['details'] = $details;
        }

        $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($statusCode);
    }
}
