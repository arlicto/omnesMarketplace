import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useCartStore } from '../store/cartStore';
import apiClient from '../services/apiClient';
import { OrderResult } from '../types';

export const Checkout: React.FC = () => {
  const { items, summary, isLoading: cartLoading, fetchCart } = useCartStore();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<{ order_number: string; total_amount: number } | null>(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!cartLoading && items.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [items, cartLoading, navigate, orderSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');

    if (!shippingAddress.trim()) {
      setOrderError('Shipping address is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/orders', {
        shipping_address: `${fullName}, ${shippingAddress}, ${city}, ${postalCode}`,
        notes,
      });
      const data: OrderResult = response.data;
      setOrderSuccess(data.order);
      useCartStore.getState().fetchCart();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Order failed. Please try again.';
      setOrderError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (orderSuccess) {
    return (
      <Layout>
        <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
          <div className="max-w-lg mx-auto mt-16 text-center">
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-12 shadow-sm">
              <span className="material-symbols-outlined text-6xl text-secondary mb-4">check_circle</span>
              <h2 className="text-headline-lg font-headline-lg text-primary mb-2">Order Placed Successfully!</h2>
              <p className="text-body-md text-on-surface-variant mb-6">
                Order number: <span className="font-bold text-primary">{orderSuccess.order_number}</span>
              </p>
              <p className="text-headline-md font-headline-md text-secondary mb-8">
                Total: ${Number(orderSuccess.total_amount).toLocaleString()}
              </p>
              <Button className="w-full py-4" onClick={() => navigate('/browse')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <header className="mb-stack-lg">
          <h1 className="text-headline-xl font-headline-xl text-primary text-center">Checkout</h1>
        </header>

        {orderError && (
          <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg border border-error">
            {orderError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            <section className="space-y-gutter">
              <div className="bg-white rounded-xl border border-outline-variant p-8 shadow-sm">
                <h2 className="text-headline-md font-headline-md text-primary mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined">local_shipping</span> Shipping Address
                </h2>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <Input
                    label="Address Line 1"
                    placeholder="10 Rue de la Victoire"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      placeholder="Paris"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                    <Input
                      label="Postal Code"
                      placeholder="75009"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                  <Input label="Country" defaultValue="France" readOnly />
                </div>
              </div>

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

            <aside className="space-y-gutter">
              <div className="bg-surface-container-low rounded-xl border border-outline-variant p-8 sticky top-[100px]">
                <h2 className="text-headline-md font-headline-md text-primary mb-6">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-outline-variant/30">
                      <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                        {item.image_url && (
                          <img alt={item.name} src={item.image_url} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-primary">{item.name}</p>
                        <p className="text-label-sm text-on-surface-variant">Qty: {item.quantity} • ${Number(item.unit_price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between text-on-surface-variant pt-2">
                    <span>Subtotal</span>
                    <span className="font-bold text-on-surface">${summary.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="text-secondary font-bold">Free (Campus Pickup)</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Estimated Tax</span>
                    <span className="font-bold text-on-surface">${summary.tax.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-outline-variant pt-4 mt-4 flex justify-between items-end">
                    <span className="text-headline-sm font-headline-md text-primary">Total</span>
                    <span className="text-headline-sm font-headline-md text-primary">${summary.total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-4 mb-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></span>
                      Processing...
                    </span>
                  ) : (
                    'Complete Purchase'
                  )}
                </Button>
                <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-widest">
                  By clicking complete, you agree to our Terms of Sale
                </p>
              </div>
            </aside>
          </div>
        </form>
      </main>
    </Layout>
  );
};

const PaymentOption: React.FC<{ icon: string; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button type="button" className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
    active ? 'border-primary bg-primary-container/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
  }`}>
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-label-sm font-bold">{label}</span>
  </button>
);
