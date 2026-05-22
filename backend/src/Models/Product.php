<?php

declare(strict_types=1);

namespace App\Models;

use PDO;
use PDOStatement;

class Product
{
    private PDO $conn;
    private string $table_name = "products";

    public ?int $id = null;
    public ?string $name = null;
    public ?string $description = null;
    public ?float $price = null;
    public ?int $seller_id = null;
    public ?string $seller_name = null;
    public ?string $image_url = null;
    public ?string $thumbnail_url = null;
    public ?string $created_at = null;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    public function read(): PDOStatement
    {
        $query = "SELECT p.id, p.name, p.description, p.price, p.seller_id, p.image_url, p.thumbnail_url, p.created_at, u.username as seller_name
                FROM " . $this->table_name . " p
                LEFT JOIN users u ON p.seller_id = u.id
                ORDER BY p.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function readOne(): bool
    {
        $query = "SELECT p.id, p.name, p.description, p.price, p.seller_id, p.image_url, p.thumbnail_url, p.created_at, u.username as seller_name
                FROM " . $this->table_name . " p
                LEFT JOIN users u ON p.seller_id = u.id
                WHERE p.id = ?
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->name = $row['name'];
            $this->description = $row['description'];
            $this->price = (float)$row['price'];
            $this->seller_id = (int)$row['seller_id'];
            $this->seller_name = $row['seller_name'] ?? null;
            $this->image_url = $row['image_url'];
            $this->thumbnail_url = $row['thumbnail_url'];
            $this->created_at = $row['created_at'];
            return true;
        }

        return false;
    }

    public function create(): bool
    {
        $query = "INSERT INTO " . $this->table_name . " SET name=:name, description=:description, price=:price, seller_id=:seller_id, image_url=:image_url, thumbnail_url=:thumbnail_url";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":seller_id", $this->seller_id);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":thumbnail_url", $this->thumbnail_url);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    /**
     * Check if a user owns this product (IDOR prevention).
     */
    public function isOwnedBy(int $userId): bool
    {
        $query = "SELECT seller_id FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && (int)$row['seller_id'] === $userId) {
            return true;
        }

        return false;
    }

    /**
     * Update a product with ownership validation.
     */
    public function update(int $userId): bool
    {
        if (!$this->isOwnedBy($userId)) {
            return false;
        }

        $query = "UPDATE " . $this->table_name . " SET name=:name, description=:description, price=:price, image_url=:image_url, thumbnail_url=:thumbnail_url WHERE id=:id AND seller_id=:seller_id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":thumbnail_url", $this->thumbnail_url);
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":seller_id", $userId);

        if ($stmt->execute()) {
            return $stmt->rowCount() > 0;
        }
        return false;
    }

    /**
     * Delete a product with ownership validation.
     */
    public function delete(int $userId): bool
    {
        if (!$this->isOwnedBy($userId)) {
            return false;
        }

        $query = "DELETE FROM " . $this->table_name . " WHERE id = ? AND seller_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->bindParam(2, $userId);

        if ($stmt->execute()) {
            return $stmt->rowCount() > 0;
        }
        return false;
    }
}

