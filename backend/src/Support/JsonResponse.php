<?php

declare(strict_types=1);

namespace App\Support;

use Psr\Http\Message\ResponseInterface as ResponseInterface;
use Slim\Psr7\Response;

final class JsonResponse
{
    /** @param array<string, mixed> $data */
    public static function make(array $data, int $status = 200): ResponseInterface
    {
        $response = new Response($status);
        $response->getBody()->write(json_encode($data, JSON_UNESCAPED_SLASHES));

        return $response->withHeader('Content-Type', 'application/json');
    }

    public static function error(string $message, int $status = 400): ResponseInterface
    {
        return self::make(['error' => true, 'message' => $message], $status);
    }
}
