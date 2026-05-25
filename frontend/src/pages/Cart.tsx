import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { useCartStore } from '../store/cartStore';

export const Cart: React.FC = () => {
  const { items, summary, isLoading, error, fetchCart, removeItem, clearError } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemove = (itemId: number) => {
    removeItem(itemId);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading && items.length === 0) {
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
        <header className="mb-stack-lg">
          <h1 className="text-headline-xl font-headline-xl text-primary">Your Cart</h1>
          <p className="text-body-lg text-on-surface-variant">Review your selections before proceeding to secure checkout.</p>
        </header>

        {error && (
          <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg border border-error flex items-center justify-between">
            <span>{error}</span>
            <button onClick={clearError} className="ml-4 text-on-error-container hover:opacity-70">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="text-center py-stack-xl">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">shopping_cart</span>
            <h2 className="text-headline-lg font-headline-lg text-primary mb-2">Your cart is empty</h2>
            <p className="text-body-md text-on-surface-variant mb-6">Browse our catalog and add items you love.</p>
            <Link to="/browse">
              <Button>Browse Marketplace</Button>
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-gutter">
            <div className="flex-grow space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-outline-variant p-6 flex gap-6 hover:shadow-md transition-shadow group">
                  <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    <img
                      alt={item.name}
                      className="w-full h-full object-cover"
                      src={item.image_url || item.thumbnail_url || ''}
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-headline-sm font-headline-md text-primary">{item.name}</h3>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-on-surface-variant hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      {item.category_name && (
                        <p className="text-label-md text-secondary font-bold uppercase tracking-wider mt-1">{item.category_name}</p>
                      )}
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden opacity-50 cursor-not-allowed" title="Quantity editing coming soon">
                          <button disabled className="px-3 py-1 text-on-surface-variant">-</button>
                          <span className="px-4 font-bold">{item.quantity}</span>
                          <button disabled className="px-3 py-1 text-on-surface-variant">+</button>
                        </div>
                        <span className="text-label-sm text-on-surface-variant">In Stock</span>
                      </div>
                      <span className="text-headline-sm font-headline-md text-primary">${Number(item.line_total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="w-full lg:w-96">
              <div className="bg-surface-container-low rounded-xl border border-outline-variant p-8 sticky top-[100px]">
                <h2 className="text-headline-md font-headline-md text-primary mb-6">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="font-bold text-on-surface">${summary.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>VAT (20%)</span>
                    <span className="font-bold text-on-surface">${summary.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="text-secondary font-bold">Calculated at next step</span>
                  </div>
                  <div className="border-t border-outline-variant pt-4 mt-4 flex justify-between items-end">
                    <span className="text-headline-sm font-headline-md text-primary">Total</span>
                    <div className="text-right">
                      <p className="text-headline-sm font-headline-md text-primary">${summary.total.toLocaleString()}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Inclusive of all taxes</p>
                    </div>
                  </div>
                </div>
                <Button onClick={handleCheckout} className="w-full py-4 mb-4">Proceed to Checkout</Button>
                <Link to="/browse" className="block w-full text-center text-primary font-bold text-label-md hover:underline">Continue Shopping</Link>
                <div className="mt-8 pt-8 border-t border-outline-variant">
                  <p className="text-label-sm text-on-surface-variant flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    Secure Transaction with SSL Encryption
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </Layout>
  );
};

# 1779720139086753188
