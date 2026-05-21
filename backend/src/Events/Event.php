<?php

declare(strict_types=1);

namespace App\Events;

/**
 * Base event class for all application events.
 * Designed to be easily serializable for WebSocket transmission.
 */
final class Event
{
    private string $name;
    private array $data;
    private ?int $userId;
    private string $timestamp;

    public function __construct(string $name, array $data = [], ?int $userId = null)
    {
        $this->name = $name;
        $this->data = $data;
        $this->userId = $userId;
        $this->timestamp = (string) time();
    }

    public function getName(): string
    {
        return $this->name;
    }

    /** @return array<string, mixed> */
    public function getData(): array
    {
        return $this->data;
    }

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function getTimestamp(): string
    {
        return $this->timestamp;
    }

    /**
     * Convert event to array for JSON serialization (WebSocket ready).
     * 
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'data' => $this->data,
            'user_id' => $this->userId,
            'timestamp' => $this->timestamp,
        ];
    }

    /**
     * Create event from array (for WebSocket deserialization).
     */
    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'],
            $data['data'] ?? [],
            $data['user_id'] ?? null
        );
    }
}
