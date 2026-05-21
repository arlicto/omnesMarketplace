<?php

declare(strict_types=1);

namespace App\Services;

use RuntimeException;

/**
 * Image processing service for secure image uploads.
 * Handles WebP conversion, thumbnail generation, and compression.
 */
final class ImageProcessor
{
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ];

    private const BLOCKED_EXTENSIONS = [
        'php', 'exe', 'js', 'sh', 'phtml', 'php5', 'php7', 'phps'
    ];

    private const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private const THUMBNAIL_WIDTH = 300;
    private const THUMBNAIL_HEIGHT = 300;
    private const WEBP_QUALITY = 80;

    /**
     * Process uploaded image: validate, convert to WebP, generate thumbnail, compress.
     * 
     * @return array{original: string, webp: string, thumbnail: string, width: int, height: int}
     */
    public function processImage(string $tempPath, string $originalName): array
    {
        // Validate file
        $this->validateFile($tempPath, $originalName);

        // Get image info
        $imageInfo = $this->getImageInfo($tempPath);
        
        // Generate secure filenames
        $baseFilename = $this->generateSecureFilename();
        
        // Convert to WebP
        $webpPath = $this->convertToWebP($tempPath, $baseFilename);
        
        // Generate thumbnail
        $thumbnailPath = $this->generateThumbnail($webpPath, $baseFilename);
        
        // Get dimensions
        $dimensions = $this->getImageDimensions($webpPath);

        return [
            'original' => $originalName,
            'webp' => $webpPath,
            'thumbnail' => $thumbnailPath,
            'width' => $dimensions['width'],
            'height' => $dimensions['height']
        ];
    }

    /**
     * Validate uploaded file for security.
     */
    private function validateFile(string $tempPath, string $originalName): void
    {
        // Check file exists
        if (!file_exists($tempPath)) {
            throw new RuntimeException('File does not exist.');
        }

        // Check file size
        $fileSize = filesize($tempPath);
        if ($fileSize === false) {
            throw new RuntimeException('Unable to determine file size.');
        }

        if ($fileSize > self::MAX_FILE_SIZE) {
            throw new RuntimeException('File exceeds maximum size of 10MB.');
        }

        // Validate MIME type using finfo
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($tempPath);

        if (!in_array($mimeType, self::ALLOWED_MIME_TYPES, true)) {
            throw new RuntimeException('File type is not allowed. Only JPG, PNG, and WebP are allowed.');
        }

        // Validate extension
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        
        if (in_array($extension, self::BLOCKED_EXTENSIONS, true)) {
            throw new RuntimeException('File extension is not allowed.');
        }

        // Verify extension matches MIME type
        $expectedExtensions = $this->mimeToExtensions($mimeType);
        if (!in_array($extension, $expectedExtensions, true)) {
            throw new RuntimeException('File extension does not match file type.');
        }

        // Verify it's actually an image by trying to load it
        if (!$this->isValidImage($tempPath)) {
            throw new RuntimeException('File is not a valid image.');
        }
    }

    /**
     * Get image information.
     * 
     * @return array{mime_type: string, extension: string}
     */
    private function getImageInfo(string $tempPath): array
    {
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($tempPath);
        
        $extension = $this->mimeToExtension($mimeType);

        return [
            'mime_type' => $mimeType,
            'extension' => $extension
        ];
    }

    /**
     * Convert image to WebP format.
     */
    private function convertToWebP(string $tempPath, string $baseFilename): string
    {
        $uploadDir = dirname(__DIR__, 2) . '/storage/uploads/images';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0750, true);
        }

        $webpPath = $uploadDir . '/' . $baseFilename . '.webp';

        // Load image based on type
        $image = $this->loadImage($tempPath);
        if ($image === false) {
            throw new RuntimeException('Failed to load image.');
        }

        // Convert to WebP
        if (!imagewebp($image, $webpPath, self::WEBP_QUALITY)) {
            imagedestroy($image);
            throw new RuntimeException('Failed to convert image to WebP.');
        }

        imagedestroy($image);

        // Set secure permissions
        chmod($webpPath, 0640);

        return $webpPath;
    }

    /**
     * Generate thumbnail from WebP image.
     */
    private function generateThumbnail(string $webpPath, string $baseFilename): string
    {
        $thumbnailDir = dirname(__DIR__, 2) . '/storage/uploads/thumbnails';
        if (!is_dir($thumbnailDir)) {
            mkdir($thumbnailDir, 0750, true);
        }

        $thumbnailPath = $thumbnailDir . '/' . $baseFilename . '_thumb.webp';

        // Load WebP image
        $image = imagecreatefromwebp($webpPath);
        if ($image === false) {
            throw new RuntimeException('Failed to load WebP image for thumbnail generation.');
        }

        // Get original dimensions
        $width = imagesx($image);
        $height = imagesy($image);

        // Calculate thumbnail dimensions maintaining aspect ratio
        $thumbnailWidth = self::THUMBNAIL_WIDTH;
        $thumbnailHeight = self::THUMBNAIL_HEIGHT;

        if ($width > $height) {
            $thumbnailHeight = (int) ($height * (self::THUMBNAIL_WIDTH / $width));
        } else {
            $thumbnailWidth = (int) ($width * (self::THUMBNAIL_HEIGHT / $height));
        }

        // Create thumbnail
        $thumbnail = imagecreatetruecolor($thumbnailWidth, $thumbnailHeight);
        if ($thumbnail === false) {
            imagedestroy($image);
            throw new RuntimeException('Failed to create thumbnail canvas.');
        }

        // Enable alpha blending and save alpha
        imagealphablending($thumbnail, false);
        imagesavealpha($thumbnail, true);

        // Resize image
        if (!imagecopyresampled($thumbnail, $image, 0, 0, 0, 0, $thumbnailWidth, $thumbnailHeight, $width, $height)) {
            imagedestroy($image);
            imagedestroy($thumbnail);
            throw new RuntimeException('Failed to resize image for thumbnail.');
        }

        // Save thumbnail as WebP
        if (!imagewebp($thumbnail, $thumbnailPath, self::WEBP_QUALITY)) {
            imagedestroy($image);
            imagedestroy($thumbnail);
            throw new RuntimeException('Failed to save thumbnail.');
        }

        imagedestroy($image);
        imagedestroy($thumbnail);

        // Set secure permissions
        chmod($thumbnailPath, 0640);

        return $thumbnailPath;
    }

    /**
     * Load image based on MIME type.
     */
    private function loadImage(string $tempPath)
    {
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($tempPath);

        return match ($mimeType) {
            'image/jpeg', 'image/jpg' => imagecreatefromjpeg($tempPath),
            'image/png' => imagecreatefrompng($tempPath),
            'image/webp' => imagecreatefromwebp($tempPath),
            default => false
        };
    }

    /**
     * Check if file is a valid image.
     */
    private function isValidImage(string $tempPath): bool
    {
        $imageInfo = @getimagesize($tempPath);
        return $imageInfo !== false;
    }

    /**
     * Get image dimensions.
     * 
     * @return array{width: int, height: int}
     */
    private function getImageDimensions(string $imagePath): array
    {
        $imageInfo = @getimagesize($imagePath);
        if ($imageInfo === false) {
            throw new RuntimeException('Failed to get image dimensions.');
        }

        return [
            'width' => $imageInfo[0],
            'height' => $imageInfo[1]
        ];
    }

    /**
     * Generate secure random filename.
     */
    private function generateSecureFilename(): string
    {
        return bin2hex(random_bytes(16));
    }

    /**
     * Convert MIME type to extension.
     */
    private function mimeToExtension(string $mimeType): string
    {
        return match ($mimeType) {
            'image/jpeg', 'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => 'unknown'
        };
    }

    /**
     * Convert MIME type to allowed extensions.
     * 
     * @return list<string>
     */
    private function mimeToExtensions(string $mimeType): array
    {
        return match ($mimeType) {
            'image/jpeg', 'image/jpg' => ['jpg', 'jpeg'],
            'image/png' => ['png'],
            'image/webp' => ['webp'],
            default => []
        };
    }

    /**
     * Delete processed images.
     */
    public function deleteImages(string $webpPath, string $thumbnailPath): void
    {
        if (file_exists($webpPath)) {
            unlink($webpPath);
        }
        if (file_exists($thumbnailPath)) {
            unlink($thumbnailPath);
        }
    }
}
