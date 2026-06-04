import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { getProducts, type Product as ProductType } from '../lib/api';

const Browse = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setIsLoading(false);
      });
  }, []);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const typeInfo = (t: string) => {
    if (t === 'buy_now') return { label: 'Buy It Now', cls: 'bg-secondary-container/80 text-on-secondary-container' };
    if (t === 'negotiation') return { label: 'Negotiation', cls: 'bg-tertiary-fixed-dim/80 text-on-tertiary-fixed-variant' };
    return { label: 'Best Offer', cls: 'bg-on-primary-container/80 text-primary-fixed' };
  };

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
                  <span>€0</span>
                  <span>€50,000+</span>
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
            <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">search</span>
              Apply Filters
            </button>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant mb-stack-lg overflow-x-auto hide-scrollbar">
          <Link to="/shop-now" className="px-6 py-4 border-b-2 border-transparent text-on-surface-variant hover:text-primary font-medium text-label-md transition-all whitespace-nowrap hover:border-primary">
            Shop Now
          </Link>
          <Link to="/make-offer" className="px-6 py-4 border-b-2 border-transparent text-on-surface-variant hover:text-primary font-medium text-label-md transition-all whitespace-nowrap hover:border-primary">
            Make an Offer
          </Link>
          <Link to="/place-bid" className="px-6 py-4 border-b-2 border-transparent text-on-surface-variant hover:text-primary font-medium text-label-md transition-all whitespace-nowrap hover:border-primary">
            Place a Bid
          </Link>
        </div>

        {/* Product Grid */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <span className="material-symbols-outlined text-6xl text-primary animate-spin">sync</span>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
              <p className="text-body-lg text-on-surface-variant">{error}</p>
            </div>
          </div>
        )}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {products.map((p) => {
              const t = typeInfo(p.type);
              return (
                <Link key={p.id} to={`/product?id=${p.id}`} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
                  <div className="relative h-64 overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={p.image} alt={p.name} />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="bg-primary/50 backdrop-blur-md text-white text-label-sm px-3 py-1 rounded-full">{p.category}</span>
                      <span className={`${t.cls} text-label-sm px-3 py-1 rounded-full font-bold`}>{t.label}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-headline-md font-headline-md text-primary mb-1">{p.name}</h3>
                    <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">{p.category}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-headline-md font-bold text-secondary">€{Number(p.price).toFixed(2)}</span>
                      <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:opacity-90 transition-all">View Details</button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Load More Section */}
        <div className="mt-stack-lg flex flex-col items-center">
          <button 
            className="group relative px-8 py-3 bg-surface-container border border-outline-variant rounded-full text-label-md font-bold text-primary hover:bg-primary hover:text-on-primary transition-all duration-300"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Load More Items
                <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">expand_more</span>
              </span>
            )}
          </button>
          <p className="mt-4 text-label-sm text-on-surface-variant italic">Showing {products.length} items</p>
        </div>
      </main>
    </Layout>
  );
};

export default Browse;
