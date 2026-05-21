<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class NegotiationRepository
{
    public function __construct(private PDO $db)
    {
    }

    /** @return array<string, mixed>|null */
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT n.*, p.name as product_name, p.price as product_price,
                    b.username as buyer_username, b.email as buyer_email,
                    s.username as seller_username, s.email as seller_email
             FROM negotiations n
             LEFT JOIN products p ON n.product_id = p.id
             LEFT JOIN users b ON n.buyer_id = b.id
             LEFT JOIN users s ON n.seller_id = s.id
             WHERE n.id = :id AND n.deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    /** @return array<string, mixed>|null */
    public function findByUuid(string $uuid): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT n.*, p.name as product_name, p.price as product_price,
                    b.username as buyer_username, s.username as seller_username
             FROM negotiations n
             LEFT JOIN products p ON n.product_id = p.id
             LEFT JOIN users b ON n.buyer_id = b.id
             LEFT JOIN users s ON n.seller_id = s.id
             WHERE n.uuid = :uuid AND n.deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute(['uuid' => $uuid]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO negotiations (uuid, product_id, buyer_id, seller_id, status, initial_offer, current_offer, buyer_message, expires_at)
             VALUES (:uuid, :product_id, :buyer_id, :seller_id, :status, :initial_offer, :current_offer, :buyer_message, :expires_at)'
        );
        $stmt->execute([
            'uuid' => $data['uuid'],
            'product_id' => $data['product_id'],
            'buyer_id' => $data['buyer_id'],
            'seller_id' => $data['seller_id'],
            'status' => $data['status'] ?? 'pending',
            'initial_offer' => $data['initial_offer'],
            'current_offer' => $data['current_offer'],
            'buyer_message' => $data['buyer_message'] ?? null,
            'expires_at' => $data['expires_at'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function updateStatus(int $id, string $status, ?float $currentOffer = null, ?string $sellerMessage = null): bool
    {
        $sql = 'UPDATE negotiations SET status = :status';
        $params = ['id' => $id, 'status' => $status];

        if ($currentOffer !== null) {
            $sql .= ', current_offer = :current_offer';
            $params['current_offer'] = $currentOffer;
        }

        if ($sellerMessage !== null) {
            $sql .= ', seller_message = :seller_message';
            $params['seller_message'] = $sellerMessage;
        }

        $sql .= ', updated_at = CURRENT_TIMESTAMP WHERE id = :id';

        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params) && $stmt->rowCount() > 0;
    }

    /** @return list<array<string, mixed>> */
    public function findByBuyer(int $buyerId, ?string $status = null): array
    {
        $sql = 'SELECT n.*, p.name as product_name, p.price as product_price,
                p.image_url, p.thumbnail_url, s.username as seller_username
                FROM negotiations n
                LEFT JOIN products p ON n.product_id = p.id
                LEFT JOIN users s ON n.seller_id = s.id
                WHERE n.buyer_id = :buyer_id AND n.deleted_at IS NULL';
        
        $params = ['buyer_id' => $buyerId];

        if ($status !== null) {
            $sql .= ' AND n.status = :status';
            $params['status'] = $status;
        }

        $sql .= ' ORDER BY n.created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    /** @return list<array<string, mixed>> */
    public function findBySeller(int $sellerId, ?string $status = null): array
    {
        $sql = 'SELECT n.*, p.name as product_name, p.price as product_price,
                p.image_url, p.thumbnail_url, b.username as buyer_username
                FROM negotiations n
                LEFT JOIN products p ON n.product_id = p.id
                LEFT JOIN users b ON n.buyer_id = b.id
                WHERE n.seller_id = :seller_id AND n.deleted_at IS NULL';
        
        $params = ['seller_id' => $sellerId];

        if ($status !== null) {
            $sql .= ' AND n.status = :status';
            $params['status'] = $status;
        }

        $sql .= ' ORDER BY n.created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    /** @return list<array<string, mixed>> */
    public function findByProduct(int $productId): array
    {
        $stmt = $this->db->prepare(
            'SELECT n.*, b.username as buyer_username, s.username as seller_username
             FROM negotiations n
             LEFT JOIN users b ON n.buyer_id = b.id
             LEFT JOIN users s ON n.seller_id = s.id
             WHERE n.product_id = :product_id AND n.deleted_at IS NULL
             ORDER BY n.created_at DESC'
        );
        $stmt->execute(['product_id' => $productId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function hasActiveNegotiation(int $productId, int $buyerId): bool
    {
        $stmt = $this->db->prepare(
            'SELECT 1 FROM negotiations 
             WHERE product_id = :product_id AND buyer_id = :buyer_id 
             AND status IN (\'pending\', \'countered\') AND deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute(['product_id' => $productId, 'buyer_id' => $buyerId]);

        return (bool) $stmt->fetchColumn();
    }

    public function markExpired(): int
    {
        $stmt = $this->db->prepare(
            'UPDATE negotiations 
             SET status = \'expired\', updated_at = CURRENT_TIMESTAMP
             WHERE expires_at < NOW() AND status IN (\'pending\', \'countered\') AND deleted_at IS NULL'
        );
        $stmt->execute();

        return $stmt->rowCount();
    }

    /** @return list<array<string, mixed>> */
    public function findAll(?int $limit = null, ?int $offset = null, ?string $status = null): array
    {
        $sql = 'SELECT n.*, p.name as product_name, p.price as product_price,
                b.username as buyer_username, s.username as seller_username
                FROM negotiations n
                LEFT JOIN products p ON n.product_id = p.id
                LEFT JOIN users b ON n.buyer_id = b.id
                LEFT JOIN users s ON n.seller_id = s.id
                WHERE n.deleted_at IS NULL';
        
        $params = [];

        if ($status !== null) {
            $sql .= ' AND n.status = :status';
            $params['status'] = $status;
        }

        $sql .= ' ORDER BY n.created_at DESC';

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
        $sql = 'SELECT COUNT(*) FROM negotiations WHERE deleted_at IS NULL';
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
