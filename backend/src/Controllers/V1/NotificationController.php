<?php

declare(strict_types=1);

namespace App\Controllers\V1;

use App\Services\NotificationService;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

/**
 * Controller for user notifications.
 * Handles notification retrieval, marking as read, and deletion.
 */
final class NotificationController
{
    public function __construct(private NotificationService $notificationService)
    {
    }

    /**
     * Get notifications for the authenticated user.
     */
    public function getNotifications(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $queryParams = $request->getQueryParams();
        $limit = isset($queryParams['limit']) ? (int) $queryParams['limit'] : 20;
        $offset = isset($queryParams['offset']) ? (int) $queryParams['offset'] : 0;
        $unreadOnly = isset($queryParams['unread_only']) ? filter_var($queryParams['unread_only'], FILTER_VALIDATE_BOOLEAN) : null;

        try {
            $notifications = $this->notificationService->getUserNotifications(
                (int) $userId,
                $limit > 0 ? $limit : 20,
                $offset >= 0 ? $offset : 0,
                $unreadOnly
            );

            $unreadCount = $this->notificationService->getUnreadCount((int) $userId);

            return JsonResponse::make([
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
                'count' => count($notifications),
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Get unread notification count.
     */
    public function getUnreadCount(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        try {
            $count = $this->notificationService->getUnreadCount((int) $userId);

            return JsonResponse::make([
                'unread_count' => $count,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $notificationId = (int) $args['id'];

        try {
            $notification = $this->notificationService->markAsRead($notificationId, (int) $userId);

            return JsonResponse::make([
                'message' => 'Notification marked as read.',
                'notification' => $notification,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        }
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        try {
            $count = $this->notificationService->markAllAsRead((int) $userId);

            return JsonResponse::make([
                'message' => 'All notifications marked as read.',
                'count' => $count,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a notification.
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $notificationId = (int) $args['id'];

        try {
            $deleted = $this->notificationService->delete($notificationId, (int) $userId);

            return JsonResponse::make([
                'message' => 'Notification deleted successfully.',
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        }
    }
}
