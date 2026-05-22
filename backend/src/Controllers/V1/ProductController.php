<?php

declare(strict_types=1);

namespace App\Controllers\V1;

use App\Config\Validation\InputValidator;
use App\Repositories\ProductRepository;
use App\Support\JsonResponse;
use App\Support\Uuid;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use PDO;
use RuntimeException;

class ProductController
{
    private PDO $db;
    private ProductRepository $products;

    public function __construct(PDO $db, ProductRepository $products)
    {
        $this->db = $db;
        $this->products = $products;
    }

    public function getAll(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();

        $search = $params['search'] ?? null;
        $categorySlug = $params['category'] ?? null;

        $rows = $this->products->findAll(
            limit: null,
            offset: null,
            search: $search,
            status: null,
            categorySlug: $categorySlug
        );

        $products = array_map(function (array $row): array {
            return [
                "id" => (int) $row['id'],
                "name" => htmlspecialchars($row['name'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                "description" => htmlspecialchars($row['description'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                "price" => (float) $row['price'],
                "seller_id" => (int) $row['seller_id'],
                "seller_name" => htmlspecialchars($row['seller_username'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                "image_url" => $row['image_url'] ?? null,
                "thumbnail_url" => $row['thumbnail_url'] ?? null,
                "video_url" => $row['video_url'] ?? null,
                "created_at" => $row['created_at'],
            ];
        }, $rows);

        $response->getBody()->write(json_encode($products));
        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    public function getOne(Request $request, Response $response, array $args): Response
    {
        $product = $this->products->findById((int) $args['id']);

        if ($product) {
            $images = $this->products->getImages((int) $product['id']);
            $productData = [
                "id" => (int) $product['id'],
                "name" => htmlspecialchars($product['name'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                "description" => htmlspecialchars($product['description'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                "price" => (float) $product['price'],
                "seller_id" => (int) $product['seller_id'],
                "seller_name" => htmlspecialchars($product['seller_username'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                "image_url" => $product['image_url'] ?? null,
                "thumbnail_url" => $product['thumbnail_url'] ?? null,
                "video_url" => $product['video_url'] ?? null,
                "images" => $images,
                "created_at" => $product['created_at'],
            ];
            $response->getBody()->write(json_encode($productData));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode(["message" => "Product does not exist."]));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }

    public function create(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();

        $user = $request->getAttribute('user');
        $sellerId = $user['id'] ?? $request->getAttribute('user_id');

        if ($sellerId === null) {
            $response->getBody()->write(json_encode(["message" => "Authentication required."]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        try {
            $name = InputValidator::string($data['name'] ?? '', 1, 255);
            $price = InputValidator::float($data['price'] ?? 0, 0.01, 999999.99);
            $description = InputValidator::string($data['description'] ?? '', 0, 5000);
            $stock = InputValidator::int($data['stock'] ?? 0, 0, 999999);
            $videoUrl = InputValidator::string($data['video_url'] ?? '', 0, 512);
            $status = InputValidator::string($data['status'] ?? 'draft', 1, 20);
            $categoryId = isset($data['category_id']) ? InputValidator::int($data['category_id'], 1, PHP_INT_MAX) : null;

            $slug = strtolower(trim(preg_replace('/[^a-z0-9-]+/', '-', $name), '-'));
            $slug = $slug ?: 'product-' . time();

            $productId = $this->products->create([
                'uuid' => Uuid::v4(),
                'seller_id' => (int) $sellerId,
                'category_id' => $categoryId,
                'name' => $name,
                'slug' => $slug,
                'description' => $description,
                'price' => $price,
                'video_url' => $videoUrl !== '' ? $videoUrl : null,
                'status' => $status,
                'stock' => $stock,
            ]);

            $response->getBody()->write(json_encode([
                "message" => "Product was created.",
                "id" => $productId,
            ]));
            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode(["message" => $e->getMessage()]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    }

    public function uploadImage(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            $response->getBody()->write(json_encode(["message" => "Authentication required."]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $productId = (int) $args['id'];
        $product = $this->products->findById($productId);

        if ($product === null) {
            $response->getBody()->write(json_encode(["message" => "Product not found."]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        if ((int) $product['seller_id'] !== $userId) {
            $response->getBody()->write(json_encode(["message" => "You do not own this product."]));
            return $response->withStatus(403)->withHeader('Content-Type', 'application/json');
        }

        $uploadedFiles = $request->getUploadedFiles();
        $file = $uploadedFiles['image'] ?? null;

        if ($file === null) {
            $response->getBody()->write(json_encode(["message" => "No image uploaded."]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        if ($file->getError() !== UPLOAD_ERR_OK) {
            $response->getBody()->write(json_encode(["message" => "Image upload failed."]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }

        try {
            $imageProcessor = new \App\Services\ImageProcessor();
            $tempPath = $file->getStream()->getMetadata('uri');
            $originalName = $file->getClientFilename() ?? 'unknown';

            $result = $imageProcessor->processImage($tempPath, $originalName);

            $imageUrl = '/storage/uploads/images/' . basename($result['webp']);
            $thumbnailUrl = '/storage/uploads/thumbnails/' . basename($result['thumbnail']);

            if ($this->products->updateImageUrls($productId, $imageUrl, $thumbnailUrl)) {
                $response->getBody()->write(json_encode([
                    "message" => "Product image updated successfully.",
                    "image_url" => $imageUrl,
                    "thumbnail_url" => $thumbnailUrl,
                ]));
                return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode(["message" => "Unable to update product image."]));
            return $response->withStatus(503)->withHeader('Content-Type', 'application/json');
        } catch (\RuntimeException $e) {
            $response->getBody()->write(json_encode(["message" => $e->getMessage()]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    }

    public function getImages(Request $request, Response $response, array $args): Response
    {
        $productId = (int) $args['id'];
        $product = $this->products->findById($productId);

        if ($product === null) {
            return JsonResponse::error('Product not found.', 404);
        }

        $images = $this->products->getImages($productId);

        $response->getBody()->write(json_encode(['images' => $images]));
        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    public function addImage(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $productId = (int) $args['id'];
        $product = $this->products->findById($productId);

        if ($product === null) {
            return JsonResponse::error('Product not found.', 404);
        }

        if ((int) $product['seller_id'] !== $userId) {
            return JsonResponse::error('You do not own this product.', 403);
        }

        $data = (array) $request->getParsedBody();
        $url = InputValidator::string($data['url'] ?? '', 1, 512);
        $altText = InputValidator::string($data['alt_text'] ?? '', 0, 255);
        $isPrimary = !empty($data['is_primary']);

        if ($isPrimary) {
            $this->products->clearPrimaryFlag($productId);
        }

        $imageId = $this->products->addImage([
            'uuid' => Uuid::v4(),
            'product_id' => $productId,
            'url' => $url,
            'alt_text' => $altText !== '' ? $altText : null,
            'sort_order' => count($this->products->getImages($productId)),
            'is_primary' => $isPrimary,
        ]);

        return JsonResponse::make([
            'message' => 'Image added successfully.',
            'image_id' => $imageId,
        ], 201);
    }

    public function removeImage(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            return JsonResponse::error('Authentication required.', 401);
        }

        $productId = (int) $args['id'];
        $imageId = (int) $args['imageId'];
        $product = $this->products->findById($productId);

        if ($product === null) {
            return JsonResponse::error('Product not found.', 404);
        }

        if ((int) $product['seller_id'] !== $userId) {
            return JsonResponse::error('You do not own this product.', 403);
        }

        if ($this->products->removeImage($imageId)) {
            return JsonResponse::make(['message' => 'Image removed successfully.']);
        }

        return JsonResponse::error('Image not found.', 404);
    }
}
