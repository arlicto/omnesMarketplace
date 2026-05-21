<?php

declare(strict_types=1);

namespace App\Events;

use App\Events\Event;

/**
 * Event dispatcher for real-time-ready architecture.
 * Allows decoupling event emission from handling, making WebSocket integration easy.
 */
final class EventDispatcher
{
    /** @var array<string, list<callable>> */
    private array $listeners = [];

    /** @var array<string, list<callable>> */
    private array $onceListeners = [];

    /**
     * Register an event listener.
     * 
     * @param string $event Event name
     * @param callable $listener Callback function
     */
    public function on(string $event, callable $listener): void
    {
        if (!isset($this->listeners[$event])) {
            $this->listeners[$event] = [];
        }
        $this->listeners[$event][] = $listener;
    }

    /**
     * Register a one-time event listener.
     * 
     * @param string $event Event name
     * @param callable $listener Callback function
     */
    public function once(string $event, callable $listener): void
    {
        if (!isset($this->onceListeners[$event])) {
            $this->onceListeners[$event] = [];
        }
        $this->onceListeners[$event][] = $listener;
    }

    /**
     * Emit an event to all registered listeners.
     * 
     * @param Event $event Event object
     */
    public function emit(Event $event): void
    {
        $eventName = $event->getName();
        $data = $event->getData();

        // Call regular listeners
        foreach ($this->listeners[$eventName] ?? [] as $listener) {
            $listener($event, $data);
        }

        // Call one-time listeners
        foreach ($this->onceListeners[$eventName] ?? [] as $listener) {
            $listener($event, $data);
        }
        
        // Clear one-time listeners after execution
        unset($this->onceListeners[$eventName]);
    }

    /**
     * Remove all listeners for an event.
     */
    public function off(string $event): void
    {
        unset($this->listeners[$event]);
        unset($this->onceListeners[$event]);
    }

    /**
     * Get count of listeners for an event.
     */
    public function listenerCount(string $event): int
    {
        return count($this->listeners[$event] ?? []) + count($this->onceListeners[$event] ?? []);
    }
}
