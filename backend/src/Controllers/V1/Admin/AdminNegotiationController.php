<?php

declare(strict_types=1);

namespace App\Controllers\V1\Admin;

use App\Config\Security\AuditLogger;
use App\Config\Validation\InputValidator;
use App\Repositories\NegotiationRepository;
use App\Support\JsonResponse;
use App\Support\Pagination;
use App\Support\SearchFilter;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

/**
 * Admin controller for negotiation management.
 */
final class AdminNegotiationController
{
    public function __construct(
        private NegotiationRepository $negotiations,
        private AuditLogger $auditLogger
    ) {
    }

    /**
     * Get all negotiations with pagination and filters.
     */
    public function getAll(Request $request, Response $response): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $queryParams = $request->getQueryParams();
        $pagination = Pagination::fromQuery($queryParams);
        $searchFilter = SearchFilter::fromQuery($queryParams, ['id', 'created_at', 'current_offer']);

        try {
            $negotiations = $this->negotiations->findAll(
                $pagination->getLimit(),
                $pagination->getOffset(),
                $searchFilter->getFilter('status')
            );

            $total = $this->negotiations->count($searchFilter->getFilter('status'));

            $pagination = Pagination::withTotal(
                $pagination->getPage(),
                $pagination->getPerPage(),
                $total
            );

            return JsonResponse::make([
                'negotiations' => $negotiations,
                'pagination' => $pagination->toArray(),
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a single negotiation by ID.
     */
    public function getOne(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $negotiationId = (int) $args['id'];

        try {
            $negotiation = $this->negotiations->findById($negotiationId);
            if ($negotiation === null) {
                return JsonResponse::error('Negotiation not found.', 404);
            }

            return JsonResponse::make([
                'negotiation' => $negotiation,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Cancel negotiation.
     */
    public function cancel(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $negotiationId = (int) $args['id'];
        $data = (array) $request->getParsedBody();

        try {
            $reason = InputValidator::string($data['reason'] ?? '', 1, 500);

            $negotiation = $this->negotiations->findById($negotiationId);
            if ($negotiation === null) {
                return JsonResponse::error('Negotiation not found.', 404);
            }

            $oldStatus = $negotiation['status'];
            $updated = $this->negotiations->updateStatus($negotiationId, 'rejected', null, $reason);

            if (!$updated) {
                return JsonResponse::error('Failed to cancel negotiation.', 500);
            }

            // Log audit
            $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
            $userAgent = $request->getHeaderLine('User-Agent');
            $this->auditLogger->logNegotiationAction(
                (int) $admin['id'],
                'negotiation_cancelled',
                $negotiationId,
                ['status' => $oldStatus],
                ['status' => 'rejected', 'reason' => $reason],
                $ip,
                $userAgent
            );

            return JsonResponse::make([
                'message' => 'Negotiation cancelled successfully.',
            ]);

        } catch (\InvalidArgumentException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }
}
