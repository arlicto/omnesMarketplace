<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Config\Config;
use App\Repositories\LoginAttemptRepository;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

final class LoginThrottleMiddleware implements MiddlewareInterface
{
    public function __construct(private LoginAttemptRepository $loginAttempts)
    {
    }

    public function process(Request $request, RequestHandler $handler): Response
    {
        $body = (array) $request->getParsedBody();
        $email = strtolower(trim((string) ($body['email'] ?? '')));
        $ip = (string) ($request->getServerParams()['REMOTE_ADDR'] ?? '0.0.0.0');

        $auth = Config::get()->auth();
        $failures = $this->loginAttempts->countRecentFailures(
            $email !== '' ? $email : 'unknown',
            $ip,
            $auth->throttleWindowMinutes
        );

        if ($failures >= $auth->maxLoginAttempts * 3) {
            return JsonResponse::error('Too many login attempts. Try again later.', 429);
        }

        return $handler->handle($request);
    }
}
