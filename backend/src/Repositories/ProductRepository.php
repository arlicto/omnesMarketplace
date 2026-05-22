<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class ProductRepository
{
    public function __construct(private PDO $db)
    {
    }

    /** @return array<string, mixed>|null */
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT p.*, u.username as seller_username 
             FROM products p
             LEFT JOIN users u ON p.seller_id = u.id
             WHERE p.id = :id AND p.deleted_at IS NULL
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
            'SELECT p.*, u.username as seller_username 
             FROM products p
             LEFT JOIN users u ON p.seller_id = u.id
             WHERE p.uuid = :uuid AND p.deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute(['uuid' => $uuid]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO products (uuid, seller_id, category_id, name, slug, description, price, status, stock)
             VALUES (:uuid, :seller_id, :category_id, :name, :slug, :description, :price, :status, :stock)'
        );
        $stmt->execute([
            'uuid' => $data['uuid'],
            'seller_id' => $data['seller_id'],
            'category_id' => $data['category_id'] ?? null,
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'status' => $data['status'] ?? 'draft',
            'stock' => $data['stock'] ?? 0,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function updateImageUrls(int $id, string $imageUrl, string $thumbnailUrl): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE products SET image_url = :image_url, thumbnail_url = :thumbnail_url, updated_at = CURRENT_TIMESTAMP
             WHERE id = :id AND deleted_at IS NULL'
        );
        $stmt->execute([
            'id' => $id,
            'image_url' => $imageUrl,
            'thumbnail_url' => $thumbnailUrl,
        ]);

        return $stmt->rowCount() > 0;
    }

    /** @return list<array<string, mixed>> */
    public function findBySeller(int $sellerId): array
    {
        $stmt = $this->db->prepare(
            'SELECT p.*, u.username as seller_username 
             FROM products p
             LEFT JOIN users u ON p.seller_id = u.id
             WHERE p.seller_id = :seller_id AND p.deleted_at IS NULL
             ORDER BY p.created_at DESC'
        );
        $stmt->execute(['seller_id' => $sellerId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE products SET status = :status, updated_at = CURRENT_TIMESTAMP 
             WHERE id = :id AND deleted_at IS NULL'
        );
        $stmt->execute(['id' => $id, 'status' => $status]);

        return $stmt->rowCount() > 0;
    }

    /** @return list<array<string, mixed>> */
    public function findAll(?int $limit = null, ?int $offset = null, ?string $search = null, ?string $status = null, ?int $categoryId = null): array
    {
        $sql = 'SELECT p.*, u.username as seller_username 
                FROM products p
                LEFT JOIN users u ON p.seller_id = u.id
                WHERE p.deleted_at IS NULL';
        
        $params = [];

        if ($search !== null && $search !== '') {
            $sql .= ' AND (p.name LIKE :search OR p.description LIKE :search)';
            $params['search'] = '%' . $search . '%';
        }

        if ($status !== null) {
            $sql .= ' AND p.status = :status';
            $params['status'] = $status;
        }

        if ($categoryId !== null) {
            $sql .= ' AND p.category_id = :category_id';
            $params['category_id'] = $categoryId;
        }

        $sql .= ' ORDER BY p.created_at DESC';

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

    public function count(?string $search = null, ?string $status = null, ?int $categoryId = null): int
    {
        $sql = 'SELECT COUNT(*) FROM products WHERE deleted_at IS NULL';
        $params = [];

        if ($search !== null && $search !== '') {
            $sql .= ' AND (name LIKE :search OR description LIKE :search)';
            $params['search'] = '%' . $search . '%';
        }

        if ($status !== null) {
            $sql .= ' AND status = :status';
            $params['status'] = $status;
        }

        if ($categoryId !== null) {
            $sql .= ' AND category_id = :category_id';
            $params['category_id'] = $categoryId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return (int) $stmt->fetchColumn();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id AND deleted_at IS NULL'
        );
        $stmt->execute(['id' => $id]);

        return $stmt->rowCount() > 0;
    }
}
