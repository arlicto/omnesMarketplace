<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

$app = AppFactory::create();

// Add Body Parsing Middleware
$app->addBodyParsingMiddleware();

// Add Global Exception Middleware
$app->add(new \App\Middleware\ExceptionMiddleware());

// Add Error Middleware
$app->addErrorMiddleware(true, true, true);

$app->get('/api/health', function (Request $request, Response $response, $args) {
    $dbStatus = 'disconnected';
    try {
        $db = \App\Services\DatabaseService::getConnection();
        $dbStatus = 'connected';
    } catch (\Exception $e) {
        $dbStatus = 'error: ' . $e->getMessage();
    }

    $response->getBody()->write(json_encode([
        'status' => 'ok',
        'timestamp' => time(),
        'db_host' => $_ENV['DB_HOST'] ?? 'not set',
        'database' => $dbStatus
    ]));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->group('/api/v1', function (\Slim\Routing\RouteCollectorProxy $group) {
    $group->post('/register', \App\Controllers\V1\AuthController::class . ':register');
    $group->post('/login', \App\Controllers\V1\AuthController::class . ':login');

    $group->get('/products', \App\Controllers\V1\ProductController::class . ':getAll');
    $group->get('/products/{id}', \App\Controllers\V1\ProductController::class . ':getOne');
    $group->post('/products', \App\Controllers\V1\ProductController::class . ':create');
});

$app->run();
