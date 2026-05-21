import React from 'react';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Product } from '../types';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Luxury Estate Collection',
    price: 45000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqM3jZBzIQptwxmpb8FEWkJlgAGnmeuFvBk1H_hK95ULxuqDVYwhyRJ2JEvymzi3llosXtXbaP5YM560R_PI7kQKfdbxsztE3cIkGaa0xsWR4NJBQo_UB2rONeCZwQ3TyuhMUX8yg2mdVu2PDi9Yn0mv_oYZSF4Kyf6q0axgFSvUOWowiARyIDkQCAQGp46JIE6_QPyWcNxnd3jbuiDSx8YZTR5emWe41XyJ6kBqlOCvL4EgqkfryH1DKWxCPdjvQaqXdseDJASso',
    category: 'Rare',
    type: 'Buy Now',
    tag: 'Rare'
  },
  {
    id: '2',
    name: 'Vintage Masterpiece Camera',
    price: 12500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBFm2m6Opn8_fQhxcyMYPtX70IrKtF7z4xy7-W2O96VvWhCheZyUZLzVp83qc3KNvgk2g7YO5stybuBiI3L3hq1M6fP1trOgb9r_77qyv6Z2jyBaVChfYDXwLVYp9VmEC3Cc6GWBUAmBNY74j0hNaetkpON0lyKFtYFxFy70ipH3HFTC309KczGlea6pwD5ts7tTmnS5HzvtiVVTrkEk_r2Si913p1wbqgVcr6Jqbr9f_YTJXVuQsZwyQcLNBDh-EngP5Z7nuJ1hw',
    category: 'High-end',
    type: 'Negotiation',
    tag: 'High-end'
  },
  {
    id: '3',
    name: 'Antique Scholar Desk',
    price: 8900,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDOUOq09YtmN8bdwD-5ElgaFQ7hCDsAr9MzYx-9GBSOvdIiFla_msxbpDFoYATHF0jZzEmRX2f_DcuSGFf6QxKcK5zXF5TeaNy4PORJysbWzuTSWQMRYb2URBHJo84YyZw94SiEkUbYYpi1gZ8CTZfFrj1nSZ_ou-29g52xMuRexwCunu0H0D7318atxDh0e9Ejmwnsng0HU_MPWvqkbo1EaeH7Lm884Se1s1vwu9_I1NkwAbExjCxC5hKpLs7y68IGa-Kc6AUeTQ',
    category: 'Rare',
    type: 'Best Offer',
    tag: 'Rare'
  }
];

export const Browse: React.FC = () => {
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
          <Tab active>Immediate Purchase</Tab>
          <Tab>Seller–Buyer Negotiation</Tab>
          <Tab>Best Offer / Auction</Tab>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </Layout>
  );
};

const Tab: React.FC<{ active?: boolean, children: React.ReactNode }> = ({ active, children }) => (
  <button className={`px-6 py-4 border-b-2 ${active ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary font-medium'} text-label-md whitespace-nowrap transition-all`}>
    {children}
  </button>
);
