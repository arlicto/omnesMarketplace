<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\Event;
use App\Events\EventDispatcher;
use App\Events\EventTypes;
use App\Repositories\NegotiationRepository;
use App\Repositories\ProductRepository;
use App\Repositories\UserRepository;
use RuntimeException;

/**
 * Business logic for buyer-seller negotiations.
 * Emits events for real-time updates via WebSocket integration.
 */
final class NegotiationService
{
    public function __construct(
        private NegotiationRepository $negotiations,
        private ProductRepository $products,
        private UserRepository $users,
        private EventDispatcher $dispatcher
    ) {
    }

    /**
     * Create a new negotiation offer.
     * 
     * @param array{product_id: int, buyer_id: int, offer: float, message?: string} $data
     * @return array<string, mixed>
     */
    public function createOffer(array $data): array
    {
        // Validate product exists and is active
        $product = $this->products->findById($data['product_id']);
        if ($product === null) {
            throw new RuntimeException('Product not found.');
        }

        if ($product['status'] !== 'active') {
            throw new RuntimeException('Product is not available for negotiation.');
        }

        // Buyer cannot negotiate on their own product
        if ((int) $product['seller_id'] === (int) $data['buyer_id']) {
            throw new RuntimeException('Cannot negotiate on your own product.');
        }

        // Check for existing active negotiation
        if ($this->negotiations->hasActiveNegotiation($data['product_id'], $data['buyer_id'])) {
            throw new RuntimeException('You already have an active negotiation for this product.');
        }

        // Validate offer amount
        if ($data['offer'] <= 0) {
            throw new RuntimeException('Offer amount must be greater than 0.');
        }

        // Generate UUID
        $uuid = $this->generateUuid();

        // Calculate expiration (7 days from now)
        $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));

        // Create negotiation
        $negotiationId = $this->negotiations->create([
            'uuid' => $uuid,
            'product_id' => $data['product_id'],
            'buyer_id' => $data['buyer_id'],
            'seller_id' => $product['seller_id'],
            'status' => 'pending',
            'initial_offer' => $data['offer'],
            'current_offer' => $data['offer'],
            'buyer_message' => $data['message'] ?? null,
            'expires_at' => $expiresAt,
        ]);

        // Get full negotiation data
        $negotiation = $this->negotiations->findById($negotiationId);
        if ($negotiation === null) {
            throw new RuntimeException('Failed to create negotiation.');
        }

        // Emit event for real-time updates
        $this->dispatcher->emit(new Event(EventTypes::NEGOTIATION_CREATED, [
            'id' => $negotiationId,
            'uuid' => $uuid,
            'product_id' => $data['product_id'],
            'buyer_id' => $data['buyer_id'],
            'seller_id' => $product['seller_id'],
            'current_offer' => $data['offer'],
        ], $product['seller_id']));

        return $negotiation;
    }

    /**
     * Accept a negotiation offer.
     * 
     * @param int $negotiationId
     * @param int $sellerId
     * @return array<string, mixed>
     */
    public function acceptOffer(int $negotiationId, int $sellerId): array
    {
        $negotiation = $this->negotiations->findById($negotiationId);
        if ($negotiation === null) {
            throw new RuntimeException('Negotiation not found.');
        }

        // Verify seller ownership
        if ((int) $negotiation['seller_id'] !== $sellerId) {
            throw new RuntimeException('You are not authorized to accept this offer.');
        }

        // Check status
        if ($negotiation['status'] !== 'pending' && $negotiation['status'] !== 'countered') {
            throw new RuntimeException('This offer cannot be accepted.');
        }

        // Update negotiation status
        $updated = $this->negotiations->updateStatus($negotiationId, 'accepted');
        if (!$updated) {
            throw new RuntimeException('Failed to accept offer.');
        }

        // Get updated negotiation
        $negotiation = $this->negotiations->findById($negotiationId);

        // Emit event for real-time updates
        $this->dispatcher->emit(new Event(EventTypes::NEGOTIATION_ACCEPTED, [
            'id' => $negotiationId,
            'uuid' => $negotiation['uuid'],
            'product_id' => $negotiation['product_id'],
            'buyer_id' => $negotiation['buyer_id'],
            'seller_id' => $negotiation['seller_id'],
            'current_offer' => $negotiation['current_offer'],
        ], $negotiation['buyer_id']));

        return $negotiation;
    }

    /**
     * Reject a negotiation offer.
     * 
     * @param int $negotiationId
     * @param int $sellerId
     * @param string|null $message
     * @return array<string, mixed>
     */
    public function rejectOffer(int $negotiationId, int $sellerId, ?string $message = null): array
    {
        $negotiation = $this->negotiations->findById($negotiationId);
        if ($negotiation === null) {
            throw new RuntimeException('Negotiation not found.');
        }

        // Verify seller ownership
        if ((int) $negotiation['seller_id'] !== $sellerId) {
            throw new RuntimeException('You are not authorized to reject this offer.');
        }

        // Check status
        if (!in_array($negotiation['status'], ['pending', 'countered'], true)) {
            throw new RuntimeException('This offer cannot be rejected.');
        }

        // Update negotiation status
        $updated = $this->negotiations->updateStatus($negotiationId, 'rejected', null, $message);
        if (!$updated) {
            throw new RuntimeException('Failed to reject offer.');
        }

        // Get updated negotiation
        $negotiation = $this->negotiations->findById($negotiationId);

        // Emit event for real-time updates
        $this->dispatcher->emit(new Event(EventTypes::NEGOTIATION_REJECTED, [
            'id' => $negotiationId,
            'uuid' => $negotiation['uuid'],
            'product_id' => $negotiation['product_id'],
            'buyer_id' => $negotiation['buyer_id'],
            'seller_id' => $negotiation['seller_id'],
            'current_offer' => $negotiation['current_offer'],
        ], $negotiation['buyer_id']));

        return $negotiation;
    }

    /**
     * Counter a negotiation offer.
     * 
     * @param int $negotiationId
     * @param int $sellerId
     * @param float $counterOffer
     * @param string|null $message
     * @return array<string, mixed>
     */
    public function counterOffer(int $negotiationId, int $sellerId, float $counterOffer, ?string $message = null): array
    {
        $negotiation = $this->negotiations->findById($negotiationId);
        if ($negotiation === null) {
            throw new RuntimeException('Negotiation not found.');
        }

        // Verify seller ownership
        if ((int) $negotiation['seller_id'] !== $sellerId) {
            throw new RuntimeException('You are not authorized to counter this offer.');
        }

        // Check status
        if (!in_array($negotiation['status'], ['pending', 'countered'], true)) {
            throw new RuntimeException('This offer cannot be countered.');
        }

        // Validate counter offer
        if ($counterOffer <= 0) {
            throw new RuntimeException('Counter offer must be greater than 0.');
        }

        // Update negotiation
        $updated = $this->negotiations->updateStatus($negotiationId, 'countered', $counterOffer, $message);
        if (!$updated) {
            throw new RuntimeException('Failed to counter offer.');
        }

        // Get updated negotiation
        $negotiation = $this->negotiations->findById($negotiationId);

        // Emit event for real-time updates
        $this->dispatcher->emit(new Event(EventTypes::NEGOTIATION_COUNTERED, [
            'id' => $negotiationId,
            'uuid' => $negotiation['uuid'],
            'product_id' => $negotiation['product_id'],
            'buyer_id' => $negotiation['buyer_id'],
            'seller_id' => $negotiation['seller_id'],
            'current_offer' => $counterOffer,
        ], $negotiation['buyer_id']));

        return $negotiation;
    }

    /**
     * Get negotiations for a buyer.
     * 
     * @param int $buyerId
     * @param string|null $status
     * @return list<array<string, mixed>>
     */
    public function getBuyerNegotiations(int $buyerId, ?string $status = null): array
    {
        return $this->negotiations->findByBuyer($buyerId, $status);
    }

    /**
     * Get negotiations for a seller.
     * 
     * @param int $sellerId
     * @param string|null $status
     * @return list<array<string, mixed>>
     */
    public function getSellerNegotiations(int $sellerId, ?string $status = null): array
    {
        return $this->negotiations->findBySeller($sellerId, $status);
    }

    /**
     * Get a single negotiation by ID.
     * 
     * @param int $negotiationId
     * @param int $userId
     * @return array<string, mixed>
     */
    public function getNegotiation(int $negotiationId, int $userId): array
    {
        $negotiation = $this->negotiations->findById($negotiationId);
        if ($negotiation === null) {
            throw new RuntimeException('Negotiation not found.');
        }

        // Verify user is participant
        if ((int) $negotiation['buyer_id'] !== $userId && (int) $negotiation['seller_id'] !== $userId) {
            throw new RuntimeException('You are not authorized to view this negotiation.');
        }

        return $negotiation;
    }

    /**
     * Mark expired negotiations.
     * 
     * @return int Number of negotiations marked as expired
     */
    public function markExpiredNegotiations(): int
    {
        $expired = $this->negotiations->markExpired();

        // Emit events for each expired negotiation (simplified)
        if ($expired > 0) {
            $this->dispatcher->emit(new Event(EventTypes::NEGOTIATION_EXPIRED, [
                'count' => $expired,
            ]));
        }

        return $expired;
    }

    private function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
