<?php

declare(strict_types=1);

namespace App\Controllers\V1;

use App\Config\Config;
use App\Config\Security\SecurityMonitor;
use App\Config\UploadValidator;
use App\Config\Validation\InputValidator;
use App\Support\JsonResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use RuntimeException;

/**
 * Secure file upload controller with strict MIME validation and security checks.
 */
final class UploadController
{
    private string $uploadDir;

    public function __construct()
    {
        $this->uploadDir = dirname(__DIR__, 3) . '/storage/uploads';
    }

    /**
     * Handle file upload with comprehensive security validation.
     */
    public function upload(Request $request, Response $response): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $uploadedFiles = $request->getUploadedFiles();
        $file = $uploadedFiles['file'] ?? null;

        if ($file === null) {
            return JsonResponse::error('No file uploaded.', 400);
        }

        if ($file->getError() !== UPLOAD_ERR_OK) {
            SecurityMonitor::logFileUpload((int) $userId, 'unknown', 'unknown', 0, false, $this->getClientIp($request));
            return JsonResponse::error('File upload failed.', 400);
        }

        try {
            $uploadSettings = Config::get()->upload();
            
            // Validate file using UploadValidator
            UploadValidator::assertAllowed($file->getClientMediaType(), $file->getSize());

            // Additional validation using InputValidator
            $validatedFile = InputValidator::fileUpload(
                [
                    'tmp_name' => $file->getStream()->getMetadata('uri'),
                    'name' => $file->getClientFilename(),
                    'size' => $file->getSize(),
                    'type' => $file->getClientMediaType(),
                    'error' => $file->getError()
                ],
                $uploadSettings->allowedMimeTypes,
                $uploadSettings->maxSizeBytes
            );

            // Generate secure filename
            $extension = $validatedFile['extension'];
            $filename = $this->generateSecureFilename((int) $userId, $extension);
            $targetPath = $this->uploadDir . '/' . $filename;

            // Ensure upload directory exists with proper permissions
            if (!is_dir($this->uploadDir)) {
                mkdir($this->uploadDir, 0750, true);
            }

            // Move file to secure location
            $file->moveTo($targetPath);

            // Set secure permissions on uploaded file
            chmod($targetPath, 0640);

            // Log successful upload
            SecurityMonitor::logFileUpload(
                (int) $userId,
                $filename,
                $validatedFile['type'],
                $validatedFile['size'],
                true,
                $this->getClientIp($request)
            );

            return JsonResponse::make([
                'message' => 'File uploaded successfully.',
                'filename' => $filename,
                'size' => $validatedFile['size'],
                'type' => $validatedFile['type']
            ]);

        } catch (RuntimeException $e) {
            SecurityMonitor::logFileUpload((int) $userId, $file->getClientFilename() ?? 'unknown', $file->getClientMediaType() ?? 'unknown', $file->getSize(), false, $this->getClientIp($request));
            return JsonResponse::error($e->getMessage(), 400);
        } catch (\InvalidArgumentException $e) {
            SecurityMonitor::logFileUpload((int) $userId, $file->getClientFilename() ?? 'unknown', $file->getClientMediaType() ?? 'unknown', $file->getSize(), false, $this->getClientIp($request));
            return JsonResponse::error($e->getMessage(), 400);
        }
    }

    /**
     * Generate a secure filename to prevent directory traversal and name collisions.
     */
    private function generateSecureFilename(int $userId, string $extension): string
    {
        $random = bin2hex(random_bytes(16));
        $timestamp = time();
        return sprintf('%d_%d_%s.%s', $userId, $timestamp, $random, $extension);
    }

    /**
     * Get client IP address.
     */
    private function getClientIp(Request $request): string
    {
        $params = $request->getServerParams();
        return (string) ($params['REMOTE_ADDR'] ?? '0.0.0.0');
    }
}
