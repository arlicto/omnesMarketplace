<?php

declare(strict_types=1);

namespace App\Controllers\V1\Admin;

use App\Repositories\AuditLogRepository;
use App\Repositories\NegotiationRepository;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use App\Repositories\UserRepository;
use App\Support\JsonResponse;
use PDO;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

/**
 * Admin controller for analytics overview.
 */
final class AdminAnalyticsController
{
    public function __construct(
        private UserRepository $users,
        private ProductRepository $products,
        private OrderRepository $orders,
        private NegotiationRepository $negotiations,
        private AuditLogRepository $auditLogs,
        private PDO $db
    ) {
    }

    /**
     * Get analytics overview.
     */
    public function getOverview(Request $request, Response $response): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        try {
            $stats = [
                'users' => [
                    'total' => $this->users->count(),
                    'active' => $this->users->count(null, null, 'active'),
                    'banned' => $this->users->count(null, null, 'banned'),
                ],
                'products' => [
                    'total' => $this->products->count(),
                    'active' => $this->products->count(null, 'active'),
                    'inactive' => $this->products->count(null, 'inactive'),
                ],
                'orders' => [
                    'total' => $this->orders->count(),
                    'pending' => $this->orders->count('pending'),
                    'processing' => $this->orders->count('processing'),
                    'shipped' => $this->orders->count('shipped'),
                    'delivered' => $this->orders->count('delivered'),
                    'cancelled' => $this->orders->count('cancelled'),
                ],
                'negotiations' => [
                    'total' => $this->negotiations->count(),
                    'pending' => $this->negotiations->count('pending'),
                    'accepted' => $this->negotiations->count('accepted'),
                    'rejected' => $this->negotiations->count('rejected'),
                ],
                'revenue' => $this->getRevenueStats(),
                'recent_activity' => $this->auditLogs->findAll(10, 0),
            ];

            return JsonResponse::make([
                'stats' => $stats,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Get revenue statistics.
     * 
     * @return array<string, mixed>
     */
    private function getRevenueStats(): array
    {
        $stmt = $this->db->prepare(
            'SELECT 
                COUNT(*) as total_orders,
                SUM(final_price) as total_revenue,
                AVG(final_price) as avg_order_value,
                SUM(CASE WHEN status = "delivered" THEN final_price ELSE 0 END) as delivered_revenue
             FROM orders
             WHERE deleted_at IS NULL'
        );
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return [
            'total_orders' => (int) ($result['total_orders'] ?? 0),
            'total_revenue' => (float) ($result['total_revenue'] ?? 0),
            'avg_order_value' => (float) ($result['avg_order_value'] ?? 0),
            'delivered_revenue' => (float) ($result['delivered_revenue'] ?? 0),
        ];
    }

    /**
     * Get user registration trends.
     */
    public function getUserTrends(Request $request, Response $response): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $queryParams = $request->getQueryParams();
        $days = (int) ($queryParams['days'] ?? 30);

        try {
            $stmt = $this->db->prepare(
                'SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as count
                 FROM users
                 WHERE deleted_at IS NULL
                 AND created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                 GROUP BY DATE(created_at)
                 ORDER BY date ASC'
            );
            $stmt->execute(['days' => $days]);

            $trends = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

            return JsonResponse::make([
                'trends' => $trends,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Get sales trends.
     */
    public function getSalesTrends(Request $request, Response $response): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $queryParams = $request->getQueryParams();
        $days = (int) ($queryParams['days'] ?? 30);

        try {
            $stmt = $this->db->prepare(
                'SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as orders,
                    SUM(final_price) as revenue
                 FROM orders
                 WHERE deleted_at IS NULL
                 AND created_at >= DATE_SUB(NOW(), INTERVAL :days DAY)
                 GROUP BY DATE(created_at)
                 ORDER BY date ASC'
            );
            $stmt->execute(['days' => $days]);

            $trends = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

            return JsonResponse::make([
                'trends' => $trends,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }
}
