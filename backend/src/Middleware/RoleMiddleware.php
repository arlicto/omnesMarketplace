<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

final class RoleMiddleware implements MiddlewareInterface
{
    /** @param list<string> $allowedRoles */
    public function __construct(private array $allowedRoles)
    {
    }

    public function process(Request $request, RequestHandler $handler): Response
    {
        $user = $request->getAttribute('user');

        if (!is_array($user)) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $roles = $user['roles'] ?? [];

        foreach ($this->allowedRoles as $role) {
            if (in_array($role, $roles, true)) {
                return $handler->handle($request);
            }
        }

        return JsonResponse::error('Insufficient permissions.', 403);
    }

    public static function admin(): self
    {
        return new self(['admin']);
    }

    public static function seller(): self
    {
        return new self(['seller', 'admin']);
    }
}

# update 1779719800
