<?php

declare(strict_types=1);

namespace App\Events\Subscribers;

use App\Events\Event;
use App\Events\EventDispatcher;
use App\Events\EventSubscriberInterface;
use App\Events\EventTypes;
use App\Repositories\NotificationRepository;

/**
 * Event subscriber that automatically creates notifications for events.
 * This decouples notification creation from business logic.
 */
final class NotificationSubscriber implements EventSubscriberInterface
{
    public function __construct(private NotificationRepository $notifications)
    {
    }

    public function subscribe(EventDispatcher $dispatcher): void
    {
        // Negotiation events
        $dispatcher->on(EventTypes::NEGOTIATION_CREATED, [$this, 'onNegotiationCreated']);
        $dispatcher->on(EventTypes::NEGOTIATION_ACCEPTED, [$this, 'onNegotiationAccepted']);
        $dispatcher->on(EventTypes::NEGOTIATION_REJECTED, [$this, 'onNegotiationRejected']);
        $dispatcher->on(EventTypes::NEGOTIATION_COUNTERED, [$this, 'onNegotiationCountered']);

        // Product events
        $dispatcher->on(EventTypes::PRODUCT_SOLD, [$this, 'onProductSold']);
    }

    private function onNegotiationCreated(Event $event, array $data): void
    {
        $sellerId = $data['seller_id'] ?? null;
        if ($sellerId === null) {
            return;
        }

        $this->notifications->create([
            'uuid' => $this->generateUuid(),
            'user_id' => $sellerId,
            'type' => 'negotiation_offer',
            'title' => 'New Offer Received',
            'message' => sprintf(
                'You received a new offer of $%.2f on your product.',
                $data['current_offer'] ?? 0
            ),
            'data' => [
                'negotiation_id' => $data['id'] ?? null,
                'product_id' => $data['product_id'] ?? null,
                'buyer_id' => $data['buyer_id'] ?? null,
                'offer_amount' => $data['current_offer'] ?? 0,
            ],
        ]);
    }

    private function onNegotiationAccepted(Event $event, array $data): void
    {
        $buyerId = $data['buyer_id'] ?? null;
        if ($buyerId === null) {
            return;
        }

        $this->notifications->create([
            'uuid' => $this->generateUuid(),
            'user_id' => $buyerId,
            'type' => 'negotiation_accepted',
            'title' => 'Offer Accepted!',
            'message' => sprintf(
                'Your offer of $%.2f was accepted by the seller.',
                $data['current_offer'] ?? 0
            ),
            'data' => [
                'negotiation_id' => $data['id'] ?? null,
                'product_id' => $data['product_id'] ?? null,
                'accepted_amount' => $data['current_offer'] ?? 0,
            ],
        ]);
    }

    private function onNegotiationRejected(Event $event, array $data): void
    {
        $buyerId = $data['buyer_id'] ?? null;
        if ($buyerId === null) {
            return;
        }

        $this->notifications->create([
            'uuid' => $this->generateUuid(),
            'user_id' => $buyerId,
            'type' => 'negotiation_rejected',
            'title' => 'Offer Rejected',
            'message' => sprintf(
                'Your offer of $%.2f was rejected by the seller.',
                $data['current_offer'] ?? 0
            ),
            'data' => [
                'negotiation_id' => $data['id'] ?? null,
                'product_id' => $data['product_id'] ?? null,
                'rejected_amount' => $data['current_offer'] ?? 0,
            ],
        ]);
    }

    private function onNegotiationCountered(Event $event, array $data): void
    {
        $buyerId = $data['buyer_id'] ?? null;
        if ($buyerId === null) {
            return;
        }

        $this->notifications->create([
            'uuid' => $this->generateUuid(),
            'user_id' => $buyerId,
            'type' => 'negotiation_countered',
            'title' => 'Counter Offer Received',
            'message' => sprintf(
                'The seller countered your offer with $%.2f.',
                $data['current_offer'] ?? 0
            ),
            'data' => [
                'negotiation_id' => $data['id'] ?? null,
                'product_id' => $data['product_id'] ?? null,
                'countered_amount' => $data['current_offer'] ?? 0,
            ],
        ]);
    }

    private function onProductSold(Event $event, array $data): void
    {
        $buyerId = $data['buyer_id'] ?? null;
        if ($buyerId === null) {
            return;
        }

        $this->notifications->create([
            'uuid' => $this->generateUuid(),
            'user_id' => $buyerId,
            'type' => 'product_sold',
            'title' => 'Purchase Successful',
            'message' => 'Your purchase has been confirmed. Thank you for your order!',
            'data' => [
                'product_id' => $data['product_id'] ?? null,
                'negotiation_id' => $data['negotiation_id'] ?? null,
            ],
        ]);
    }

    private function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
