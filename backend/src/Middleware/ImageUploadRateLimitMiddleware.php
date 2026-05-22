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
 * Rate limiting middleware specifically for image uploads.
 * Stricter limits than general API rate limiting to prevent abuse.
 * Uses database storage (shared across PHP-FPM workers).
 */
final class ImageUploadRateLimitMiddleware implements MiddlewareInterface
{
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
        $endpoint = $request->getMethod() . ' ' . $request->getUri()->getPath();
        $currentTime = time();

        $minuteWindow = intdiv($currentTime, 60) * 60;
        $hourWindow = intdiv($currentTime, 3600) * 3600;
        $dayWindow = intdiv($currentTime, 86400) * 86400;

        try {
            $pdo = \App\Services\DatabaseService::getConnection();
        } catch (\Exception) {
            return $handler->handle($request);
        }

        $minuteCount = $this->getCount($pdo, $identifier, $endpoint, $minuteWindow);
        $hourCount = $this->getCount($pdo, $identifier, $endpoint, $hourWindow);
        $dayCount = $this->getCount($pdo, $identifier, $endpoint, $dayWindow);

        if ($minuteCount >= $this->maxUploadsPerMinute) {
            $this->logRateLimitExceeded($identifier, $ip, 'minute');
            return JsonResponse::error(
                'Rate limit exceeded: Maximum ' . $this->maxUploadsPerMinute . ' uploads per minute.',
                429,
                ['retry-after' => 60]
            );
        }

        if ($hourCount >= $this->maxUploadsPerHour) {
            $this->logRateLimitExceeded($identifier, $ip, 'hour');
            return JsonResponse::error(
                'Rate limit exceeded: Maximum ' . $this->maxUploadsPerHour . ' uploads per hour.',
                429,
                ['retry-after' => 3600]
            );
        }

        if ($dayCount >= $this->maxUploadsPerDay) {
            $this->logRateLimitExceeded($identifier, $ip, 'day');
            return JsonResponse::error(
                'Rate limit exceeded: Maximum ' . $this->maxUploadsPerDay . ' uploads per day.',
                429,
                ['retry-after' => 86400]
            );
        }

        $this->incrementCount($pdo, $identifier, $endpoint, $minuteWindow);
        if ($hourWindow !== $minuteWindow) {
            $this->incrementCount($pdo, $identifier, $endpoint, $hourWindow);
        }
        if ($dayWindow !== $hourWindow && $dayWindow !== $minuteWindow) {
            $this->incrementCount($pdo, $identifier, $endpoint, $dayWindow);
        }

        $remainingMinute = $this->maxUploadsPerMinute - ($minuteCount + 1);
        $remainingHour = $this->maxUploadsPerHour - ($hourCount + 1);
        $remainingDay = $this->maxUploadsPerDay - ($dayCount + 1);

        $response = $handler->handle($request);

        return $response
            ->withHeader('X-ImageUpload-Limit-Minute', (string) $this->maxUploadsPerMinute)
            ->withHeader('X-ImageUpload-Remaining-Minute', (string) max(0, $remainingMinute))
            ->withHeader('X-ImageUpload-Limit-Hour', (string) $this->maxUploadsPerHour)
            ->withHeader('X-ImageUpload-Remaining-Hour', (string) max(0, $remainingHour))
            ->withHeader('X-ImageUpload-Limit-Day', (string) $this->maxUploadsPerDay)
            ->withHeader('X-ImageUpload-Remaining-Day', (string) max(0, $remainingDay));
    }

    private function getCount(PDO $pdo, string $identifier, string $endpoint, int $windowStart): int
    {
        $stmt = $pdo->prepare(
            'SELECT count FROM rate_limits WHERE identifier = :identifier AND endpoint = :endpoint AND window_start = :window_start LIMIT 1'
        );
        $stmt->execute(['identifier' => $identifier, 'endpoint' => $endpoint, 'window_start' => $windowStart]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? (int) $row['count'] : 0;
    }

    private function incrementCount(PDO $pdo, string $identifier, string $endpoint, int $windowStart): void
    {
        $stmt = $pdo->prepare(
            'INSERT INTO rate_limits (identifier, endpoint, window_start, count) VALUES (:identifier, :endpoint, :window_start, 1)
             ON DUPLICATE KEY UPDATE count = count + 1, updated_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute(['identifier' => $identifier, 'endpoint' => $endpoint, 'window_start' => $windowStart]);
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
