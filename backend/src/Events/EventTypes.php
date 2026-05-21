<?php

declare(strict_types=1);

namespace App\Events;

/**
 * Event type constants for type safety and consistency.
 */
final class EventTypes
{
    // Negotiation events
    public const NEGOTIATION_CREATED = 'negotiation.created';
    public const NEGOTIATION_UPDATED = 'negotiation.updated';
    public const NEGOTIATION_ACCEPTED = 'negotiation.accepted';
    public const NEGOTIATION_REJECTED = 'negotiation.rejected';
    public const NEGOTIATION_COUNTERED = 'negotiation.countered';
    public const NEGOTIATION_EXPIRED = 'negotiation.expired';

    // Notification events
    public const NOTIFICATION_CREATED = 'notification.created';
    public const NOTIFICATION_READ = 'notification.read';
    public const NOTIFICATION_DELETED = 'notification.deleted';

    // Product events
    public const PRODUCT_CREATED = 'product.created';
    public const PRODUCT_UPDATED = 'product.updated';
    public const PRODUCT_DELETED = 'product.deleted';
    public const PRODUCT_SOLD = 'product.sold';

    // User events
    public const USER_REGISTERED = 'user.registered';
    public const USER_LOGGED_IN = 'user.logged_in';
    public const USER_LOGGED_OUT = 'user.logged_out';

    // Message events (for future chat system)
    public const MESSAGE_SENT = 'message.sent';
    public const MESSAGE_RECEIVED = 'message.received';
}
