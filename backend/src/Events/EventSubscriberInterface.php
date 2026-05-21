<?php

declare(strict_types=1);

namespace App\Events;

use App\Events\EventDispatcher;

/**
 * Interface for event subscribers.
 * Implement this to create modular event handling logic.
 */
interface EventSubscriberInterface
{
    /**
     * Register event listeners with the dispatcher.
     */
    public function subscribe(EventDispatcher $dispatcher): void;
}
