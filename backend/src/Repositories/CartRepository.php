<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class CartRepository
{
    public function __construct(private PDO $db)
    {
    }

    public function findActiveByUserId(int $userId): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT id, uuid, user_id, status, created_at, updated_at
             FROM carts
             WHERE user_id = :user_id AND status = \'active\'
             LIMIT 1'
        );
        $stmt->execute(['user_id' => $userId]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function create(int $userId, string $uuid): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO carts (uuid, user_id, status) VALUES (:uuid, :user_id, \'active\')'
        );
        $stmt->execute(['uuid' => $uuid, 'user_id' => $userId]);

        return (int) $this->db->lastInsertId();
    }

    public function getItems(int $cartId): array
    {
        $stmt = $this->db->prepare(
            'SELECT ci.id, ci.cart_id, ci.product_id, ci.quantity, ci.unit_price,
                    p.name, p.image_url, p.thumbnail_url, p.category_id,
                    c.name as category_name
             FROM cart_items ci
             LEFT JOIN products p ON ci.product_id = p.id
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE ci.cart_id = :cart_id
             ORDER BY ci.created_at ASC'
        );
        $stmt->execute(['cart_id' => $cartId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function addItem(int $cartId, int $productId, int $quantity, float $unitPrice): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO cart_items (cart_id, product_id, quantity, unit_price)
             VALUES (:cart_id, :product_id, :quantity, :unit_price)
             ON DUPLICATE KEY UPDATE quantity = quantity + :quantity2, unit_price = :unit_price2'
        );
        $stmt->execute([
            'cart_id' => $cartId,
            'product_id' => $productId,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'quantity2' => $quantity,
            'unit_price2' => $unitPrice,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function removeItem(int $itemId, int $cartId): bool
    {
        $stmt = $this->db->prepare(
            'DELETE FROM cart_items WHERE id = :id AND cart_id = :cart_id'
        );
        $stmt->execute(['id' => $itemId, 'cart_id' => $cartId]);

        return $stmt->rowCount() > 0;
    }

    public function markConverted(int $cartId): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE carts SET status = \'converted\' WHERE id = :id AND status = \'active\''
        );
        $stmt->execute(['id' => $cartId]);

        return $stmt->rowCount() > 0;
    }
}
