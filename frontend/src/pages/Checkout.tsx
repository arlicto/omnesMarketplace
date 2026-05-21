import React from 'react';
import { Layout } from '../components/Layout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const Checkout: React.FC = () => {
  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <header className="mb-stack-lg">
          <h1 className="text-headline-xl font-headline-xl text-primary text-center">Checkout</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {/* Shipping & Payment Info */}
          <section className="space-y-gutter">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-outline-variant p-8 shadow-sm">
              <h2 className="text-headline-md font-headline-md text-primary mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined">local_shipping</span> Shipping Address
              </h2>
              <div className="space-y-4">
                <Input label="Full Name" placeholder="John Doe" />
                <Input label="Address Line 1" placeholder="10 Rue de la Victoire" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="City" placeholder="Paris" />
                  <Input label="Postal Code" placeholder="75009" />
                </div>
                <Input label="Country" defaultValue="France" readOnly />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-outline-variant p-8 shadow-sm">
              <h2 className="text-headline-md font-headline-md text-primary mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined">payments</span> Payment Method
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <PaymentOption icon="credit_card" label="Credit Card" active />
                  <PaymentOption icon="account_balance" label="Bank Transfer" />
                </div>
                <div className="space-y-4">
                  <Input label="Card Number" placeholder="0000 0000 0000 0000" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiry Date" placeholder="MM/YY" />
                    <Input label="CVV" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <aside className="space-y-gutter">
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-8 sticky top-[100px]">
              <h2 className="text-headline-md font-headline-md text-primary mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex gap-4 pb-4 border-b border-outline-variant/30">
                  <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                    <img alt="Product" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiQTRBcJI1Tms5soZInV1SgXzmG6ZjC36fA65Ab_GOCsS1ar_rqbyql0KC_FEG6FDl0HRZ4IROxddg794mEJfS7AL6wDOgFNlB1dsZYApvwLXddsYuBerH9MGAHQZwQdJCd5pMK-95B1gF3Iky-FmkEypPTfWzrXX2nlQsMrZjhcNkexv4r1uqWz3pcoA_hNLiMFWLELgb8a7QbFD4Kw-Vn1j8hWqmf-xWZDHXJB23_ITT5qeKmSl3-Nu_EEdQvSwx3efkTioDexQ" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-primary">Titan Precision Watch</p>
                    <p className="text-label-sm text-on-surface-variant">Qty: 1 • $1,249.00</p>
                  </div>
                </div>
                
                <div className="flex justify-between text-on-surface-variant pt-2">
                  <span>Subtotal</span>
                  <span className="font-bold text-on-surface">$1,249.00</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="text-secondary font-bold">Free (Campus Pickup)</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-on-surface">$249.80</span>
                </div>
                
                <div className="border-t border-outline-variant pt-4 mt-4 flex justify-between items-end">
                  <span className="text-headline-sm font-headline-md text-primary">Total</span>
                  <span className="text-headline-sm font-headline-md text-primary">$1,498.80</span>
                </div>
              </div>
              
              <Button className="w-full py-4 mb-4">Complete Purchase</Button>
              <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest">
                By clicking complete, you agree to our Terms of Sale
              </p>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
};

const PaymentOption: React.FC<{ icon: string, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <button className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
    active ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
  }`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-label-sm font-bold">{label}</span>
  </button>
);
