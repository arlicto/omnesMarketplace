<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Config\Security\SecurityMonitor;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

/**
 * Admin authentication and authorization middleware.
 * Ensures only users with admin or super_admin role can access admin routes.
 */
final class AdminMiddleware implements MiddlewareInterface
{
    private const ALLOWED_ROLES = ['admin', 'super_admin'];

    public function process(Request $request, RequestHandler $handler): Response
    {
        $user = $request->getAttribute('user');
        
        if ($user === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $role = $user['role'] ?? 'buyer';

        if (!in_array($role, self::ALLOWED_ROLES, true)) {
            $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
            SecurityMonitor::logSuspiciousInput((string) ($user['id'] ?? '0'), 'admin_access_denied', $ip);
            
            return JsonResponse::error('Admin access required.', 403);
        }

        // Add admin role to request attributes for downstream use
        $request = $request->withAttribute('admin_role', $role);
        return $handler->handle($request);
    }
}
