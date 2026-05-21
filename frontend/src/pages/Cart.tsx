import React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';

const CART_ITEMS = [
  {
    id: '1',
    name: 'Titan Precision Watch',
    price: 1249,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiQTRBcJI1Tms5soZInV1SgXzmG6ZjC36fA65Ab_GOCsS1ar_rqbyql0KC_FEG6FDl0HRZ4IROxddg794mEJfS7AL6wDOgFNlB1dsZYApvwLXddsYuBerH9MGAHQZwQdJCd5pMK-95B1gF3Iky-FmkEypPTfWzrXX2nlQsMrZjhcNkexv4r1uqWz3pcoA_hNLiMFWLELgb8a7QbFD4Kw-Vn1j8hWqmf-xWZDHXJB23_ITT5qeKmSl3-Nu_EEdQvSwx3efkTioDexQ',
    category: 'High-end'
  },
  {
    id: '2',
    name: 'Studio Pro Audio',
    price: 499,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBFm2m6Opn8_fQhxcyMYPtX70IrKtF7z4xy7-W2O96VvWhCheZyUZLzVp83qc3KNvgk2g7YO5stybuBiI3L3hq1M6fP1trOgb9r_77qyv6Z2jyBaVChfYDXwLVYp9VmEC3Cc6GWBUAmBNY74j0hNaetkpON0lyKFtYFxFy70ipH3HFTC309KczGlea6pwD5ts7tTmnS5HzvtiVVTrkEk_r2Si913p1wbqgVcr6Jqbr9f_YTJXVuQsZwyQcLNBDh-EngP5Z7nuJ1hw',
    category: 'Rare'
  }
];

export const Cart: React.FC = () => {
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.2;
  const total = subtotal + tax;

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <header className="mb-stack-lg">
          <h1 className="text-headline-xl font-headline-xl text-primary">Your Cart</h1>
          <p className="text-body-lg text-on-surface-variant">Review your selections before proceeding to secure checkout.</p>
        </header>

        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* Cart Items List */}
          <div className="flex-grow space-y-4">
            {CART_ITEMS.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-outline-variant p-6 flex gap-6 hover:shadow-md transition-shadow group">
                <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                  <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                </div>
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-headline-sm font-headline-md text-primary">{item.name}</h3>
                      <button className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <p className="text-label-md text-secondary font-bold uppercase tracking-wider mt-1">{item.category}</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                        <button className="px-3 py-1 hover:bg-surface-container transition-colors">-</button>
                        <span className="px-4 font-bold">1</span>
                        <button className="px-3 py-1 hover:bg-surface-container transition-colors">+</button>
                      </div>
                      <span className="text-label-sm text-on-surface-variant">In Stock</span>
                    </div>
                    <span className="text-headline-sm font-headline-md text-primary">${item.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="w-full lg:w-96">
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-8 sticky top-[100px]">
              <h2 className="text-headline-md font-headline-md text-primary mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-bold text-on-surface">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>VAT (20%)</span>
                  <span className="font-bold text-on-surface">${tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="text-secondary font-bold">Calculated at next step</span>
                </div>
                <div className="border-t border-outline-variant pt-4 mt-4 flex justify-between items-end">
                  <span className="text-headline-sm font-headline-md text-primary">Total</span>
                  <div className="text-right">
                    <p className="text-headline-sm font-headline-md text-primary">${total.toLocaleString()}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>
              <Button className="w-full py-4 mb-4">Proceed to Checkout</Button>
              <button className="w-full text-primary font-bold text-label-md hover:underline">Continue Shopping</button>
              <div className="mt-8 pt-8 border-t border-outline-variant">
                <p className="text-label-sm text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span> 
                  Secure Transaction with SSL Encryption
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
};
