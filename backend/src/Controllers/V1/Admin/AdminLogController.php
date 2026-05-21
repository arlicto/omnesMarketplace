<?php

declare(strict_types=1);

namespace App\Controllers\V1\Admin;

use App\Repositories\AuditLogRepository;
use App\Support\JsonResponse;
use App\Support\Pagination;
use App\Support\SearchFilter;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

/**
 * Admin controller for audit logs viewer.
 */
final class AdminLogController
{
    public function __construct(private AuditLogRepository $auditLogs)
    {
    }

    /**
     * Get all audit logs with pagination and filters.
     */
    public function getAll(Request $request, Response $response): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $queryParams = $request->getQueryParams();
        $pagination = Pagination::fromQuery($queryParams);
        $searchFilter = SearchFilter::fromQuery($queryParams, ['id', 'created_at']);

        try {
            $logs = $this->auditLogs->findAll(
                $pagination->getLimit(),
                $pagination->getOffset(),
                $searchFilter->getFilter('action'),
                $searchFilter->getFilter('entity_type')
            );

            $total = $this->auditLogs->count(
                $searchFilter->getFilter('action'),
                $searchFilter->getFilter('entity_type')
            );

            $pagination = Pagination::withTotal(
                $pagination->getPage(),
                $pagination->getPerPage(),
                $total
            );

            return JsonResponse::make([
                'logs' => $logs,
                'pagination' => $pagination->toArray(),
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a single audit log by ID.
     */
    public function getOne(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $logId = (int) $args['id'];

        try {
            $log = $this->auditLogs->findById($logId);
            if ($log === null) {
                return JsonResponse::error('Audit log not found.', 404);
            }

            return JsonResponse::make([
                'log' => $log,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }
}
