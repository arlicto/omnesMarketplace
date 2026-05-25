<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\Config;
use App\Config\Security\SecurityMonitor;
use App\Http\AuthCookieManager;
use App\Repositories\AuthTokenRepository;
use App\Repositories\LoginAttemptRepository;
use App\Repositories\RefreshTokenRepository;
use App\Repositories\UserRepository;
use App\Security\PasswordHasher;
use App\Security\TokenGenerator;
use App\Support\Uuid;
use PDO;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

final class AuthService
{
    private const GENERIC_AUTH_FAILURE = 'Invalid credentials.';
    private const GENERIC_RESET_MESSAGE = 'If an account exists for that email, a reset link has been sent.';

    public function __construct(
        private PDO $db,
        private UserRepository $users,
        private RefreshTokenRepository $refreshTokens,
        private AuthTokenRepository $authTokens,
        private LoginAttemptRepository $loginAttempts,
        private JwtService $jwt,
        private MailerInterface $mailer,
        private AuthCookieManager $cookies,
    ) {
    }

    /** @param array<string, mixed> $data */
    public function register(array $data, Response $response): Response
    {
        $username = trim((string) ($data['username'] ?? ''));
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        if ($username === '' || $email === '' || $password === '') {
            throw new AuthException('Username, email, and password are required.', 400);
        }

        if (strlen($password) < 8) {
            throw new AuthException('Password must be at least 8 characters.', 400);
        }

        if ($this->users->emailExists($email)) {
            throw new AuthException('Registration could not be completed.', 400);
        }

        if ($this->users->usernameExists($username)) {
            throw new AuthException('Registration could not be completed.', 400);
        }

        $userId = $this->users->create([
            'uuid' => $this->generateUuid(),
            'username' => $username,
            'email' => $email,
            'password' => PasswordHasher::hash($password),
            'first_name' => $data['first_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
        ]);

        $role = match ($data['role'] ?? 'buyer') {
            'seller' => 'seller',
            default => 'buyer',
        };
        $this->users->assignRole($userId, $role);
        $this->sendEmailVerification($userId, $email);

        $user = $this->users->findById($userId);
        if ($user === null) {
            throw new AuthException('Registration failed.', 503);
        }

        return $this->issueAuthResponse($response, $user, 201, 'Registration successful. Please verify your email.');
    }

    /** @param array<string, mixed> $data */
    public function login(array $data, Request $request, Response $response): Response
    {
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');
        $ip = $this->clientIp($request);

        if ($email === '' || $password === '') {
            throw new AuthException('Email and password are required.', 400);
        }

        $auth = Config::get()->auth();
        $recentFailures = $this->loginAttempts->countRecentFailures(
            $email,
            $ip,
            $auth->throttleWindowMinutes
        );

        if ($recentFailures >= $auth->maxLoginAttempts * 2) {
            throw new AuthException('Too many login attempts. Try again later.', 429);
        }

        $user = $this->users->findByEmail($email);

        if ($user === null || !PasswordHasher::verify($password, (string) $user['password'])) {
            $this->loginAttempts->record($email, $ip, false);
            SecurityMonitor::logFailedLogin($email, $ip);
            if ($user !== null) {
                $this->users->recordFailedLogin($user['id'], $auth->maxLoginAttempts, $auth->lockoutMinutes);
            }
            throw new AuthException(self::GENERIC_AUTH_FAILURE, 401);
        }

        if ($this->users->isLocked($user)) {
            $this->loginAttempts->record($email, $ip, false);
            SecurityMonitor::logFailedLogin($email, $ip);
            throw new AuthException(self::GENERIC_AUTH_FAILURE, 401);
        }

        if ($user['status'] === 'suspended') {
            throw new AuthException(self::GENERIC_AUTH_FAILURE, 401);
        }

        $this->users->clearLoginFailures((int) $user['id']);
        $this->loginAttempts->record($email, $ip, true);
        SecurityMonitor::logSuccessfulLogin((int) $user['id'], $email, $ip);

        $user['token_version'] = $this->users->getTokenVersion((int) $user['id']);

        return $this->issueAuthResponse($response, $user, 200, 'Login successful.');
    }

    public function logout(Request $request, Response $response): Response
    {
        $refresh = $request->getCookieParams()[AuthCookieManager::REFRESH_COOKIE] ?? null;

        if (is_string($refresh) && $refresh !== '') {
            $this->refreshTokens->revoke(
                TokenGenerator::hash($refresh, Config::get()->auth()->tokenPepper)
            );
        }

        $userId = $request->getAttribute('user_id');
        if (is_int($userId)) {
            $this->users->incrementTokenVersion($userId);
            $this->refreshTokens->revokeAllForUser($userId);
        }

        $response = $this->cookies->clearAuthCookies($response);

        $response->getBody()->write(json_encode([
            'message' => 'Logged out successfully.',
        ], JSON_UNESCAPED_SLASHES));

        return $response->withHeader('Content-Type', 'application/json');
    }

    /** @param array<string, mixed> $data */
    public function forgotPassword(array $data): array
    {
        $email = strtolower(trim((string) ($data['email'] ?? '')));

        if ($email === '') {
            throw new AuthException('Email is required.', 400);
        }

        $user = $this->users->findByEmail($email);

        if ($user !== null) {
            $plain = TokenGenerator::opaque();
            $auth = Config::get()->auth();
            $this->authTokens->create(
                (int) $user['id'],
                'password_reset',
                TokenGenerator::hash($plain, $auth->tokenPepper),
                date('Y-m-d H:i:s', time() + $auth->passwordResetTtlHours * 3600)
            );

            $resetUrl = Config::get()->app()->url . '/reset-password?token=' . $plain;
            $this->mailer->send(
                $email,
                'Reset your Omnes password',
                "Use this link to reset your password (expires in {$auth->passwordResetTtlHours} hour(s)):\n{$resetUrl}"
            );
        }

        return ['message' => self::GENERIC_RESET_MESSAGE];
    }

    /** @param array<string, mixed> $data */
    public function resetPassword(array $data): array
    {
        $token = (string) ($data['token'] ?? '');
        $password = (string) ($data['password'] ?? '');

        if ($token === '' || $password === '') {
            throw new AuthException('Token and new password are required.', 400);
        }

        if (strlen($password) < 8) {
            throw new AuthException('Password must be at least 8 characters.', 400);
        }

        $auth = Config::get()->auth();
        $record = $this->authTokens->findValid(
            'password_reset',
            TokenGenerator::hash($token, $auth->tokenPepper)
        );

        if ($record === null) {
            throw new AuthException('Invalid or expired reset token.', 400);
        }

        $userId = (int) $record['user_id'];
        $this->users->updatePassword($userId, PasswordHasher::hash($password));
        $this->authTokens->markUsed((int) $record['id']);
        $this->users->incrementTokenVersion($userId);
        $this->refreshTokens->revokeAllForUser($userId);

        return ['message' => 'Password has been reset. Please log in again.'];
    }

    /** @param array<string, mixed> $data */
    public function verifyEmail(array $data): array
    {
        $token = (string) ($data['token'] ?? '');

        if ($token === '') {
            throw new AuthException('Verification token is required.', 400);
        }

        $auth = Config::get()->auth();
        $record = $this->authTokens->findValid(
            'email_verify',
            TokenGenerator::hash($token, $auth->tokenPepper)
        );

        if ($record === null) {
            throw new AuthException('Invalid or expired verification token.', 400);
        }

        $this->users->markEmailVerified((int) $record['user_id']);
        $this->authTokens->markUsed((int) $record['id']);

        return ['message' => 'Email verified successfully.'];
    }

    public function refresh(Request $request, Response $response): Response
    {
        $refresh = $request->getCookieParams()[AuthCookieManager::REFRESH_COOKIE] ?? null;

        if (!is_string($refresh) || $refresh === '') {
            throw new AuthException('No refresh token provided.', 401);
        }

        $auth = Config::get()->auth();
        $hash = TokenGenerator::hash($refresh, $auth->tokenPepper);
        $record = $this->refreshTokens->findValid($hash);

        if ($record === null) {
            throw new AuthException('Invalid or expired refresh token.', 401);
        }

        $this->refreshTokens->revoke($hash);

        $userId = (int) $record['user_id'];
        $user = $this->users->findById($userId);

        if ($user === null) {
            throw new AuthException('User not found.', 401);
        }

        $user['token_version'] = $this->users->getTokenVersion($userId);

        return $this->issueAuthResponse($response, $user, 200, 'Token refreshed.');
    }

    public function me(int $userId): array
    {
        $user = $this->users->findById($userId);

        if ($user === null) {
            throw new AuthException('User not found.', 404);
        }

        return [
            'user' => $this->formatUser($user, $this->users->getRoleSlugs($userId)),
        ];
    }

    /** @param array<string, mixed> $user */
    private function issueAuthResponse(Response $response, array $user, int $status, string $message): Response
    {
        $userId = (int) $user['id'];
        $roles = $this->users->getRoleSlugs($userId);
        $accessToken = $this->jwt->createAccessToken($user, $roles);
        $refreshPlain = TokenGenerator::opaque();
        $auth = Config::get()->auth();

        $this->refreshTokens->store(
            $userId,
            TokenGenerator::hash($refreshPlain, $auth->tokenPepper),
            date('Y-m-d H:i:s', time() + $auth->refreshTtlSeconds),
            null,
            null
        );

        $csrf = TokenGenerator::opaque(16);
        $response = $this->cookies->withAccessToken($response, $accessToken, $this->jwt->getAccessTtl());
        $response = $this->cookies->withRefreshToken($response, $refreshPlain, $auth->refreshTtlSeconds);
        $response = $this->cookies->withCsrfToken($response, $csrf, $auth->refreshTtlSeconds);

        $body = [
            'message' => $message,
            'access_token' => $accessToken,
            'token_type' => 'Bearer',
            'expires_in' => $this->jwt->getAccessTtl(),
            'user' => $this->formatUser($user, $roles),
        ];

        $response->getBody()->write(json_encode($body, JSON_UNESCAPED_SLASHES));

        return $response->withStatus($status)->withHeader('Content-Type', 'application/json');
    }

    private function sendEmailVerification(int $userId, string $email): void
    {
        $plain = TokenGenerator::opaque();
        $auth = Config::get()->auth();
        $this->authTokens->create(
            $userId,
            'email_verify',
            TokenGenerator::hash($plain, $auth->tokenPepper),
            date('Y-m-d H:i:s', time() + $auth->emailVerifyTtlHours * 3600)
        );

        $verifyUrl = Config::get()->app()->url . '/verify-email?token=' . $plain;
        $this->mailer->send(
            $email,
            'Verify your Omnes account',
            "Welcome! Verify your email (expires in {$auth->emailVerifyTtlHours} hours):\n{$verifyUrl}"
        );
    }

    /** @param array<string, mixed> $user */
    /** @param list<string> $roles */
    private function formatUser(array $user, array $roles): array
    {
        return [
            'id' => (int) $user['id'],
            'uuid' => $user['uuid'],
            'username' => $user['username'],
            'email' => $user['email'],
            'first_name' => $user['first_name'] ?? null,
            'last_name' => $user['last_name'] ?? null,
            'roles' => $roles,
            'email_verified' => !empty($user['email_verified_at']),
            'status' => $user['status'],
        ];
    }

    private function clientIp(Request $request): string
    {
        $params = $request->getServerParams();

        return (string) ($params['REMOTE_ADDR'] ?? '0.0.0.0');
    }

    private function generateUuid(): string
    {
        return Uuid::v4();
    }
}

# update 1779719804
