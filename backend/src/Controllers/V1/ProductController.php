<?php

declare(strict_types=1);

namespace App\Controllers\V1;

use App\Config\Validation\InputValidator;
use App\Models\Product;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use PDO;

class ProductController
{
    private PDO $db;

    /**
     * ProductController constructor receives dependencies via Dependency Injection.
     *
     * @param PDO $db
     */
    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Retrieve all products from the database.
     *
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function getAll(Request $request, Response $response): Response
    {
        $product = new Product($this->db);
        $stmt = $product->read();
        $num = $stmt->rowCount();

        $products = [];
        if ($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $products[] = [
                    "id" => (int) $row['id'],
                    "name" => htmlspecialchars($row['name'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                    "description" => htmlspecialchars($row['description'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                    "price" => (float) $row['price'],
                    "seller_id" => (int) $row['seller_id'],
                    "seller_name" => htmlspecialchars($row['seller_name'] ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                    "image_url" => $row['image_url'] ?? null,
                    "thumbnail_url" => $row['thumbnail_url'] ?? null,
                    "created_at" => $row['created_at']
                ];
            }
        }

        $response->getBody()->write(json_encode($products));
        return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Retrieve a single product by ID.
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     */
    public function getOne(Request $request, Response $response, array $args): Response
    {
        $product = new Product($this->db);
        $product->id = (int) $args['id'];

        if ($product->readOne()) {
            $productData = [
                "id" => $product->id,
                "name" => htmlspecialchars($product->name ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                "description" => htmlspecialchars($product->description ?? '', ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                "price" => (float) $product->price,
                "seller_id" => (int) $product->seller_id,
                "image_url" => $product->image_url,
                "thumbnail_url" => $product->thumbnail_url,
                "created_at" => $product->created_at
            ];
            $response->getBody()->write(json_encode($productData));
            return $response->withStatus(200)->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode(["message" => "Product does not exist."]));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }

    /**
     * Create a new product.
     *
     * @param Request $request
     * @param Response $response
     * @return Response
     */
    public function create(Request $request, Response $response): Response
    {
        $data = json_decode((string) $request->getBody(), true);
        
        // Resolve authenticated user ID from AuthMiddleware (IDOR prevention)
        $user = $request->getAttribute('user');
        $sellerId = $user['id'] ?? $request->getAttribute('user_id');

        if ($sellerId === null) {
            $response->getBody()->write(json_encode(["message" => "Authentication required."]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        try {
            // Validate input using InputValidator
            $name = InputValidator::string($data['name'] ?? '', 1, 255);
            $price = InputValidator::float($data['price'] ?? 0, 0.01, 999999.99);
            $description = InputValidator::string($data['description'] ?? '', 0, 5000);
            $imageUrl = InputValidator::string($data['image_url'] ?? '', 0, 500);
            $thumbnailUrl = InputValidator::string($data['thumbnail_url'] ?? '', 0, 500);

            $product = new Product($this->db);
            $product->name = $name;
            $product->price = $price;
            $product->description = $description;
            $product->seller_id = (int) $sellerId;
            $product->image_url = $imageUrl !== '' ? $imageUrl : null;
            $product->thumbnail_url = $thumbnailUrl !== '' ? $thumbnailUrl : null;

            if ($product->create()) {
                $response->getBody()->write(json_encode(["message" => "Product was created."]));
                return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode(["message" => "Unable to create product."]));
            return $response->withStatus(503)->withHeader('Content-Type', 'application/json');
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode(["message" => $e->getMessage()]));
            return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Upload image for a specific product.
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     */
    public function uploadImage(Request $request, Response $response, array $args): Response
    {
        $userId = $request->getAttribute('user_id');
        if ($userId === null) {
            $response->getBody()->write(json_encode(["message" => "Authentication required."]));
            return $response->withStatus(401)->withHeader('Content-Type', 'application/json');
        }

        $productId = (int) $args['id'];
        
        // Verify ownership
        $product = new Product($this->db);
        $product->id = $productId;
        
        if (!$product->readOne()) {
            $response->getBody()->write(json_encode(["message" => "Product not found."]));
            return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
        }

        if (!$product->isOwnedBy((int) $userId)) {
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

            // Update product with image URLs
            $product->image_url = '/storage/uploads/images/' . basename($result['webp']);
            $product->thumbnail_url = '/storage/uploads/thumbnails/' . basename($result['thumbnail']);

            if ($product->update((int) $userId)) {
                $response->getBody()->write(json_encode([
                    "message" => "Product image updated successfully.",
                    "image_url" => $product->image_url,
                    "thumbnail_url" => $product->thumbnail_url
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
}
