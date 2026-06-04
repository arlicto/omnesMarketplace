import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { getProduct, type Product as ProductType } from '../lib/api';

const Product = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('buy');
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImgSrc, setMainImgSrc] = useState('');

  useEffect(() => {
    const productId = searchParams.get('id');
    if (!productId) {
      setError('Product ID is required');
      setLoading(false);
      return;
    }

    getProduct(productId)
      .then((data) => {
        setProduct(data);
        setMainImgSrc(data.image);
        // Set active tab based on product type
        if (data.type === 'buy_now') setActiveTab('buy');
        else if (data.type === 'negotiation') setActiveTab('offer');
        else if (data.type === 'auction') setActiveTab('auction');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load product');
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        {loading && (
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
        {product && (
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-label-md font-label-md text-on-surface-variant mb-stack-lg">
              <a className="hover:text-primary transition-colors" href="/">Home</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <a className="hover:text-primary transition-colors" href="/browse">Browse All</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-bold">{product.name}</span>
            </nav>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              {/* Gallery Section (Left) */}
              <div className="lg:col-span-7">
                <div className="bg-surface-container-lowest rounded-xl p-stack-sm shadow-sm border border-outline-variant mb-gutter">
                  <img 
                    alt={product.name} 
                    className="w-full aspect-square object-cover rounded-lg transition-all duration-300" 
                    id="main-image" 
                    src={mainImgSrc} 
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <button 
                    className={`thumbnail-btn border-2 rounded-lg overflow-hidden bg-surface-container ${mainImgSrc === product.image ? 'border-primary' : 'border-transparent hover:border-outline-variant'}`}
                    onClick={() => setMainImgSrc(product.image)}
                  >
                    <img alt="Thumbnail 1" className="w-full h-24 object-cover" src={product.image} />
                  </button>
                </div>
              </div>
              {/* Details & Actions Section (Right) */}
              <div className="lg:col-span-5 flex flex-col space-y-gutter">
                {/* Product Identity */}
                <div className="space-y-stack-sm">
                  <div className="flex justify-between items-start">
                    <h1 className="font-headline-lg text-headline-lg text-primary">{product.name}</h1>
                    <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-md">{product.category}</span>
                  </div>
                  <p className="text-label-md text-on-surface-variant font-label-md">Product ID: #{product.id}</p>
                  <div className="text-headline-xl font-headline-xl text-secondary mt-2">€{Number(product.price).toFixed(2)}</div>
                  <div className="py-stack-md border-y border-outline-variant space-y-stack-sm">
                    <h3 className="font-headline-md text-body-lg text-on-surface">Description</h3>
                    <p className="text-body-md text-on-surface-variant">{product.description}</p>
                    <p className="text-body-md text-bold text-on-surface pt-2">Condition: <span className="font-normal text-on-surface-variant">Excellent / Like New</span></p>
                  </div>
                </div>
                {/* Seller Card */}
                <div className="flex items-center p-stack-md bg-surface-container-low rounded-xl border border-outline-variant space-x-stack-md shadow-sm">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-outline bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-primary">person</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-body-lg font-bold text-primary">Seller ID: {product.seller_id}</p>
                    <div className="flex items-center text-secondary">
                      <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 0.5"}}>star_half</span>
                      <span className="text-label-md text-on-surface-variant ml-2">4.5/5 (234 sales)</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-label-md font-label-md border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all">Contact</button>
                </div>
                {/* Tabs for Action Panels */}
                <div className="bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden">
                  <div className="flex border-b border-outline-variant bg-surface-container-low">
                    {product.type === 'buy_now' && (
                      <button 
                        className="flex-1 py-4 text-label-md transition-all font-bold text-primary border-b-2 border-primary bg-surface-container-lowest"
                      >BUY NOW</button>
                    )}
                    {product.type === 'negotiation' && (
                      <button 
                        className="flex-1 py-4 text-label-md transition-all font-bold text-primary border-b-2 border-primary bg-surface-container-lowest"
                      >NEGOTIATE</button>
                    )}
                    {product.type === 'auction' && (
                      <button 
                        className="flex-1 py-4 text-label-md transition-all font-bold text-primary border-b-2 border-primary bg-surface-container-lowest"
                      >AUCTION</button>
                    )}
                  </div>
                  {/* Buy It Now Panel */}
                  {activeTab === 'buy' && (
                    <div className="p-6 space-y-gutter">
                      <div className="flex items-center space-x-gutter">
                        <div className="flex items-center border border-outline rounded-lg">
                          <button className="px-3 py-2 text-primary hover:bg-surface-variant">-</button>
                          <span className="px-4 font-bold">1</span>
                          <button className="px-3 py-2 text-primary hover:bg-surface-variant">+</button>
                        </div>
                        <button className="flex-1 py-3 bg-surface-container border border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all">Add to Cart</button>
                      </div>
                      <button className="w-full py-4 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-on-secondary-container transition-all">Buy Now — €{Number(product.price).toFixed(2)}</button>
                      <p className="text-label-sm text-center text-on-surface-variant italic">Fast &amp; Secure Shipping</p>
                    </div>
                  )}
                  {/* Negotiation Panel */}
                  {activeTab === 'offer' && (
                    <div className="p-6 space-y-stack-md">
                      <div className="bg-surface-container p-stack-md rounded-lg space-y-2">
                        <h4 className="text-label-md font-bold text-on-surface">Offer History</h4>
                        <div className="text-label-sm space-y-1">
                          <p className="text-on-surface-variant">No offers yet</p>
                        </div>
                      </div>
                      <div className="space-y-stack-sm">
                        <label className="text-label-sm font-bold text-primary uppercase">New Proposed Price</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">€</span>
                          <input className="w-full pl-10 pr-4 py-3 border border-outline rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="Enter your offer" type="number"/>
                        </div>
                      </div>
                      <button className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all">Submit Offer</button>
                      <p className="text-[11px] leading-tight text-on-surface-variant">By submitting, you agree to fulfill the payment if the seller accepts. Offers are binding for 24 hours.</p>
                    </div>
                  )}
                  {/* Auction Panel */}
                  {activeTab === 'auction' && (
                    <div className="p-6 space-y-gutter">
                      <div className="flex justify-between items-center bg-error-container p-stack-md rounded-lg text-on-error-container">
                        <span className="text-label-md font-bold uppercase">Ends in:</span>
                        <span className="font-mono text-body-lg font-bold">02d : 05h : 30m</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-outline-variant pb-stack-sm">
                        <span className="text-label-md text-on-surface-variant">Starting Bid</span>
                        <span className="text-headline-md font-bold text-secondary">€{Number(product.price).toFixed(2)}</span>
                      </div>
                      <div className="space-y-stack-sm">
                        <label className="text-label-sm font-bold text-primary uppercase">Max Bid</label>
                        <input className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder={`Enter bid higher than €${Number(product.price).toFixed(2)}`} type="number"/>
                      </div>
                      <button className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all">Place Bid</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </Layout>
  );
};

export default Product;

# 1780078686976288184
