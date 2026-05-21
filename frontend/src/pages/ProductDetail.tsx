import React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

const RELATED_PRODUCTS: Product[] = [
  { id: '4', name: 'Leather Portfolio', price: 185, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxkqrD_jf2GesDZAyU1BLidgV0y33BbH5L_1jdB7D5XjgdC-Z2tTsC0IcM-ldXRBYS866DQjZycoMsLHPSwmMJ_n8JFkOoiFnjCo9CPY_Er_DpEIokEUTJiReV1wmEeOAeR6bUVLCTJTKKs8lLqqx6oifhopYcQO6iuCfXCseTF40bhCqn5jVm1UXzocIKlA9KBEUrHVYceZHfDqMLiwBUI-RS18bJKB9CY-EVcA0zQRm6VSGlK62wnzUSsRzwzrcAc3gUVDgL31U', category: 'Regular', type: 'Buy Now' },
  { id: '5', name: 'Vintage Camera', price: 950, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKjcKOwDjRMh8YMFCpiqypfgxX8u3ycBjsCzbGzouzbXVGMPItVqxDefwCBYoXe_PBI0skqFOwtoelahTMSPXidb8yc9coLYPXwATLrJUvyCxP6yb9U6n5esXpC7Y2Swa5eHxcaVcE1fN716X86G5b7w73OjeB1merTV5RyatiNagIdwaQ_hQsiSMM-Kl_eaQDMjGtY-l7DRNYpHurGPzqunQpAyUlpg-85F-aGu5D4gnqb99lk0CBckB6GK47zNQsSfc6_YmzCvQ', category: 'High-end', type: 'Negotiation' }
];

export const ProductDetail: React.FC = () => {
  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-stack-md">
          <a href="/browse" className="hover:text-primary">Browse All</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-bold">Luxury Watch Detail</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-stack-lg">
          {/* Product Gallery */}
          <section className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant shadow-sm">
              <img 
                alt="Main Product" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiQTRBcJI1Tms5soZInV1SgXzmG6ZjC36fA65Ab_GOCsS1ar_rqbyql0KC_FEG6FDl0HRZ4IROxddg794mEJfS7AL6wDOgFNlB1dsZYApvwLXddsYuBerH9MGAHQZwQdJCd5pMK-95B1gF3Iky-FmkEypPTfWzrXX2nlQsMrZjhcNkexv4r1uqWz3pcoA_hNLiMFWLELgb8a7QbFD4Kw-Vn1j8hWqmf-xWZDHXJB23_ITT5qeKmSl3-Nu_EEdQvSwx3efkTioDexQ" 
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Thumbnail active />
              <Thumbnail />
              <Thumbnail />
              <Thumbnail />
            </div>
          </section>

          {/* Product Info */}
          <section className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">High-end</span>
                <span className="text-label-sm text-on-surface-variant">Ref: #TW-2024-X82</span>
              </div>
              <h1 className="text-headline-xl font-headline-xl text-primary mb-2">Titan Precision Chronograph</h1>
              <p className="text-body-lg text-on-surface-variant">A masterwork of horological excellence, featuring a sapphire crystal face and custom movement for the distinguished collector.</p>
            </div>

            <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant mb-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase mb-1">Price</p>
                  <p className="text-headline-xl font-headline-xl text-secondary">$1,249.00</p>
                </div>
                <div className="text-right">
                  <p className="text-label-sm text-on-surface-variant mb-1">Status</p>
                  <p className="text-label-md font-bold text-primary flex items-center gap-1 justify-end">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span> Available Now
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="flex-grow py-4">Add to Cart</Button>
                <Button variant="outline" className="flex-grow py-4">Make an Offer</Button>
              </div>
            </div>

            <div className="space-y-6">
              <CollapsibleSection title="Specifications">
                <ul className="grid grid-cols-2 gap-4 text-body-md">
                  <li><span className="text-on-surface-variant">Movement:</span> Automatic</li>
                  <li><span className="text-on-surface-variant">Case:</span> 42mm Titanium</li>
                  <li><span className="text-on-surface-variant">Water Resistance:</span> 100m</li>
                  <li><span className="text-on-surface-variant">Warranty:</span> 2 Years</li>
                </ul>
              </CollapsibleSection>
              <CollapsibleSection title="Shipping & Returns">
                <p className="text-body-md text-on-surface-variant">Secure campus delivery available within 24 hours. Free returns within 7 days for verified items in original condition.</p>
              </CollapsibleSection>
            </div>
          </section>
        </div>

        {/* Related Products */}
        <section className="pt-stack-lg border-t border-outline-variant">
          <h2 className="text-headline-lg font-headline-lg text-primary mb-stack-md">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {RELATED_PRODUCTS.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
};

const Thumbnail: React.FC<{ active?: boolean }> = ({ active }) => (
  <div className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
    active ? 'border-primary' : 'border-transparent hover:border-outline-variant'
  }`}>
    <div className="w-full h-full bg-surface-container"></div>
  </div>
);

const CollapsibleSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-b border-outline-variant pb-4">
    <button className="w-full flex justify-between items-center py-2 text-headline-sm font-headline-md text-primary">
      {title}
      <span className="material-symbols-outlined">expand_more</span>
    </button>
    <div className="mt-2">
      {children}
    </div>
  </div>
);
