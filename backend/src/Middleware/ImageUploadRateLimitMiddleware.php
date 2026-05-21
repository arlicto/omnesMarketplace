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
 * Rate limiting middleware specifically for image uploads.
 * Stricter limits than general API rate limiting to prevent abuse.
 */
final class ImageUploadRateLimitMiddleware implements MiddlewareInterface
{
    private array $uploads = [];
    private int $maxUploadsPerMinute;
    private int $maxUploadsPerHour;
    private int $maxUploadsPerDay;

    public function __construct(
        int $maxPerMinute = 5,
        int $maxPerHour = 20,
        int $maxPerDay = 50
    ) {
        $this->maxUploadsPerMinute = $maxPerMinute;
        $this->maxUploadsPerHour = $maxPerHour;
        $this->maxUploadsPerDay = $maxPerDay;
    }

    public function process(Request $request, RequestHandler $handler): Response
    {
        $userId = $request->getAttribute('user_id');
        $ip = $this->getClientIp($request);
        $identifier = $userId !== null ? 'user:' . $userId : 'ip:' . $ip;
        $currentTime = time();

        // Clean up old entries
        $this->cleanupOldEntries($currentTime);

        // Get current upload counts
        $key = $this->getKey($identifier);
        $counts = $this->uploads[$key] ?? [
            'minute' => ['count' => 0, 'window_start' => $currentTime],
            'hour' => ['count' => 0, 'window_start' => $currentTime],
            'day' => ['count' => 0, 'window_start' => $currentTime]
        ];

        // Reset windows if expired
        $counts = $this->resetExpiredWindows($counts, $currentTime);

        // Check limits
        if ($counts['minute']['count'] >= $this->maxUploadsPerMinute) {
            $this->logRateLimitExceeded($identifier, $ip, 'minute');
            return JsonResponse::error(
                'Rate limit exceeded: Maximum ' . $this->maxUploadsPerMinute . ' uploads per minute.',
                429,
                ['retry-after' => 60]
            );
        }

        if ($counts['hour']['count'] >= $this->maxUploadsPerHour) {
            $this->logRateLimitExceeded($identifier, $ip, 'hour');
            return JsonResponse::error(
                'Rate limit exceeded: Maximum ' . $this->maxUploadsPerHour . ' uploads per hour.',
                429,
                ['retry-after' => 3600]
            );
        }

        if ($counts['day']['count'] >= $this->maxUploadsPerDay) {
            $this->logRateLimitExceeded($identifier, $ip, 'day');
            return JsonResponse::error(
                'Rate limit exceeded: Maximum ' . $this->maxUploadsPerDay . ' uploads per day.',
                429,
                ['retry-after' => 86400]
            );
        }

        // Increment counters
        $counts['minute']['count']++;
        $counts['hour']['count']++;
        $counts['day']['count']++;
        $this->uploads[$key] = $counts;

        // Add rate limit headers
        $response = $handler->handle($request);
        
        return $response
            ->withHeader('X-ImageUpload-Limit-Minute', (string) $this->maxUploadsPerMinute)
            ->withHeader('X-ImageUpload-Remaining-Minute', (string) ($this->maxUploadsPerMinute - $counts['minute']['count']))
            ->withHeader('X-ImageUpload-Limit-Hour', (string) $this->maxUploadsPerHour)
            ->withHeader('X-ImageUpload-Remaining-Hour', (string) ($this->maxUploadsPerHour - $counts['hour']['count']))
            ->withHeader('X-ImageUpload-Limit-Day', (string) $this->maxUploadsPerDay)
            ->withHeader('X-ImageUpload-Remaining-Day', (string) ($this->maxUploadsPerDay - $counts['day']['count']));
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

    private function getKey(string $identifier): string
    {
        return 'image_upload:' . $identifier;
    }

    private function cleanupOldEntries(int $currentTime): void
    {
        foreach ($this->uploads as $key => $data) {
            $dayWindowStart = $data['day']['window_start'] ?? $currentTime;
            if ($currentTime - $dayWindowStart > 86400) {
                unset($this->uploads[$key]);
            }
        }
    }

    /**
     * Reset expired windows.
     * 
     * @param array{minute: array{count: int, window_start: int}, hour: array{count: int, window_start: int}, day: array{count: int, window_start: int}} $counts
     * @return array{minute: array{count: int, window_start: int}, hour: array{count: int, window_start: int}, day: array{count: int, window_start: int}}
     */
    private function resetExpiredWindows(array $counts, int $currentTime): array
    {
        // Reset minute window
        if ($currentTime - $counts['minute']['window_start'] > 60) {
            $counts['minute'] = ['count' => 0, 'window_start' => $currentTime];
        }

        // Reset hour window
        if ($currentTime - $counts['hour']['window_start'] > 3600) {
            $counts['hour'] = ['count' => 0, 'window_start' => $currentTime];
        }

        // Reset day window
        if ($currentTime - $counts['day']['window_start'] > 86400) {
            $counts['day'] = ['count' => 0, 'window_start' => $currentTime];
        }

        return $counts;
    }

    private function logRateLimitExceeded(string $identifier, string $ip, string $window): void
    {
        $logPath = dirname(__DIR__, 2) . '/' . Config::get()->logging()->path;
        $logEntry = sprintf(
            "[%s] IMAGE_UPLOAD_RATE_LIMIT_EXCEEDED identifier=%s ip=%s window=%s\n",
            date('Y-m-d H:i:s'),
            $identifier,
            $ip,
            $window
        );
        SecureLogger::write($logPath, $logEntry);
    }
}
