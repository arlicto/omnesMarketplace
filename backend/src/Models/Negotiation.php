<?php

declare(strict_types=1);

namespace App\Models;

use PDO;

class Negotiation
{
    private PDO $conn;
    private string $table_name = "negotiations";

    public ?int $id = null;
    public ?string $uuid = null;
    public ?int $product_id = null;
    public ?int $buyer_id = null;
    public ?int $seller_id = null;
    public ?string $status = null;
    public ?float $initial_offer = null;
    public ?float $current_offer = null;
    public ?string $buyer_message = null;
    public ?string $seller_message = null;
    public ?string $expires_at = null;
    public ?string $created_at = null;
    public ?string $updated_at = null;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    public function create(): bool
    {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET uuid=:uuid, product_id=:product_id, buyer_id=:buyer_id, seller_id=:seller_id, 
                      status=:status, initial_offer=:initial_offer, current_offer=:current_offer, 
                      buyer_message=:buyer_message, expires_at=:expires_at";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":uuid", $this->uuid);
        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":buyer_id", $this->buyer_id);
        $stmt->bindParam(":seller_id", $this->seller_id);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":initial_offer", $this->initial_offer);
        $stmt->bindParam(":current_offer", $this->current_offer);
        $stmt->bindParam(":buyer_message", $this->buyer_message);
        $stmt->bindParam(":expires_at", $this->expires_at);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readOne(): bool
    {
        $query = "SELECT n.*, p.name as product_name, p.price as product_price,
                         b.username as buyer_username, s.username as seller_username
                  FROM " . $this->table_name . " n
                  LEFT JOIN products p ON n.product_id = p.id
                  LEFT JOIN users b ON n.buyer_id = b.id
                  LEFT JOIN users s ON n.seller_id = s.id
                  WHERE n.id = ? AND n.deleted_at IS NULL
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->uuid = $row['uuid'];
            $this->product_id = (int)$row['product_id'];
            $this->buyer_id = (int)$row['buyer_id'];
            $this->seller_id = (int)$row['seller_id'];
            $this->status = $row['status'];
            $this->initial_offer = (float)$row['initial_offer'];
            $this->current_offer = (float)$row['current_offer'];
            $this->buyer_message = $row['buyer_message'];
            $this->seller_message = $row['seller_message'];
            $this->expires_at = $row['expires_at'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }

    public function update(): bool
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET status=:status, current_offer=:current_offer, 
                      seller_message=:seller_message, updated_at=CURRENT_TIMESTAMP
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":current_offer", $this->current_offer);
        $stmt->bindParam(":seller_message", $this->seller_message);

        if ($stmt->execute()) {
            return $stmt->rowCount() > 0;
        }
        return false;
    }

    /**
     * Check if user is involved in this negotiation (buyer or seller).
     */
    public function isParticipant(int $userId): bool
    {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE id = ? AND (buyer_id = ? OR seller_id = ?) AND deleted_at IS NULL
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->bindParam(2, $userId);
        $stmt->bindParam(3, $userId);
        $stmt->execute();

        return $stmt->fetch() !== false;
    }

    /**
     * Check if user is the seller.
     */
    public function isSeller(int $userId): bool
    {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE id = ? AND seller_id = ? AND deleted_at IS NULL
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->bindParam(2, $userId);
        $stmt->execute();

        return $stmt->fetch() !== false;
    }

    /**
     * Check if user is the buyer.
     */
    public function isBuyer(int $userId): bool
    {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE id = ? AND buyer_id = ? AND deleted_at IS NULL
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->bindParam(2, $userId);
        $stmt->execute();

        return $stmt->fetch() !== false;
    }
}
