<?php

declare(strict_types=1);

namespace App\Services;

use App\Events\Event;
use App\Events\EventDispatcher;
use App\Events\EventTypes;
use App\Repositories\NotificationRepository;
use RuntimeException;

/**
 * Business logic for notifications.
 * Handles notification creation, reading, and management.
 */
final class NotificationService
{
    public function __construct(
        private NotificationRepository $notifications,
        private EventDispatcher $dispatcher
    ) {
    }

    /**
     * Create a notification for a user.
     * 
     * @param array{user_id: int, type: string, title: string, message: string, data?: array, expires_at?: string} $data
     * @return array<string, mixed>
     */
    public function create(array $data): array
    {
        $uuid = $this->generateUuid();

        $notificationId = $this->notifications->create([
            'uuid' => $uuid,
            'user_id' => $data['user_id'],
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'data' => $data['data'] ?? null,
            'expires_at' => $data['expires_at'] ?? null,
        ]);

        $notification = $this->notifications->findById($notificationId);
        if ($notification === null) {
            throw new RuntimeException('Failed to create notification.');
        }

        // Emit event for real-time updates
        $this->dispatcher->emit(new Event(EventTypes::NOTIFICATION_CREATED, [
            'id' => $notificationId,
            'uuid' => $uuid,
            'user_id' => $data['user_id'],
            'type' => $data['type'],
        ], $data['user_id']));

        return $notification;
    }

    /**
     * Get notifications for a user.
     * 
     * @param int $userId
     * @param int|null $limit
     * @param int|null $offset
     * @param bool|null $unreadOnly
     * @return list<array<string, mixed>>
     */
    public function getUserNotifications(int $userId, ?int $limit = null, ?int $offset = null, ?bool $unreadOnly = null): array
    {
        return $this->notifications->findByUser($userId, $limit, $offset, $unreadOnly);
    }

    /**
     * Get unread notification count for a user.
     * 
     * @param int $userId
     * @return int
     */
    public function getUnreadCount(int $userId): int
    {
        return $this->notifications->getUnreadCount($userId);
    }

    /**
     * Mark a notification as read.
     * 
     * @param int $notificationId
     * @param int $userId
     * @return array<string, mixed>
     */
    public function markAsRead(int $notificationId, int $userId): array
    {
        $notification = $this->notifications->findById($notificationId);
        if ($notification === null) {
            throw new RuntimeException('Notification not found.');
        }

        // Verify ownership
        if ((int) $notification['user_id'] !== $userId) {
            throw new RuntimeException('You are not authorized to mark this notification as read.');
        }

        $updated = $this->notifications->markAsRead($notificationId, $userId);
        if (!$updated) {
            throw new RuntimeException('Failed to mark notification as read.');
        }

        // Get updated notification
        $notification = $this->notifications->findById($notificationId);

        // Emit event for real-time updates
        $this->dispatcher->emit(new Event(EventTypes::NOTIFICATION_READ, [
            'id' => $notificationId,
            'uuid' => $notification['uuid'],
            'user_id' => $userId,
        ], $userId));

        return $notification;
    }

    /**
     * Mark all notifications as read for a user.
     * 
     * @param int $userId
     * @return int Number of notifications marked as read
     */
    public function markAllAsRead(int $userId): int
    {
        $count = $this->notifications->markAllAsRead($userId);

        // Emit event for real-time updates
        $this->dispatcher->emit(new Event(EventTypes::NOTIFICATION_READ, [
            'user_id' => $userId,
            'count' => $count,
        ], $userId));

        return $count;
    }

    /**
     * Delete a notification.
     * 
     * @param int $notificationId
     * @param int $userId
     * @return bool
     */
    public function delete(int $notificationId, int $userId): bool
    {
        $notification = $this->notifications->findById($notificationId);
        if ($notification === null) {
            throw new RuntimeException('Notification not found.');
        }

        // Verify ownership
        if ((int) $notification['user_id'] !== $userId) {
            throw new RuntimeException('You are not authorized to delete this notification.');
        }

        $deleted = $this->notifications->delete($notificationId, $userId);

        // Emit event for real-time updates
        if ($deleted) {
            $this->dispatcher->emit(new Event(EventTypes::NOTIFICATION_DELETED, [
                'id' => $notificationId,
                'uuid' => $notification['uuid'],
                'user_id' => $userId,
            ], $userId));
        }

        return $deleted;
    }

    /**
     * Clean up expired notifications.
     * 
     * @return int Number of notifications deleted
     */
    public function cleanupExpired(): int
    {
        return $this->notifications->deleteExpired();
    }

    private function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
