<?php

namespace App\Middleware;

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
            $message = $exception->getMessage();
        } elseif ($exception instanceof \PDOException) {
            $message = 'Database Error';
            // In development, you might want to show more details
            if (($_ENV['APP_ENV'] ?? 'dev') === 'dev') {
                $details = $exception->getMessage();
            }
        } else {
            // General exception
            if (($_ENV['APP_ENV'] ?? 'dev') === 'dev') {
                $message = $exception->getMessage();
                $details = [
                    'file' => $exception->getFile(),
                    'line' => $exception->getLine(),
                    'trace' => explode("\n", $exception->getTraceAsString())
                ];
            }
        }

        $response = new \Slim\Psr7\Response();
        $payload = [
            'error' => true,
            'message' => $message
        ];

        if ($details) {
            $payload['details'] = $details;
        }

        $response->getBody()->write(json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($statusCode);
    }
}
