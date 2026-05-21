<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Pagination helper for admin dashboard.
 * Handles pagination logic and metadata.
 */
final class Pagination
{
    private int $page;
    private int $perPage;
    private int $total;
    private int $totalPages;
    private int $offset;

    public function __construct(int $page = 1, int $perPage = 20, int $total = 0)
    {
        $this->page = max(1, $page);
        $this->perPage = max(1, min(100, $perPage));
        $this->total = max(0, $total);
        $this->totalPages = (int) ceil($this->total / $this->perPage);
        $this->offset = ($this->page - 1) * $this->perPage;
    }

    public function getPage(): int
    {
        return $this->page;
    }

    public function getPerPage(): int
    {
        return $this->perPage;
    }

    public function getTotal(): int
    {
        return $this->total;
    }

    public function getTotalPages(): int
    {
        return $this->totalPages;
    }

    public function getOffset(): int
    {
        return $this->offset;
    }

    public function getLimit(): int
    {
        return $this->perPage;
    }

    public function hasNextPage(): bool
    {
        return $this->page < $this->totalPages;
    }

    public function hasPreviousPage(): bool
    {
        return $this->page > 1;
    }

    public function getNextPage(): int
    {
        return min($this->page + 1, $this->totalPages);
    }

    public function getPreviousPage(): int
    {
        return max($this->page - 1, 1);
    }

    /**
     * Get pagination metadata for API responses.
     * 
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'page' => $this->page,
            'per_page' => $this->perPage,
            'total' => $this->total,
            'total_pages' => $this->totalPages,
            'has_next' => $this->hasNextPage(),
            'has_previous' => $this->hasPreviousPage(),
            'next_page' => $this->hasNextPage() ? $this->getNextPage() : null,
            'previous_page' => $this->hasPreviousPage() ? $this->getPreviousPage() : null,
        ];
    }

    /**
     * Create pagination from query parameters.
     */
    public static function fromQuery(array $queryParams, int $defaultPerPage = 20): self
    {
        $page = (int) ($queryParams['page'] ?? 1);
        $perPage = (int) ($queryParams['per_page'] ?? $defaultPerPage);
        
        return new self($page, $perPage);
    }

    /**
     * Create pagination with total count.
     */
    public static function withTotal(int $page, int $perPage, int $total): self
    {
        return new self($page, $perPage, $total);
    }
}
