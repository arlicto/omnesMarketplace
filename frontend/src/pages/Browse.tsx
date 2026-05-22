import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Product } from '../types';
import apiClient from '../services/apiClient';

export const Browse: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('');
  const [saleType, setSaleType] = useState('');
  const [sortBy, setSortBy] = useState('created_at_desc');

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (saleType) params.sale_type = saleType;
    if (sortBy) params.sort = sortBy;
    try {
      const response = await apiClient.get('/products', { params });
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, category, saleType, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        {/* Header & Title */}
        <header className="mb-stack-lg">
          <h1 className="text-headline-xl font-headline-xl text-primary">Browse All Items</h1>
          <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">Discover a curated selection of high-end collectibles and rare assets. Filter your search to find exactly what defines your legacy.</p>
          {search && (
            <p className="text-body-md text-on-surface-variant mt-4">
              Results for: '<span className="font-bold text-primary">{search}</span>'
            </p>
          )}
        </header>

        {/* Filter Bar */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant mb-stack-lg">
          <div className="flex flex-wrap items-end gap-gutter">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Search</label>
              <input
                className="w-full border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-body-md py-2 px-3 bg-surface-bright"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Category</label>
              <select
                className="w-full border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-body-md py-2 px-3 bg-surface-bright"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="rare">Rare Items</option>
                <option value="high-end">High-end Items</option>
                <option value="regular">Regular Items</option>
              </select>
            </div>
            {/* Sale Type Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Sale Type</label>
              <select
                className="w-full border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-body-md py-2 px-3 bg-surface-bright"
                value={saleType}
                onChange={(e) => setSaleType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Buy It Now">Buy It Now</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Best Offer">Best Offer</option>
              </select>
            </div>
            {/* Sort Dropdown */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Sort By</label>
              <select
                className="w-full border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-body-md py-2 px-3 bg-surface-bright"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="created_at_desc">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
            {/* Search Action */}
            <Button className="flex items-center gap-2" onClick={fetchProducts}>
              <span className="material-symbols-outlined text-[20px]">search</span>
              Apply Filters
            </Button>
          </div>
        </section>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">search_off</span>
            <p className="text-body-lg text-on-surface-variant">No products found.</p>
            <p className="text-body-md text-on-surface-variant mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
};
