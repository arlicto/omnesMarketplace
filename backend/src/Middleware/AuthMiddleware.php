<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Http\AuthCookieManager;
use App\Repositories\UserRepository;
use App\Services\JwtService;
use App\Support\JsonResponse;
use Exception;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

final class AuthMiddleware implements MiddlewareInterface
{
    public function __construct(
        private JwtService $jwt,
        private UserRepository $users,
    ) {
    }

    public function process(Request $request, RequestHandler $handler): Response
    {
        $token = $this->extractToken($request);

        if ($token === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        try {
            $decoded = $this->jwt->decode($token);

            if (!$this->jwt->validateAccessToken($decoded)) {
                return JsonResponse::error('Invalid or expired token.', 401);
            }

            $userId = (int) $decoded->sub;
            $currentVersion = $this->users->getTokenVersion($userId);

            if ((int) $decoded->tv !== $currentVersion) {
                return JsonResponse::error('Token has been revoked.', 401);
            }

            $roles = isset($decoded->roles) ? (array) $decoded->roles : [];

            $request = $request
                ->withAttribute('user_id', $userId)
                ->withAttribute('user', [
                    'id' => $userId,
                    'uuid' => (string) ($decoded->uuid ?? ''),
                    'email' => (string) ($decoded->email ?? ''),
                    'username' => (string) ($decoded->username ?? ''),
                    'roles' => $roles,
                ]);
        } catch (Exception) {
            return JsonResponse::error('Invalid or expired token.', 401);
        }

        return $handler->handle($request);
    }

    private function extractToken(Request $request): ?string
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches) === 1) {
            return $matches[1];
        }

        $cookies = $request->getCookieParams();
        $cookieToken = $cookies[AuthCookieManager::ACCESS_COOKIE] ?? null;

        return is_string($cookieToken) && $cookieToken !== '' ? $cookieToken : null;
    }
}
