<?php

declare(strict_types=1);

namespace App\Controllers\V1;

use App\Config\Security\SecurityMonitor;
use App\Services\ImageProcessor;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

/**
 * Secure image upload controller for product images.
 * Handles image validation, processing, and storage.
 */
final class ImageUploadController
{
    private ImageProcessor $imageProcessor;

    public function __construct(ImageProcessor $imageProcessor)
    {
        $this->imageProcessor = $imageProcessor;
    }

    /**
     * Handle product image upload with comprehensive security validation.
     */
    public function upload(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $uploadedFiles = $request->getUploadedFiles();
        $file = $uploadedFiles['image'] ?? null;

        if ($file === null) {
            return JsonResponse::error('No image uploaded.', 400);
        }

        if ($file->getError() !== UPLOAD_ERR_OK) {
            $this->logUploadFailure((int) $userId, 'upload_error', $this->getClientIp($request));
            return JsonResponse::error('Image upload failed.', 400);
        }

        try {
            // Get temp path
            $tempPath = $file->getStream()->getMetadata('uri');
            $originalName = $file->getClientFilename() ?? 'unknown';

            // Process image (validate, convert to WebP, generate thumbnail, compress)
            $result = $this->imageProcessor->processImage($tempPath, $originalName);

            // Log successful upload
            $this->logUploadSuccess((int) $userId, $originalName, $this->getClientIp($request));

            // Return image URLs (relative paths)
            $webpUrl = '/storage/uploads/images/' . basename($result['webp']);
            $thumbnailUrl = '/storage/uploads/thumbnails/' . basename($result['thumbnail']);

            return JsonResponse::make([
                'message' => 'Image uploaded successfully.',
                'image_url' => $webpUrl,
                'thumbnail_url' => $thumbnailUrl,
                'width' => $result['width'],
                'height' => $result['height'],
                'original_filename' => $result['original']
            ]);

        } catch (RuntimeException $e) {
            $this->logUploadFailure((int) $userId, $file->getClientFilename() ?? 'unknown', $this->getClientIp($request));
            return JsonResponse::error($e->getMessage(), 400);
        }
    }

    /**
     * Handle multiple image uploads.
     */
    public function uploadMultiple(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $uploadedFiles = $request->getUploadedFiles();
        $files = $uploadedFiles['images'] ?? [];

        if (!is_array($files) || empty($files)) {
            return JsonResponse::error('No images uploaded.', 400);
        }

        // Limit to 10 images per request
        if (count($files) > 10) {
            return JsonResponse::error('Maximum 10 images allowed per upload.', 400);
        }

        $results = [];
        $errors = [];

        foreach ($files as $index => $file) {
            if ($file->getError() !== UPLOAD_ERR_OK) {
                $errors[] = [
                    'index' => $index,
                    'filename' => $file->getClientFilename(),
                    'error' => 'Upload failed'
                ];
                continue;
            }

            try {
                $tempPath = $file->getStream()->getMetadata('uri');
                $originalName = $file->getClientFilename() ?? 'unknown';

                $result = $this->imageProcessor->processImage($tempPath, $originalName);

                $webpUrl = '/storage/uploads/images/' . basename($result['webp']);
                $thumbnailUrl = '/storage/uploads/thumbnails/' . basename($result['thumbnail']);

                $results[] = [
                    'index' => $index,
                    'image_url' => $webpUrl,
                    'thumbnail_url' => $thumbnailUrl,
                    'width' => $result['width'],
                    'height' => $result['height'],
                    'original_filename' => $result['original']
                ];

            } catch (RuntimeException $e) {
                $errors[] = [
                    'index' => $index,
                    'filename' => $file->getClientFilename(),
                    'error' => $e->getMessage()
                ];
            }
        }

        $this->logBatchUpload((int) $userId, count($results), count($errors), $this->getClientIp($request));

        return JsonResponse::make([
            'message' => 'Batch upload completed.',
            'successful' => count($results),
            'failed' => count($errors),
            'images' => $results,
            'errors' => $errors
        ]);
    }

    /**
     * Delete uploaded images.
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $filename = $args['filename'] ?? null;
        if ($filename === null) {
            return JsonResponse::error('Filename is required.', 400);
        }

        // Validate filename format (prevent directory traversal)
        if (!preg_match('/^[a-f0-9]{32}\.webp$/', $filename)) {
            return JsonResponse::error('Invalid filename format.', 400);
        }

        $webpPath = dirname(__DIR__, 2) . '/storage/uploads/images/' . $filename;
        $thumbnailPath = dirname(__DIR__, 2) . '/storage/uploads/thumbnails/' . str_replace('.webp', '_thumb.webp', $filename);

        try {
            $this->imageProcessor->deleteImages($webpPath, $thumbnailPath);

            $this->logImageDeletion((int) $userId, $filename, $this->getClientIp($request));

            return JsonResponse::make([
                'message' => 'Image deleted successfully.'
            ]);

        } catch (RuntimeException $e) {
            return JsonResponse::error($e->getMessage(), 400);
        }
    }

    /**
     * Get client IP address.
     */
    private function getClientIp(Request $request): string
    {
        $params = $request->getServerParams();
        
        // Check for forwarded headers (behind proxy)
        $forwarded = $params['HTTP_X_FORWARDED_FOR'] ?? null;
        if ($forwarded) {
            $ips = explode(',', $forwarded);
            return trim($ips[0]);
        }

        return (string) ($params['REMOTE_ADDR'] ?? '0.0.0.0');
    }

    /**
     * Log successful image upload.
     */
    private function logUploadSuccess(int $userId, string $filename, string $ip): void
    {
        SecurityMonitor::logFileUpload(
            $userId,
            $filename,
            'image/webp',
            0,
            true,
            $ip
        );
    }

    /**
     * Log failed image upload.
     */
    private function logUploadFailure(int $userId, string $filename, string $ip): void
    {
        SecurityMonitor::logFileUpload(
            $userId,
            $filename,
            'unknown',
            0,
            false,
            $ip
        );
    }

    /**
     * Log batch upload.
     */
    private function logBatchUpload(int $userId, int $successful, int $failed, string $ip): void
    {
        SecurityMonitor::logFileUpload(
            $userId,
            "batch_upload_{$successful}_success_{$failed}_failed",
            'image/webp',
            0,
            $failed === 0,
            $ip
        );
    }

    /**
     * Log image deletion.
     */
    private function logImageDeletion(int $userId, string $filename, string $ip): void
    {
        SecurityMonitor::logFileUpload(
            $userId,
            "deleted_{$filename}",
            'image/webp',
            0,
            true,
            $ip
        );
    }
}
