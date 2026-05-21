import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Product } from '../types';
import apiClient from '../services/apiClient';

export const Browse: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'buy-now' | 'negotiable' | 'auction'>('buy-now');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    if (activeTab === 'buy-now') return product.type === 'Buy Now';
    if (activeTab === 'negotiable') return product.type === 'Negotiation';
    if (activeTab === 'auction') return product.type === 'Best Offer';
    return true;
  });

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
        </header>

        {/* Filter Bar */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant mb-stack-lg">
          <div className="flex flex-wrap items-end gap-gutter">
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Category</label>
              <select className="w-full border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-body-md py-2 px-3 bg-surface-bright">
                <option>All Categories</option>
                <option>Rare</option>
                <option>High-end</option>
                <option>Regular</option>
              </select>
            </div>
            {/* Sale Type Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Sale Type</label>
              <select className="w-full border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-body-md py-2 px-3 bg-surface-bright">
                <option>All Types</option>
                <option>Buy It Now</option>
                <option>Negotiation</option>
                <option>Best Offer</option>
              </select>
            </div>
            {/* Price Slider Placeholder */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Price Range</label>
              <div className="relative pt-1">
                <input className="w-full h-2 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-primary" type="range"/>
                <div className="flex justify-between text-label-sm text-on-surface-variant mt-2">
                  <span>$0</span>
                  <span>$50,000+</span>
                </div>
              </div>
            </div>
            {/* Sort Dropdown */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-label-sm font-label-sm text-on-surface-variant mb-2">Sort By</label>
              <select className="w-full border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-body-md py-2 px-3 bg-surface-bright">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Watched</option>
              </select>
            </div>
            {/* Search Action */}
            <Button className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">search</span>
              Apply Filters
            </Button>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant mb-stack-lg overflow-x-auto hide-scrollbar">
          <Tab active={activeTab === 'buy-now'} onClick={() => setActiveTab('buy-now')}>Buy It Now</Tab>
          <Tab active={activeTab === 'negotiable'} onClick={() => setActiveTab('negotiable')}>Negotiable Prices</Tab>
          <Tab active={activeTab === 'auction'} onClick={() => setActiveTab('auction')}>Auctioned Products</Tab>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </Layout>
  );
};

const Tab: React.FC<{ active?: boolean, children: React.ReactNode, onClick?: () => void }> = ({ active, children, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-4 border-b-2 ${active ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary font-medium'} text-label-md whitespace-nowrap transition-all`}
  >
    {children}
  </button>
);
