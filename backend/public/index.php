<?php

declare(strict_types=1);

use App\Config\Config;
use App\Config\EnvLoader;
use App\Services\LogMailer;
use App\Services\MailerInterface;
use App\Services\JwtService;
use Slim\Factory\AppFactory;
use App\Core\Container;

require __DIR__ . '/../vendor/autoload.php';

EnvLoader::bootstrap(dirname(__DIR__));

$container = new Container();

$container->set(PDO::class, function () {
    return \App\Services\DatabaseService::getConnection();
});

$container->set(JwtService::class, function () {
    return JwtService::fromConfig();
});

$container->set(MailerInterface::class, function () {
    $logPath = dirname(__DIR__) . '/' . Config::get()->logging()->path;
    $mailLog = dirname($logPath) . '/mail.log';

    return new LogMailer($mailLog);
});

AppFactory::setContainer($container);
$app = AppFactory::create();

$app->addBodyParsingMiddleware();
$app->add(new \App\Middleware\CorsMiddleware());
$app->add(new \App\Middleware\ExceptionMiddleware());
$app->add(new \App\Middleware\SecurityHeadersMiddleware());
$app->add(new \App\Middleware\RequestLoggingMiddleware());

$appConfig = Config::get()->app();

$app->addErrorMiddleware(
    $appConfig->isDevelopment(),
    true,
    !$appConfig->isProduction()
);

$registerRoutes = require __DIR__ . '/../routes/api.php';
$registerRoutes($app);

$app->run();
