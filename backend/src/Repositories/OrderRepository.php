<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class OrderRepository
{
    public function __construct(private PDO $db)
    {
    }

    /** @return array<string, mixed>|null */
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT o.*, p.name as product_name, p.image_url, p.thumbnail_url,
                    b.username as buyer_username, b.email as buyer_email,
                    s.username as seller_username, s.email as seller_email
             FROM orders o
             LEFT JOIN products p ON o.product_id = p.id
             LEFT JOIN users b ON o.buyer_id = b.id
             LEFT JOIN users s ON o.seller_id = s.id
             WHERE o.id = :id AND o.deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO orders (uuid, order_number, buyer_id, status, subtotal, tax_amount, shipping_amount, total_amount, currency, shipping_address, notes)
             VALUES (:uuid, :order_number, :buyer_id, :status, :subtotal, :tax_amount, :shipping_amount, :total_amount, :currency, :shipping_address, :notes)'
        );
        $stmt->execute([
            'uuid' => $data['uuid'],
            'order_number' => $data['order_number'] ?? bin2hex(random_bytes(8)),
            'buyer_id' => $data['buyer_id'],
            'status' => $data['status'] ?? 'pending',
            'subtotal' => $data['subtotal'] ?? 0,
            'tax_amount' => $data['tax_amount'] ?? 0,
            'shipping_amount' => $data['shipping_amount'] ?? 0,
            'total_amount' => $data['total_amount'] ?? 0,
            'currency' => $data['currency'] ?? 'USD',
            'shipping_address' => $data['shipping_address'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function createOrderItem(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO order_items (order_id, product_id, seller_id, product_name, product_slug, quantity, unit_price, line_total)
             VALUES (:order_id, :product_id, :seller_id, :product_name, :product_slug, :quantity, :unit_price, :line_total)'
        );
        $stmt->execute([
            'order_id' => $data['order_id'],
            'product_id' => $data['product_id'],
            'seller_id' => $data['seller_id'],
            'product_name' => $data['product_name'],
            'product_slug' => $data['product_slug'],
            'quantity' => $data['quantity'],
            'unit_price' => $data['unit_price'],
            'line_total' => $data['line_total'],
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function updateStatus(int $id, string $status, ?string $trackingNumber = null, ?string $notes = null): bool
    {
        $sql = 'UPDATE orders SET status = :status';
        $params = ['id' => $id, 'status' => $status];

        if ($trackingNumber !== null) {
            $sql .= ', tracking_number = :tracking_number';
            $params['tracking_number'] = $trackingNumber;
        }

        if ($notes !== null) {
            $sql .= ', notes = :notes';
            $params['notes'] = $notes;
        }

        $sql .= ', updated_at = CURRENT_TIMESTAMP WHERE id = :id';

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params) && $stmt->rowCount() > 0;
    }

    /** @return list<array<string, mixed>> */
    public function findAll(?int $limit = null, ?int $offset = null, ?string $status = null, ?int $buyerId = null, ?int $sellerId = null): array
    {
        $sql = 'SELECT o.*, p.name as product_name, p.image_url,
                b.username as buyer_username, s.username as seller_username
                FROM orders o
                LEFT JOIN products p ON o.product_id = p.id
                LEFT JOIN users b ON o.buyer_id = b.id
                LEFT JOIN users s ON o.seller_id = s.id
                WHERE o.deleted_at IS NULL';
        
        $params = [];

        if ($status !== null) {
            $sql .= ' AND o.status = :status';
            $params['status'] = $status;
        }

        if ($buyerId !== null) {
            $sql .= ' AND o.buyer_id = :buyer_id';
            $params['buyer_id'] = $buyerId;
        }

        if ($sellerId !== null) {
            $sql .= ' AND o.seller_id = :seller_id';
            $params['seller_id'] = $sellerId;
        }

        $sql .= ' ORDER BY o.created_at DESC';

        if ($limit !== null) {
            $sql .= ' LIMIT :limit';
            $params['limit'] = $limit;
        }

        if ($offset !== null) {
            $sql .= ' OFFSET :offset';
            $params['offset'] = $offset;
        }

        $stmt = $this->db->prepare($sql);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function count(?string $status = null): int
    {
        $sql = 'SELECT COUNT(*) FROM orders WHERE deleted_at IS NULL';
        $params = [];

        if ($status !== null) {
            $sql .= ' AND status = :status';
            $params['status'] = $status;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return (int) $stmt->fetchColumn();
    }
}
