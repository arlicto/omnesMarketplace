import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const MakeOffer = () => {
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
            <h1 className="text-headline-xl font-headline-xl text-primary">Make an Offer</h1>
            <p className="text-body-lg text-on-surface-variant mt-1">Negotiate directly with sellers on premium items.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVvQTJvblhakNcDkUOVBOdPmzzQA0qcVrcPwZWa2RHJVkk9XNLFDlEsuzS9AdIpbGVDhZ1JxGt5wdsD8WRhkgxm6wzbtxSk6XqYOLTND5zHWRkb2qySluSHuWYfgYi3qF-XDsQ1TEdtkgE1fXmwCXmnP27dtvfS0uzh4QdX3X34oDGt8esJV_9aZ5A6QUQJEFQFGUBNOQCPPo3HVw2d_9UR8Yj7uHxn1EIY8Sgfe-F1QEw2Of92MLIfzMw6pTgNr8aR6HX9ULUKo8"/>
              <span className="absolute top-3 left-3 bg-tertiary-fixed-dim/80 text-on-tertiary-fixed-variant text-label-sm px-3 py-1 rounded-full font-bold">Negotiation</span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-headline-md font-headline-md text-primary mb-1">Azure Kinetic Canvas</h3>
              <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">Contemporary Art</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-headline-md font-bold text-secondary">€8,900.00</span>
                <button className="border-2 border-primary text-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary hover:text-on-primary transition-all">Make Offer</button>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqyeIdW8kHQ3Nryp-mVZSkeiVIiMolLozAqISFnPlHYcvjV9qjjcMQbHXXtTMh1yIiy1-0smfLDiE11BZUbvwX5rhKQG2Am145FEsP_bKxVgcFlARaCmwrkfe4R6a38Lg2Tcs5TFA15-iCTqLHBT_Y33a__y7-RsyRQPbZjLm12uClijaKTpFaPTm2mOQF5G7MCw-Psrgg0b87T2MFWGyzF_zZHie4LSnCJWMmRHsOx9IZ_aaCopRUB0V-3Ol2xqnZD79sbcMUgWI"/>
              <span className="absolute top-3 left-3 bg-tertiary-fixed-dim/80 text-on-tertiary-fixed-variant text-label-sm px-3 py-1 rounded-full font-bold">Negotiation</span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-headline-md font-headline-md text-primary mb-1">Optic Pro Series 7</h3>
              <p className="text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider">Photography Gear</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-headline-md font-bold text-secondary">€4,500.00</span>
                <button className="border-2 border-primary text-primary px-4 py-2 rounded-lg font-label-md hover:bg-primary hover:text-on-primary transition-all">Make Offer</button>
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
          <p className="mt-4 text-label-sm text-on-surface-variant italic">Showing 2 of 36 items</p>
        </div>
      </main>
    </Layout>
  );
};

export default MakeOffer;
