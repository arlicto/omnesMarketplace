<?php

declare(strict_types=1);

namespace App\Controllers\V1\Admin;

use App\Config\Security\AuditLogger;
use App\Config\Validation\InputValidator;
use App\Repositories\UserRepository;
use App\Support\JsonResponse;
use App\Support\Pagination;
use App\Support\SearchFilter;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

/**
 * Admin controller for user management.
 */
final class AdminUserController
{
    public function __construct(
        private UserRepository $users,
        private AuditLogger $auditLogger
    ) {
    }

    /**
     * Get all users with pagination and filters.
     */
    public function getAll(Request $request, Response $response): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $queryParams = $request->getQueryParams();
        $pagination = Pagination::fromQuery($queryParams);
        $searchFilter = SearchFilter::fromQuery($queryParams, ['id', 'username', 'email', 'created_at']);

        try {
            $users = $this->users->findAll(
                $pagination->getLimit(),
                $pagination->getOffset(),
                $searchFilter->getSearch(),
                $searchFilter->getFilter('role'),
                $searchFilter->getFilter('status')
            );

            $total = $this->users->count(
                $searchFilter->getSearch(),
                $searchFilter->getFilter('role'),
                $searchFilter->getFilter('status')
            );

            $pagination = Pagination::withTotal(
                $pagination->getPage(),
                $pagination->getPerPage(),
                $total
            );

            return JsonResponse::make([
                'users' => $users,
                'pagination' => $pagination->toArray(),
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a single user by ID.
     */
    public function getOne(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $userId = (int) $args['id'];

        try {
            $user = $this->users->findById($userId);
            if ($user === null) {
                return JsonResponse::error('User not found.', 404);
            }

            return JsonResponse::make([
                'user' => $user,
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Update user role.
     */
    public function updateRole(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $userId = (int) $args['id'];
        $data = (array) $request->getParsedBody();

        try {
            $role = InputValidator::enum($data['role'] ?? '', ['buyer', 'seller', 'admin', 'super_admin']);

            $user = $this->users->findById($userId);
            if ($user === null) {
                return JsonResponse::error('User not found.', 404);
            }

            $oldRole = $user['role'];
            $updated = $this->users->updateRole($userId, $role);

            if (!$updated) {
                return JsonResponse::error('Failed to update user role.', 500);
            }

            // Log audit
            $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
            $userAgent = $request->getHeaderLine('User-Agent');
            $this->auditLogger->logUserAction(
                (int) $admin['id'],
                'role_updated',
                $userId,
                ['role' => $oldRole],
                ['role' => $role],
                $ip,
                $userAgent
            );

            return JsonResponse::make([
                'message' => 'User role updated successfully.',
            ]);

        } catch (\InvalidArgumentException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Ban user.
     */
    public function banUser(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $userId = (int) $args['id'];
        $data = (array) $request->getParsedBody();

        try {
            $reason = InputValidator::string($data['reason'] ?? '', 1, 500);
            $durationDays = isset($data['duration_days']) ? InputValidator::int($data['duration_days'], 1, 365) : null;

            $user = $this->users->findById($userId);
            if ($user === null) {
                return JsonResponse::error('User not found.', 404);
            }

            if ((int) $user['id'] === (int) $admin['id']) {
                return JsonResponse::error('Cannot ban yourself.', 400);
            }

            $updated = $this->users->banUser($userId, $reason, $durationDays);

            if (!$updated) {
                return JsonResponse::error('Failed to ban user.', 500);
            }

            // Log audit
            $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
            $userAgent = $request->getHeaderLine('User-Agent');
            $this->auditLogger->logUserAction(
                (int) $admin['id'],
                'user_banned',
                $userId,
                ['status' => $user['status']],
                ['status' => 'banned', 'reason' => $reason, 'duration_days' => $durationDays],
                $ip,
                $userAgent
            );

            return JsonResponse::make([
                'message' => 'User banned successfully.',
            ]);

        } catch (\InvalidArgumentException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Unban user.
     */
    public function unbanUser(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $userId = (int) $args['id'];

        try {
            $user = $this->users->findById($userId);
            if ($user === null) {
                return JsonResponse::error('User not found.', 404);
            }

            $updated = $this->users->unbanUser($userId);

            if (!$updated) {
                return JsonResponse::error('Failed to unban user.', 500);
            }

            // Log audit
            $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
            $userAgent = $request->getHeaderLine('User-Agent');
            $this->auditLogger->logUserAction(
                (int) $admin['id'],
                'user_unbanned',
                $userId,
                ['status' => $user['status']],
                ['status' => 'active'],
                $ip,
                $userAgent
            );

            return JsonResponse::make([
                'message' => 'User unbanned successfully.',
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete user.
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        $admin = $request->getAttribute('user');
        if ($admin === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $userId = (int) $args['id'];

        try {
            $user = $this->users->findById($userId);
            if ($user === null) {
                return JsonResponse::error('User not found.', 404);
            }

            if ((int) $user['id'] === (int) $admin['id']) {
                return JsonResponse::error('Cannot delete yourself.', 400);
            }

            $deleted = $this->users->delete($userId);

            if (!$deleted) {
                return JsonResponse::error('Failed to delete user.', 500);
            }

            // Log audit
            $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';
            $userAgent = $request->getHeaderLine('User-Agent');
            $this->auditLogger->logUserAction(
                (int) $admin['id'],
                'user_deleted',
                $userId,
                ['username' => $user['username'], 'email' => $user['email']],
                null,
                $ip,
                $userAgent
            );

            return JsonResponse::make([
                'message' => 'User deleted successfully.',
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 500);
        }
    }
}
