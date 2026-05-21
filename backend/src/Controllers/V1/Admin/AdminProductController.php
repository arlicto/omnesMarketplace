<?php

declare(strict_types=1);

namespace App\Controllers\V1\Admin;

use App\Config\Security\AuditLogger;
use App\Repositories\ProductRepository;
use App\Support\JsonResponse;
use App\Support\Pagination;
use App\Support\SearchFilter;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

/**
 * Admin controller for product management.
 */
final class AdminProductController
{
    public function __construct(
        private ProductRepository $products,
        private AuditLogger $auditLogger
    ) {
    }

    /**
     * Get all products with pagination and filters.
     */
    public function getAll(Request $request, Response $response): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $queryParams = $request->getQueryParams();
        $pagination = Pagination::fromQuery($queryParams);
        $searchFilter = SearchFilter::fromQuery($queryParams, ['id', 'name', 'price', 'created_at']);

        try {
            $products = $this->products->findAll(
                $pagination->getLimit(),
                $pagination->getOffset(),
                $searchFilter->getSearch(),
                $searchFilter->getFilter('status'),
                $searchFilter->getFilter('category_id')
            );

            $total = $this->products->count(
                $searchFilter->getSearch(),
                $searchFilter->getFilter('status'),
                $searchFilter->getFilter('category_id')
            );

            $pagination = Pagination::withTotal(
                $pagination->getPage(),
                $pagination->getPerPage(),
                $total
            );

            return JsonResponse::make([
                'products' => $products,
                'pagination' => $pagination->toArray(),
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a single product by ID.
     */
    public function getOne(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $productId = (int) $args['id'];

        try {
            $product = $this->products->findById($productId);
            if ($product === null) {
                return JsonResponse::error('Product not found.', 404);
            }

            return JsonResponse::make([
                'product' => $product,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Update product status.
     */
    public function updateStatus(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $productId = (int) $args['id'];
        $data = (array) $request->getParsedBody();

        try {
            $status = $data['status'] ?? null;
            if (!in_array($status, ['active', 'inactive', 'suspended', 'deleted'], true)) {
                return JsonResponse::error('Invalid status.', 400);
            }

            $product = $this->products->findById($productId);
            if ($product === null) {
                return JsonResponse::error('Product not found.', 404);
            }

            $oldStatus = $product['status'];
            $updated = $this->products->updateStatus($productId, $status);

            if (!$updated) {
                return JsonResponse::error('Failed to update product status.', 500);
            }

            // Log audit
            $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
            $userAgent = $request->getHeaderLine('User-Agent');
            $this->auditLogger->logProductAction(
                (int) $admin['id'],
                'status_updated',
                $productId,
                ['status' => $oldStatus],
                ['status' => $status],
                $ip,
                $userAgent
            );

            return JsonResponse::make([
                'message' => 'Product status updated successfully.',
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete product.
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $productId = (int) $args['id'];

        try {
            $product = $this->products->findById($productId);
            if ($product === null) {
                return JsonResponse::error('Product not found.', 404);
            }

            $deleted = $this->products->delete($productId);

            if (!$deleted) {
                return JsonResponse::error('Failed to delete product.', 500);
            }

            // Log audit
            $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
            $userAgent = $request->getHeaderLine('User-Agent');
            $this->auditLogger->logProductAction(
                (int) $admin['id'],
                'product_deleted',
                $productId,
                ['name' => $product['name'], 'status' => $product['status']],
                null,
                $ip,
                $userAgent
            );

            return JsonResponse::make([
                'message' => 'Product deleted successfully.',
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }
}
