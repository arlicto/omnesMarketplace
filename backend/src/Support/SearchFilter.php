<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Search filter helper for admin dashboard.
 * Handles search, filtering, and sorting logic.
 */
final class SearchFilter
{
    private ?string $search;
    private ?string $sortBy;
    private string $sortOrder;
    private array $filters;
    private array $allowedSortFields;

    public function __construct(
        ?string $search = null,
        ?string $sortBy = null,
        string $sortOrder = 'desc',
        array $filters = [],
        array $allowedSortFields = ['id', 'created_at', 'updated_at']
    ) {
        $this->search = $search;
        $this->sortBy = $sortBy;
        $this->sortOrder = in_array(strtolower($sortOrder), ['asc', 'desc'], true) ? strtolower($sortOrder) : 'desc';
        $this->filters = $filters;
        $this->allowedSortFields = $allowedSortFields;
    }

    public function getSearch(): ?string
    {
        return $this->search;
    }

    public function getSortBy(): ?string
    {
        if ($this->sortBy === null) {
            return null;
        }

        return in_array($this->sortBy, $this->allowedSortFields, true) ? $this->sortBy : null;
    }

    public function getSortOrder(): string
    {
        return $this->sortOrder;
    }

    public function getFilter(string $key, mixed $default = null): mixed
    {
        return $this->filters[$key] ?? $default;
    }

    public function hasFilter(string $key): bool
    {
        return isset($this->filters[$key]);
    }

    public function getFilters(): array
    {
        return $this->filters;
    }

    /**
     * Get SQL ORDER BY clause.
     */
    public function getOrderByClause(string $defaultField = 'created_at'): string
    {
        $field = $this->getSortBy() ?? $defaultField;
        return "ORDER BY {$field} {$this->sortOrder}";
    }

    /**
     * Get SQL WHERE clause for search.
     * 
     * @param array<string> $searchFields Fields to search in
     * @return array{string, array<string, mixed>} [sql, params]
     */
    public function getSearchClause(array $searchFields): array
    {
        if ($this->search === null || $this->search === '') {
            return ['', []];
        }

        $conditions = [];
        $params = [];
        $searchTerm = '%' . $this->search . '%';

        foreach ($searchFields as $field) {
            $paramKey = 'search_' . str_replace('.', '_', $field);
            $conditions[] = "{$field} LIKE :{$paramKey}";
            $params[$paramKey] = $searchTerm;
        }

        $sql = '(' . implode(' OR ', $conditions) . ')';
        return [$sql, $params];
    }

    /**
     * Create filter from query parameters.
     */
    public static function fromQuery(array $queryParams, array $allowedSortFields = ['id', 'created_at', 'updated_at']): self
    {
        $filters = [];
        
        // Extract filters (parameters starting with 'filter_')
        foreach ($queryParams as $key => $value) {
            if (str_starts_with($key, 'filter_')) {
                $filterKey = substr($key, 7); // Remove 'filter_' prefix
                $filters[$filterKey] = $value;
            }
        }

        return new self(
            $queryParams['search'] ?? null,
            $queryParams['sort_by'] ?? null,
            $queryParams['sort_order'] ?? 'desc',
            $filters,
            $allowedSortFields
        );
    }

    /**
     * Get filter parameters for SQL WHERE clause.
     * 
     * @param array<string, string> $fieldMap Map of filter keys to SQL fields
     * @return array{string, array<string, mixed>} [sql, params]
     */
    public function getFilterClause(array $fieldMap): array
    {
        $conditions = [];
        $params = [];

        foreach ($this->filters as $key => $value) {
            if (isset($fieldMap[$key]) && $value !== '' && $value !== null) {
                $field = $fieldMap[$key];
                $paramKey = 'filter_' . $key;
                $conditions[] = "{$field} = :{$paramKey}";
                $params[$paramKey] = $value;
            }
        }

        if (empty($conditions)) {
            return ['', []];
        }

        $sql = '(' . implode(' AND ', $conditions) . ')';
        return [$sql, $params];
    }
}
