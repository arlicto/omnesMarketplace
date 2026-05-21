<?php

declare(strict_types=1);

namespace App\Controllers\V1\Admin;

use App\Config\Security\AuditLogger;
use App\Config\Validation\InputValidator;
use App\Repositories\OrderRepository;
use App\Support\JsonResponse;
use App\Support\Pagination;
use App\Support\SearchFilter;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

/**
 * Admin controller for order management.
 */
final class AdminOrderController
{
    public function __construct(
        private OrderRepository $orders,
        private AuditLogger $auditLogger
    ) {
    }

    /**
     * Get all orders with pagination and filters.
     */
    public function getAll(Request $request, Response $response): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $queryParams = $request->getQueryParams();
        $pagination = Pagination::fromQuery($queryParams);
        $searchFilter = SearchFilter::fromQuery($queryParams, ['id', 'created_at', 'final_price']);

        try {
            $orders = $this->orders->findAll(
                $pagination->getLimit(),
                $pagination->getOffset(),
                $searchFilter->getFilter('status')
            );

            $total = $this->orders->count($searchFilter->getFilter('status'));

            $pagination = Pagination::withTotal(
                $pagination->getPage(),
                $pagination->getPerPage(),
                $total
            );

            return JsonResponse::make([
                'orders' => $orders,
                'pagination' => $pagination->toArray(),
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a single order by ID.
     */
    public function getOne(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $orderId = (int) $args['id'];

        try {
            $order = $this->orders->findById($orderId);
            if ($order === null) {
                return JsonResponse::error('Order not found.', 404);
            }

            return JsonResponse::make([
                'order' => $order,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $orderId = (int) $args['id'];
        $data = (array) $request->getParsedBody();

        try {
            $status = InputValidator::enum($data['status'] ?? '', ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']);
            $trackingNumber = InputValidator::string($data['tracking_number'] ?? '', 0, 255);
            $notes = InputValidator::string($data['notes'] ?? '', 0, 1000);

            $order = $this->orders->findById($orderId);
            if ($order === null) {
                return JsonResponse::error('Order not found.', 404);
            }

            $oldStatus = $order['status'];
            $updated = $this->orders->updateStatus(
                $orderId,
                $status,
                $trackingNumber !== '' ? $trackingNumber : null,
                $notes !== '' ? $notes : null
            );

            if (!$updated) {
                return JsonResponse::error('Failed to update order status.', 500);
            }

            // Log audit
            $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
            $userAgent = $request->getHeaderLine('User-Agent');
            $this->auditLogger->logOrderAction(
                (int) $admin['id'],
                'status_updated',
                $orderId,
                ['status' => $oldStatus],
                ['status' => $status, 'tracking_number' => $trackingNumber, 'notes' => $notes],
                $ip,
                $userAgent
            );

            return JsonResponse::make([
                'message' => 'Order status updated successfully.',
            ]);

        } catch (\InvalidArgumentException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }
}
