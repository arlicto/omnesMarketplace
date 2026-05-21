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

/**
 * General rate limiting middleware to prevent brute force attacks and abuse.
 * Uses a sliding window algorithm with in-memory storage.
 */
final class RateLimitMiddleware implements MiddlewareInterface
{
    private array $requests = [];
    private int $windowSize;
    private int $maxRequests;

    public function __construct(?int $maxRequests = null, ?int $windowSeconds = null)
    {
        $this->maxRequests = $maxRequests ?? 100; // Default: 100 requests
        $this->windowSize = $windowSeconds ?? 60; // Default: 60 seconds
    }

    public function process(Request $request, RequestHandler $handler): Response
    {
        $ip = $this->getClientIp($request);
        $identifier = $this->getIdentifier($request, $ip);
        $currentTime = time();

        // Clean up old entries outside the window
        $this->cleanupOldEntries($currentTime);

        // Get current request count for this identifier
        $key = $this->getKey($identifier);
        $count = $this->requests[$key]['count'] ?? 0;
        $firstRequestTime = $this->requests[$key]['first_request'] ?? $currentTime;

        // Reset if window has expired
        if ($currentTime - $firstRequestTime > $this->windowSize) {
            $count = 0;
            $firstRequestTime = $currentTime;
        }

        // Check if limit exceeded
        if ($count >= $this->maxRequests) {
            $this->logRateLimitExceeded($identifier, $ip);
            return JsonResponse::error(
                'Rate limit exceeded. Please try again later.',
                429,
                ['retry-after' => $this->windowSize - ($currentTime - $firstRequestTime)]
            );
        }

        // Increment counter
        $this->requests[$key] = [
            'count' => $count + 1,
            'first_request' => $firstRequestTime,
            'last_request' => $currentTime
        ];

        // Add rate limit headers
        $response = $handler->handle($request);
        $remaining = $this->maxRequests - ($count + 1);
        
        return $response
            ->withHeader('X-RateLimit-Limit', (string) $this->maxRequests)
            ->withHeader('X-RateLimit-Remaining', (string) max(0, $remaining))
            ->withHeader('X-RateLimit-Reset', (string) ($firstRequestTime + $this->windowSize));
    }

    private function getClientIp(Request $request): string
    {
        $params = $request->getServerParams();
        
        // Check for forwarded headers (behind proxy)
        $forwarded = $params['HTTP_X_FORWARDED_FOR'] ?? null;
        if ($forwarded) {
            // Take the first IP in the chain
            $ips = explode(',', $forwarded);
            return trim($ips[0]);
        }

        return (string) ($params['REMOTE_ADDR'] ?? '0.0.0.0');
    }

    private function getIdentifier(Request $request, string $ip): string
    {
        // Use user ID if authenticated, otherwise use IP
        $userId = $request->getAttribute('user_id');
        
        if ($userId !== null) {
            return 'user:' . $userId;
        }

        return 'ip:' . $ip;
    }

    private function getKey(string $identifier): string
    {
        return $identifier;
    }

    private function cleanupOldEntries(int $currentTime): void
    {
        foreach ($this->requests as $key => $data) {
            if ($currentTime - $data['last_request'] > $this->windowSize) {
                unset($this->requests[$key]);
            }
        }
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
