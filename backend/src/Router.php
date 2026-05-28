<?php

declare(strict_types=1);

class Router
{
    private array $routes = [];

    public function get(string $path, callable $handler): void
    {
        $this->routes['GET'][] = ['path' => $path, 'handler' => $handler];
    }

    public function post(string $path, callable $handler): void
    {
        $this->routes['POST'][] = ['path' => $path, 'handler' => $handler];
    }

    public function put(string $path, callable $handler): void
    {
        $this->routes['PUT'][] = ['path' => $path, 'handler' => $handler];
    }

    public function patch(string $path, callable $handler): void
    {
        $this->routes['PATCH'][] = ['path' => $path, 'handler' => $handler];
    }

    public function delete(string $path, callable $handler): void
    {
        $this->routes['DELETE'][] = ['path' => $path, 'handler' => $handler];
    }

    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $routes = $this->routes[$method] ?? [];

        foreach ($routes as $route) {
            $pattern = preg_replace('/\{(\w+)\}/', '(?P<$1>[^/]+)', $route['path']);
            $pattern = '#^' . $pattern . '$#';

            if (preg_match($pattern, $uri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                echo call_user_func($route['handler'], $params);
                return;
            }
        }

        http_response_code(404);
        echo json(['error' => 'Not found']);
    }
}
