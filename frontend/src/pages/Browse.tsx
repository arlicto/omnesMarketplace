import { useState } from 'react';
import Layout from '../components/Layout';

const Browse = () => {
  const [activeTab, setActiveTab] = useState('Immediate Purchase');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
            <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">search</span>
              Apply Filters
            </button>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant mb-stack-lg overflow-x-auto hide-scrollbar">
          {['Immediate Purchase', 'Seller–Buyer Negotiation', 'Best Offer / Auction'].map(tab => (
            <button 
              key={tab}
              className={`px-6 py-4 border-b-2 text-label-md transition-all whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-primary font-medium'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {/* Product Card 1 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqM3jZBzIQptwxmpb8FEWkJlgAGnmeuFvBk1H_hK95ULxuqDVYwhyRJ2JEvymzi3llosXtXbaP5YM560R_PI7kQKfdbxsztE3cIkGaa0xsWR4NJBQo_UB2rONeCZwQ3TyuhMUX8yg2mdVu2PDi9Yn0mv_oYZSF4Kyf6q0axgFSvUOWowiARyIDkQCAQGp46JIE6_QPyWcNxnd3jbuiDSx8YZTR5emWe41XyJ6kBqlOCvL4EgqkfryH1DKWxCPdjvQaqXdseDJASso"/>
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-primary/50 backdrop-blur-md text-white text-label-sm px-3 py-1 rounded-full">Rare</span>
                <span className="bg-secondary-container/80 text-on-secondary-container text-label-sm px-3 py-1 rounded-full font-bold">Buy It Now</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-headline-md font-headline-md text-primary mb-1">Vanguard Chronograph</h3>
              <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">Horology &amp; Timepieces</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-headline-md font-bold text-secondary">$12,450.00</span>
                <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:opacity-90 transition-all">Buy Now</button>
              </div>
            </div>
          </div>
          {/* Product Card 2 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVvQTJvblhakNcDkUOVBOdPmzzQA0qcVrcPwZWa2RHJVkk9XNLFDlEsuzS9AdIpbGVDhZ1JxGt5wdsD8WRhkgxm6wzbtxSk6XqYOLTND5zHWRkb2qySluSHuWYfgYi3qF-XDsQ1TEdtkgE1fXmwCXmnP27dtvfS0uzh4QdX3X34oDGt8esJV_9aZ5A6QUQJEFQFGUBNOQCPPo3HVw2d_9UR8Yj7uHxn1EIY8Sgfe-F1QEw2Of92MLIfzMw6pTgNr8aR6HX9ULUKo8"/>
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-primary/50 backdrop-blur-md text-white text-label-sm px-3 py-1 rounded-full">High-end</span>
                <span className="bg-tertiary-fixed-dim/80 text-on-tertiary-fixed-variant text-label-sm px-3 py-1 rounded-full font-bold">Negotiation</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-headline-md font-headline-md text-primary mb-1">Azure Kinetic Canvas</h3>
              <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">Contemporary Art</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-headline-md font-bold text-secondary">$8,900.00</span>
                <button className="border-2 border-primary text-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary hover:text-on-primary transition-all">Negotiate</button>
              </div>
            </div>
          </div>
          {/* Product Card 3 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdVG4ffgk3XFs_AV8x-R_N5smQVAui2Yx4V-a5byhO1oZtRirqgtRbiz1emE_6LMks-eZ8nkmkLL5tPH6LlVnPBkSK5pQcSfShmbTGxUY_MNa3HwN2Y9oiOayp2OxIxvhRWEhGdAxfQthxfGyC2TCX-pcTtpXWHMepfWtrZ634JTbliYm9uqBv0YjTLTH8aED8L1CeA892BYZy4UBQkXptwuCu1XA7JWVozPY351pJpEg96ItodXJQvofek8B2kUu_5o1UmySX5zo"/>
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-primary/50 backdrop-blur-md text-white text-label-sm px-3 py-1 rounded-full">Rare</span>
                <span className="bg-on-primary-container/80 text-primary-fixed text-label-sm px-3 py-1 rounded-full font-bold">Best Offer</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-headline-md font-headline-md text-primary mb-1">17th Cent. Cartography</h3>
              <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">Antiques &amp; Collectibles</p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-label-sm text-on-surface-variant">Current Bid</span>
                  <span className="text-headline-md font-bold text-secondary">$3,200.00</span>
                </div>
                <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:opacity-90 transition-all">Place Bid</button>
              </div>
            </div>
          </div>
          {/* Product Card 4 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxRyVPeNcXcXvCnnzcGUDatTgdMyyiwa5UmnNzjm0z5zgwhffYKr_Gyh5KloKtVsXZDnm1MyXDFaoSvDV0imqvNW5-2u3yhEv-v151lTKc9JVmYSv3686xtKYutkdu0UEtCZupM5A1vYlvJuZjHROyaVTfdmKV_71h6pot4L-qMlsCXkGaWG6IFlQIt0UE9-oFso3xUFIq9gr1sRIrJ55A2SiifyWPuw-l-us4iVEVaoHeYXSkT02pfrMt3xtXPTZBElWXrJR3Py4"/>
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-surface-variant text-on-surface-variant text-label-sm px-3 py-1 rounded-full">Regular</span>
                <span className="bg-secondary-container/80 text-on-secondary-container text-label-sm px-3 py-1 rounded-full font-bold">Buy It Now</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-headline-md font-headline-md text-primary mb-1">Sonic Elite Headset</h3>
              <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">Audio &amp; Electronics</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-headline-md font-bold text-secondary">$1,200.00</span>
                <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:opacity-90 transition-all">Buy Now</button>
              </div>
            </div>
          </div>
          {/* Product Card 5 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqyeIdW8kHQ3Nryp-mVZSkeiVIiMolLozAqISFnPlHYcvjV9qjjcMQbHXXTtMh1yIiy1-0smfLDiE11BZUbvwX5rhKQG2Am145FEsP_bKxVgcFlARaCmwrkfe4R6a38Lg2Tcs5TFA15-iCTqLHBT_Y33a__y7-RsyRQPbZjLm12uClijaKTpFaPTm2mOQF5G7MCw-Psrgg0b87T2MFWGyzF_zZHie4LSnCJWMmRHsOx9IZ_aaCopRUB0V-3Ol2xqnZD79sbcMUgWI"/>
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-primary/50 backdrop-blur-md text-white text-label-sm px-3 py-1 rounded-full">High-end</span>
                <span className="bg-tertiary-fixed-dim/80 text-on-tertiary-fixed-variant text-label-sm px-3 py-1 rounded-full font-bold">Negotiation</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-headline-md font-headline-md text-primary mb-1">Optic Pro Series 7</h3>
              <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">Photography Gear</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-headline-md font-bold text-secondary">$4,500.00</span>
                <button className="border-2 border-primary text-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary hover:text-on-primary transition-all">Negotiate</button>
              </div>
            </div>
          </div>
          {/* Product Card 6 */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFBtXzFy7RelpNhBW9k5sFPRtON2Zz3lkafNXd87JvCAILfnRTIRRRbTpAY-Izh5DIeP344GAJWpIN-mhzbH7dW-v5EZc6kLe2zkZeGET7_H637eibfboI1Zvlt4ZrILBf53uS6hT3kSQ_4sHnTC89aDRr_5JKZ4kT2WedIdgLxD7Uz8vzCh4TP1IBihDFunTxnquce4h5JvqREZy9Jw6Tr3Q3emxaItB13txIv-QlGEcpC7cz0hEL6B-K2fQOLbgrAB3Skr2bEwM"/>
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <span className="bg-primary/50 backdrop-blur-md text-white text-label-sm px-3 py-1 rounded-full">Rare</span>
                <span className="bg-on-primary-container/80 text-primary-fixed text-label-sm px-3 py-1 rounded-full font-bold">Best Offer</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-headline-md font-headline-md text-primary mb-1">Apex Limited Runners</h3>
              <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">Streetwear &amp; Collectibles</p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-label-sm text-on-surface-variant">Highest Offer</span>
                  <span className="text-headline-md font-bold text-secondary">$750.00</span>
                </div>
                <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:opacity-90 transition-all">Make Offer</button>
              </div>
            </div>
          </div>
        </div>

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
          <p className="mt-4 text-label-sm text-on-surface-variant italic">Showing 6 of 142 items</p>
        </div>
      </main>
    </Layout>
  );
};

export default Browse;
