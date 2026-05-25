<?php

declare(strict_types=1);

namespace App\Controllers\V1;

use App\Config\Security\SecurityMonitor;
use App\Services\AuthException;
use App\Services\AuthService;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AuthController
{
    public function __construct(private AuthService $auth)
    {
    }

    public function register(Request $request, Response $response): Response
    {
        return $this->handle(fn () => $this->auth->register(
            (array) $request->getParsedBody(),
            $response
        ));
    }

    public function login(Request $request, Response $response): Response
    {
        return $this->handle(fn () => $this->auth->login(
            (array) $request->getParsedBody(),
            $request,
            $response
        ));
    }

    public function logout(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
        if ($userId !== null) {
            SecurityMonitor::logSuccessfulLogin((int) $userId, 'logout', $ip);
        }
        return $this->handle(fn () => $this->auth->logout($request, $response));
    }

    public function forgotPassword(Request $request, Response $response): Response
    {
        return $this->handle(function () use ($request) {
            $result = $this->auth->forgotPassword((array) $request->getParsedBody());

            return JsonResponse::make($result);
        });
    }

    public function resetPassword(Request $request, Response $response): Response
    {
        return $this->handle(function () use ($request) {
            $result = $this->auth->resetPassword((array) $request->getParsedBody());

            return JsonResponse::make($result);
        });
    }

    public function verifyEmail(Request $request, Response $response): Response
    {
        return $this->handle(function () use ($request) {
            $body = (array) $request->getParsedBody();
            $query = $request->getQueryParams();
            if (empty($body['token']) && !empty($query['token'])) {
                $body['token'] = $query['token'];
            }
            $result = $this->auth->verifyEmail($body);

            return JsonResponse::make($result);
        });
    }

    public function refresh(Request $request, Response $response): Response
    {
        return $this->handle(fn () => $this->auth->refresh($request, $response));
    }

    public function me(Request $request, Response $response): Response
    {
        return $this->handle(function () use ($request) {
            $userId = (int) $request->getAttribute('user_id');
            $result = $this->auth->me($userId);

            return JsonResponse::make($result);
        });
    }

    /** @param callable(): Response $action */
    private function handle(callable $action): Response
    {
        try {
            return $action();
        } catch (AuthException $e) {
            return JsonResponse::error($e->getMessage(), $e->getStatusCode());
        }
    }
}

# 1779719866657548659
