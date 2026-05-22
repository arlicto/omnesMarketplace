<?php

declare(strict_types=1);

use App\Config\Config;
use App\Controllers\V1\Admin\AdminAnalyticsController;
use App\Controllers\V1\Admin\AdminLogController;
use App\Controllers\V1\Admin\AdminNegotiationController;
use App\Controllers\V1\Admin\AdminOrderController;
use App\Controllers\V1\Admin\AdminProductController;
use App\Controllers\V1\Admin\AdminUserController;
use App\Controllers\V1\AuthController;
use App\Controllers\V1\CartController;
use App\Controllers\V1\ImageUploadController;
use App\Controllers\V1\NegotiationController;
use App\Controllers\V1\NotificationController;
use App\Controllers\V1\OrderController;
use App\Controllers\V1\ProductController;
use App\Controllers\V1\UploadController;
use App\Middleware\AdminMiddleware;
use App\Middleware\AuthMiddleware;
use App\Middleware\CsrfMiddleware;
use App\Middleware\HttpsRedirectMiddleware;
use App\Middleware\ImageUploadRateLimitMiddleware;
use App\Middleware\LoginThrottleMiddleware;
use App\Middleware\RateLimitMiddleware;
use App\Middleware\RoleMiddleware;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {
    // Apply HTTPS redirect middleware (only in production)
    $app->add(new HttpsRedirectMiddleware());
    
    // Apply rate limiting to all API endpoints
    $app->add(new RateLimitMiddleware(100, 60));

    $app->get('/api/health', function ($request, $response) {
        $config = Config::get();
        $appSettings = $config->app();

        $dbStatus = 'disconnected';
        try {
            \App\Services\DatabaseService::getConnection();
            $dbStatus = 'connected';
        } catch (\Exception) {
            $dbStatus = $appSettings->isDevelopment() ? 'error' : 'disconnected';
        }

        $payload = [
            'status' => 'ok',
            'timestamp' => time(),
            'environment' => $appSettings->env,
            'database' => $dbStatus,
        ];

        $response->getBody()->write(json_encode($payload, JSON_PRETTY_PRINT));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->group('/api/v1', function (RouteCollectorProxy $group) {
        // Public auth endpoints (no CSRF — no session yet)
        $group->group('/auth', function (RouteCollectorProxy $auth) {
            $auth->post('/register', AuthController::class . ':register');
            $auth->post('/login', AuthController::class . ':login')
                ->add(LoginThrottleMiddleware::class);
            $auth->post('/forgot-password', AuthController::class . ':forgotPassword');
            $auth->post('/reset-password', AuthController::class . ':resetPassword');
            $auth->post('/verify-email', AuthController::class . ':verifyEmail');
            $auth->get('/verify-email', AuthController::class . ':verifyEmail');

            // Protected auth endpoints
            $auth->get('/me', AuthController::class . ':me')
                ->add(AuthMiddleware::class);
            $auth->post('/logout', AuthController::class . ':logout')
                ->add(AuthMiddleware::class)
                ->add(CsrfMiddleware::class);
        });

        // Public catalog
        $group->get('/products', ProductController::class . ':getAll');
        $group->get('/products/{id}', ProductController::class . ':getOne');

        // Protected seller routes
        $group->post('/products', ProductController::class . ':create')
            ->add(AuthMiddleware::class)
            ->add(RoleMiddleware::seller())
            ->add(CsrfMiddleware::class);

        $group->post('/products/{id}/image', ProductController::class . ':uploadImage')
            ->add(AuthMiddleware::class)
            ->add(RoleMiddleware::seller())
            ->add(CsrfMiddleware::class);

        // Protected negotiation routes
        $group->group('/negotiations', function (RouteCollectorProxy $negotiationGroup) {
            $negotiationGroup->post('/offers', NegotiationController::class . ':createOffer')
                ->add(AuthMiddleware::class)
                ->add(CsrfMiddleware::class);
            
            $negotiationGroup->get('/offers/buyer', NegotiationController::class . ':getBuyerNegotiations')
                ->add(AuthMiddleware::class);
            
            $negotiationGroup->get('/offers/seller', NegotiationController::class . ':getSellerNegotiations')
                ->add(AuthMiddleware::class);
            
            $negotiationGroup->get('/offers/{id}', NegotiationController::class . ':getNegotiation')
                ->add(AuthMiddleware::class);
            
            $negotiationGroup->post('/offers/{id}/accept', NegotiationController::class . ':acceptOffer')
                ->add(AuthMiddleware::class)
                ->add(CsrfMiddleware::class);
            
            $negotiationGroup->post('/offers/{id}/reject', NegotiationController::class . ':rejectOffer')
                ->add(AuthMiddleware::class)
                ->add(CsrfMiddleware::class);
            
            $negotiationGroup->post('/offers/{id}/counter', NegotiationController::class . ':counterOffer')
                ->add(AuthMiddleware::class)
                ->add(CsrfMiddleware::class);
        });

        // Protected notification routes
        $group->group('/notifications', function (RouteCollectorProxy $notificationGroup) {
            $notificationGroup->get('', NotificationController::class . ':getNotifications')
                ->add(AuthMiddleware::class);
            
            $notificationGroup->get('/unread-count', NotificationController::class . ':getUnreadCount')
                ->add(AuthMiddleware::class);
            
            $notificationGroup->post('/{id}/read', NotificationController::class . ':markAsRead')
                ->add(AuthMiddleware::class);
            
            $notificationGroup->post('/read-all', NotificationController::class . ':markAllAsRead')
                ->add(AuthMiddleware::class);
            
            $notificationGroup->delete('/{id}', NotificationController::class . ':delete')
                ->add(AuthMiddleware::class)
                ->add(CsrfMiddleware::class);
        });

        // Protected cart routes
        $group->get('/cart', CartController::class . ':getCart')
            ->add(AuthMiddleware::class);

        $group->post('/cart/items', CartController::class . ':addItem')
            ->add(AuthMiddleware::class)
            ->add(CsrfMiddleware::class);

        $group->delete('/cart/items/{id}', CartController::class . ':removeItem')
            ->add(AuthMiddleware::class)
            ->add(CsrfMiddleware::class);

        // Protected order routes
        $group->post('/orders', OrderController::class . ':create')
            ->add(AuthMiddleware::class)
            ->add(CsrfMiddleware::class);

        // Protected upload routes
        $group->post('/upload', UploadController::class . ':upload')
            ->add(AuthMiddleware::class)
            ->add(CsrfMiddleware::class);

        // Protected image upload routes with stricter rate limiting
        $group->group('/images', function (RouteCollectorProxy $imageGroup) {
            $imageGroup->post('/upload', ImageUploadController::class . ':upload')
                ->add(AuthMiddleware::class)
                ->add(CsrfMiddleware::class);
            
            $imageGroup->post('/upload-multiple', ImageUploadController::class . ':uploadMultiple')
                ->add(AuthMiddleware::class)
                ->add(CsrfMiddleware::class);
            
            $imageGroup->delete('/{filename}', ImageUploadController::class . ':delete')
                ->add(AuthMiddleware::class)
                ->add(CsrfMiddleware::class);
        })->add(new ImageUploadRateLimitMiddleware(5, 20, 50));

        // Admin routes (protected by AdminMiddleware)
        $group->group('/admin', function (RouteCollectorProxy $adminGroup) {
            // User management
            $adminGroup->get('/users', AdminUserController::class . ':getAll');
            $adminGroup->get('/users/{id}', AdminUserController::class . ':getOne');
            $adminGroup->post('/users/{id}/role', AdminUserController::class . ':updateRole')
                ->add(CsrfMiddleware::class);
            $adminGroup->post('/users/{id}/ban', AdminUserController::class . ':banUser')
                ->add(CsrfMiddleware::class);
            $adminGroup->post('/users/{id}/unban', AdminUserController::class . ':unbanUser')
                ->add(CsrfMiddleware::class);
            $adminGroup->delete('/users/{id}', AdminUserController::class . ':delete')
                ->add(CsrfMiddleware::class);

            // Product management
            $adminGroup->get('/products', AdminProductController::class . ':getAll');
            $adminGroup->get('/products/{id}', AdminProductController::class . ':getOne');
            $adminGroup->post('/products/{id}/status', AdminProductController::class . ':updateStatus')
                ->add(CsrfMiddleware::class);
            $adminGroup->delete('/products/{id}', AdminProductController::class . ':delete')
                ->add(CsrfMiddleware::class);

            // Order management
            $adminGroup->get('/orders', AdminOrderController::class . ':getAll');
            $adminGroup->get('/orders/{id}', AdminOrderController::class . ':getOne');
            $adminGroup->post('/orders/{id}/status', AdminOrderController::class . ':updateStatus')
                ->add(CsrfMiddleware::class);

            // Negotiation management
            $adminGroup->get('/negotiations', AdminNegotiationController::class . ':getAll');
            $adminGroup->get('/negotiations/{id}', AdminNegotiationController::class . ':getOne');
            $adminGroup->post('/negotiations/{id}/cancel', AdminNegotiationController::class . ':cancel')
                ->add(CsrfMiddleware::class);

            // Audit logs
            $adminGroup->get('/logs', AdminLogController::class . ':getAll');
            $adminGroup->get('/logs/{id}', AdminLogController::class . ':getOne');

            // Analytics
            $adminGroup->get('/analytics/overview', AdminAnalyticsController::class . ':getOverview');
            $adminGroup->get('/analytics/users/trends', AdminAnalyticsController::class . ':getUserTrends');
            $adminGroup->get('/analytics/sales/trends', AdminAnalyticsController::class . ':getSalesTrends');
        })->add(AdminMiddleware::class)->add(AuthMiddleware::class);
    });
};
