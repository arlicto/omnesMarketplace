import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const PlaceBid = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <div className="flex items-center gap-4 mb-stack-lg">
          <Link to="/browse" className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">arrow_back</Link>
          <div>
            <h1 className="text-headline-xl font-headline-xl text-primary">Place a Bid</h1>
            <p className="text-body-lg text-on-surface-variant mt-1">Live auctions and best-offer listings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdVG4ffgk3XFs_AV8x-R_N5smQVAui2Yx4V-a5byhO1oZtRirqgtRbiz1emE_6LMks-eZ8nkmkLL5tPH6LlVnPBkSK5pQcSfShmbTGxUY_MNa3HwN2Y9oiOayp2OxIxvhRWEhGdAxfQthxfGyC2TCX-pcTtpXWHMepfWtrZ634JTbliYm9uqBv0YjTLTH8aED8L1CeA892BYZy4UBQkXptwuCu1XA7JWVozPY351pJpEg96ItodXJQvofek8B2kUu_5o1UmySX5zo"/>
              <span className="absolute top-3 left-3 bg-on-primary-container/80 text-primary-fixed text-label-sm px-3 py-1 rounded-full font-bold">Best Offer</span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-headline-md font-headline-md text-primary mb-1">17th Cent. Cartography</h3>
              <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">Antiques &amp; Collectibles</p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-label-sm text-on-surface-variant">Current Bid</span>
                  <span className="text-headline-md font-bold text-secondary">€3,200.00</span>
                </div>
                <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:opacity-90 transition-all">Place Bid</button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFBtXzFy7RelpNhBW9k5sFPRtON2Zz3lkafNXd87JvCAILfnRTIRRRbTpAY-Izh5DIeP344GAJWpIN-mhzbH7dW-v5EZc6kLe2zkZeGET7_H637eibfboI1Zvlt4ZrILBf53uS6hT3kSQ_4sHnTC89aDRr_5JKZ4kT2WedIdgLxD7Uz8vzCh4TP1IBihDFunTxnquce4h5JvqREZy9Jw6Tr3Q3emxaItB13txIv-QlGEcpC7cz0hEL6B-K2fQOLbgrAB3Skr2bEwM"/>
              <span className="absolute top-3 left-3 bg-on-primary-container/80 text-primary-fixed text-label-sm px-3 py-1 rounded-full font-bold">Best Offer</span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-headline-md font-headline-md text-primary mb-1">Apex Limited Runners</h3>
              <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">Streetwear &amp; Collectibles</p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-label-sm text-on-surface-variant">Highest Offer</span>
                  <span className="text-headline-md font-bold text-secondary">€750.00</span>
                </div>
                <button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md hover:opacity-90 transition-all">Make Offer</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-stack-lg flex flex-col items-center">
          <button
            className="group relative px-8 py-3 bg-surface-container border border-outline-variant rounded-full text-label-md font-bold text-primary hover:bg-primary hover:text-on-primary transition-all duration-300"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
          <p className="mt-4 text-label-sm text-on-surface-variant italic">Showing 2 of 58 items</p>
        </div>
      </main>
    </Layout>
  );
};

export default PlaceBid;

# 1787163487069763485
