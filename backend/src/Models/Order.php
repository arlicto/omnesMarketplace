<?php

declare(strict_types=1);

namespace App\Models;

use PDO;

class Order
{
    private PDO $conn;
    private string $table_name = "orders";

    public ?int $id = null;
    public ?string $uuid = null;
    public ?int $negotiation_id = null;
    public ?int $product_id = null;
    public ?int $buyer_id = null;
    public ?int $seller_id = null;
    public ?float $final_price = null;
    public ?string $status = null;
    public ?string $shipping_address = null;
    public ?string $tracking_number = null;
    public ?string $notes = null;
    public ?string $created_at = null;
    public ?string $updated_at = null;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    public function create(): bool
    {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET uuid=:uuid, negotiation_id=:negotiation_id, product_id=:product_id, buyer_id=:buyer_id, 
                      seller_id=:seller_id, final_price=:final_price, status=:status, 
                      shipping_address=:shipping_address, notes=:notes";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":uuid", $this->uuid);
        $stmt->bindParam(":negotiation_id", $this->negotiation_id);
        $stmt->bindParam(":product_id", $this->product_id);
        $stmt->bindParam(":buyer_id", $this->buyer_id);
        $stmt->bindParam(":seller_id", $this->seller_id);
        $stmt->bindParam(":final_price", $this->final_price);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":shipping_address", $this->shipping_address);
        $stmt->bindParam(":notes", $this->notes);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update(): bool
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET status=:status, tracking_number=:tracking_number, notes=:notes, updated_at=CURRENT_TIMESTAMP
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":tracking_number", $this->tracking_number);
        $stmt->bindParam(":notes", $this->notes);

        if ($stmt->execute()) {
            return $stmt->rowCount() > 0;
        }
        return false;
    }
}
