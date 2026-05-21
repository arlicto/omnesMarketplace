<?php

declare(strict_types=1);

namespace App\Models;

use PDO;

class Notification
{
    private PDO $conn;
    private string $table_name = "notifications";

    public ?int $id = null;
    public ?string $uuid = null;
    public ?int $user_id = null;
    public ?string $type = null;
    public ?string $title = null;
    public ?string $message = null;
    public ?string $data = null;
    public ?bool $is_read = null;
    public ?string $read_at = null;
    public ?string $created_at = null;
    public ?string $expires_at = null;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    public function create(): bool
    {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET uuid=:uuid, user_id=:user_id, type=:type, title=:title, 
                      message=:message, data=:data, expires_at=:expires_at";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":uuid", $this->uuid);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":message", $this->message);
        $stmt->bindParam(":data", $this->data);
        $stmt->bindParam(":expires_at", $this->expires_at);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function markAsRead(): bool
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
                  WHERE id = :id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":user_id", $this->user_id);

        if ($stmt->execute()) {
            return $stmt->rowCount() > 0;
        }
        return false;
    }

    public function markAllAsRead(int $userId): bool
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET is_read = TRUE, read_at = CURRENT_TIMESTAMP 
                  WHERE user_id = :user_id AND is_read = FALSE AND deleted_at IS NULL";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":user_id", $userId);

        return $stmt->execute();
    }

    /**
     * Check if notification belongs to user.
     */
    public function belongsToUser(int $userId): bool
    {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE id = ? AND user_id = ? AND deleted_at IS NULL
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->bindParam(2, $userId);
        $stmt->execute();

        return $stmt->fetch() !== false;
    }
}
