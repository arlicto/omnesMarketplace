<?php

declare(strict_types=1);

namespace App\Controllers\V1;

use App\Config\Validation\InputValidator;
use App\Services\NegotiationService;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

/**
 * Controller for buyer-seller negotiations.
 * Handles offer creation, acceptance, rejection, and counter-offers.
 */
final class NegotiationController
{
    public function __construct(private NegotiationService $negotiationService)
    {
    }

    /**
     * Create a new negotiation offer.
     */
    public function createOffer(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $data = (array) $request->getParsedBody();

        try {
            // Validate input
            $productId = InputValidator::int($data['product_id'] ?? 0, 1, PHP_INT_MAX);
            $offer = InputValidator::float($data['offer'] ?? 0, 0.01, 999999.99);
            $message = InputValidator::string($data['message'] ?? '', 0, 1000);

            $negotiation = $this->negotiationService->createOffer([
                'product_id' => $productId,
                'buyer_id' => (int) $userId,
                'offer' => $offer,
                'message' => $message !== '' ? $message : null,
            ]);

            return JsonResponse::make([
                'message' => 'Negotiation offer created successfully.',
                'negotiation' => $negotiation,
            ], 201);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        } catch (\InvalidArgumentException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        }
    }

    /**
     * Accept a negotiation offer.
     */
    public function acceptOffer(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $negotiationId = (int) $args['id'];

        try {
            $negotiation = $this->negotiationService->acceptOffer($negotiationId, (int) $userId);

            return JsonResponse::make([
                'message' => 'Offer accepted successfully.',
                'negotiation' => $negotiation,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        }
    }

    /**
     * Reject a negotiation offer.
     */
    public function rejectOffer(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $negotiationId = (int) $args['id'];
        $data = (array) $request->getParsedBody();

        try {
            $message = InputValidator::string($data['message'] ?? '', 0, 1000);

            $negotiation = $this->negotiationService->rejectOffer(
                $negotiationId,
                (int) $userId,
                $message !== '' ? $message : null
            );

            return JsonResponse::make([
                'message' => 'Offer rejected successfully.',
                'negotiation' => $negotiation,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        } catch (\InvalidArgumentException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        }
    }

    /**
     * Counter a negotiation offer.
     */
    public function counterOffer(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $negotiationId = (int) $args['id'];
        $data = (array) $request->getParsedBody();

        try {
            $counterOffer = InputValidator::float($data['counter_offer'] ?? 0, 0.01, 999999.99);
            $message = InputValidator::string($data['message'] ?? '', 0, 1000);

            $negotiation = $this->negotiationService->counterOffer(
                $negotiationId,
                (int) $userId,
                $counterOffer,
                $message !== '' ? $message : null
            );

            return JsonResponse::make([
                'message' => 'Counter offer sent successfully.',
                'negotiation' => $negotiation,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        } catch (\InvalidArgumentException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        }
    }

    /**
     * Get negotiations for the authenticated user (as buyer).
     */
    public function getBuyerNegotiations(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $queryParams = $request->getQueryParams();
        $status = $queryParams['status'] ?? null;

        try {
            $negotiations = $this->negotiationService->getBuyerNegotiations((int) $userId, $status);

            return JsonResponse::make([
                'negotiations' => $negotiations,
                'count' => count($negotiations),
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Get negotiations for the authenticated user (as seller).
     */
    public function getSellerNegotiations(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $queryParams = $request->getQueryParams();
        $status = $queryParams['status'] ?? null;

        try {
            $negotiations = $this->negotiationService->getSellerNegotiations((int) $userId, $status);

            return JsonResponse::make([
                'negotiations' => $negotiations,
                'count' => count($negotiations),
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a single negotiation by ID.
     */
    public function getNegotiation(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $negotiationId = (int) $args['id'];

        try {
            $negotiation = $this->negotiationService->getNegotiation($negotiationId, (int) $userId);

            return JsonResponse::make([
                'negotiation' => $negotiation,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 404);
        }
    }
}
