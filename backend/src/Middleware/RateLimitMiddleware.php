<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Config\Config;
use App\Config\Security\SecureLogger;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use PDO;

/**
 * General rate limiting middleware to prevent brute force attacks and abuse.
 * Uses a sliding window algorithm with database storage (shared across PHP-FPM workers).
 */
final class RateLimitMiddleware implements MiddlewareInterface
{
    private int $windowSize;
    private int $maxRequests;

    public function __construct(?int $maxRequests = null, ?int $windowSeconds = null)
    {
        $this->maxRequests = $maxRequests ?? 100;
        $this->windowSize = $windowSeconds ?? 60;
    }

    public function process(Request $request, RequestHandler $handler): Response
    {
        $ip = $this->getClientIp($request);
        $identifier = $this->getIdentifier($request, $ip);
        $currentTime = time();

        $windowStart = intdiv($currentTime, $this->windowSize) * $this->windowSize;

        try {
            $pdo = \App\Services\DatabaseService::getConnection();
        } catch (\Exception) {
            return $handler->handle($request);
        }

        $count = $this->getCount($pdo, $identifier, $windowStart);

        if ($count >= $this->maxRequests) {
            $this->logRateLimitExceeded($identifier, $ip);
            return JsonResponse::error(
                'Rate limit exceeded. Please try again later.',
                429,
                ['retry-after' => $this->windowSize - ($currentTime - $windowStart)]
            );
        }

        $this->incrementCount($pdo, $identifier, $windowStart, $count);

        $response = $handler->handle($request);
        $remaining = $this->maxRequests - ($count + 1);

        return $response
            ->withHeader('X-RateLimit-Limit', (string) $this->maxRequests)
            ->withHeader('X-RateLimit-Remaining', (string) max(0, $remaining))
            ->withHeader('X-RateLimit-Reset', (string) ($windowStart + $this->windowSize));
    }

    private function getCount(PDO $pdo, string $identifier, int $windowStart): int
    {
        $stmt = $pdo->prepare(
            'SELECT count FROM rate_limits WHERE identifier = :identifier AND window_start = :window_start LIMIT 1'
        );
        $stmt->execute(['identifier' => $identifier, 'window_start' => $windowStart]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $pdo->prepare(
                'UPDATE rate_limits SET updated_at = CURRENT_TIMESTAMP WHERE identifier = :identifier AND window_start = :window_start'
            )->execute(['identifier' => $identifier, 'window_start' => $windowStart]);
        }

        return $row ? (int) $row['count'] : 0;
    }

    private function incrementCount(PDO $pdo, string $identifier, int $windowStart, int $currentCount): void
    {
        if ($currentCount === 0) {
            $stmt = $pdo->prepare(
                'INSERT INTO rate_limits (identifier, endpoint, window_start, count) VALUES (:identifier, :endpoint, :window_start, 1)'
            );
            $stmt->execute(['identifier' => $identifier, 'endpoint' => '', 'window_start' => $windowStart]);
        } else {
            $stmt = $pdo->prepare(
                'UPDATE rate_limits SET count = count + 1, updated_at = CURRENT_TIMESTAMP WHERE identifier = :identifier AND window_start = :window_start'
            );
            $stmt->execute(['identifier' => $identifier, 'window_start' => $windowStart]);
        }
    }

    private function cleanupOldEntries(PDO $pdo): void
    {
        $cutoff = time() - $this->windowSize * 2;
        $pdo->prepare('DELETE FROM rate_limits WHERE window_start < :cutoff')
            ->execute(['cutoff' => $cutoff]);
    }

    private function getClientIp(Request $request): string
    {
        $params = $request->getServerParams();

        $forwarded = $params['HTTP_X_FORWARDED_FOR'] ?? null;
        if ($forwarded) {
            $ips = explode(',', $forwarded);
            return trim($ips[0]);
        }

        return (string) ($params['REMOTE_ADDR'] ?? '0.0.0.0');
    }

    private function getIdentifier(Request $request, string $ip): string
    {
        $userId = $request->getAttribute('user_id');

        if ($userId !== null) {
            return 'user:' . $userId;
        }

        return 'ip:' . $ip;
    }

    private function logRateLimitExceeded(string $identifier, string $ip): void
    {
        $logPath = dirname(__DIR__, 2) . '/' . Config::get()->logging()->path;
        $logEntry = sprintf(
            "[%s] RATE_LIMIT_EXCEEDED identifier=%s ip=%s\n",
            date('Y-m-d H:i:s'),
            $identifier,
            $ip
        );
        SecureLogger::write($logPath, $logEntry);
    }
}
