import { useState } from 'react';
import Layout from '../components/Layout';

const Checkout = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      alert('Delivery Information Saved! Transitioning to Payment step...');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex-grow w-full">
        {/* Step Progress */}
        <div className="mb-stack-lg flex items-center justify-center space-x-4 md:space-x-8">
          <div className="flex items-center group">
            <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-md mr-2">1</span>
            <span className="text-label-md font-bold text-primary">Delivery Info</span>
          </div>
          <div className="h-[2px] w-8 md:w-16 bg-outline-variant"></div>
          <div className="flex items-center opacity-40">
            <span className="w-8 h-8 rounded-full bg-surface-variant text-on-surface flex items-center justify-center font-bold text-label-md mr-2">2</span>
            <span className="text-label-md font-medium text-on-surface">Payment</span>
          </div>
          <div className="h-[2px] w-8 md:w-16 bg-outline-variant"></div>
          <div className="flex items-center opacity-40">
            <span className="w-8 h-8 rounded-full bg-surface-variant text-on-surface flex items-center justify-center font-bold text-label-md mr-2">3</span>
            <span className="text-label-md font-medium text-on-surface">Confirmation</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Left Column: Checkout Form */}
          <section className="lg:col-span-8">
            <div className="bg-surface-container-lowest p-stack-lg rounded-xl shadow-sm border border-outline-variant">
              <h1 className="font-headline-lg text-headline-lg text-primary mb-stack-lg">Delivery Information</h1>
              
              <form className="space-y-stack-md" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
                  <div className="flex flex-col space-y-2 focus-within:scale-[1.01] transition-transform">
                    <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="first-name">First Name</label>
                    <input className="p-3 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all" id="first-name" placeholder="John" type="text" required />
                  </div>
                  <div className="flex flex-col space-y-2 focus-within:scale-[1.01] transition-transform">
                    <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="last-name">Last Name</label>
                    <input className="p-3 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all" id="last-name" placeholder="Doe" type="text" required />
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 focus-within:scale-[1.01] transition-transform">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="address-1">Address Line 1</label>
                  <input className="p-3 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all" id="address-1" placeholder="123 Luxury Avenue" type="text" required />
                </div>
                
                <div className="flex flex-col space-y-2 focus-within:scale-[1.01] transition-transform">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="address-2">Address Line 2 (Optional)</label>
                  <input className="p-3 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all" id="address-2" placeholder="Suite 405" type="text" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                  <div className="flex flex-col space-y-2 focus-within:scale-[1.01] transition-transform">
                    <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="city">City</label>
                    <input className="p-3 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all" id="city" placeholder="Paris" type="text" required />
                  </div>
                  <div className="flex flex-col space-y-2 focus-within:scale-[1.01] transition-transform">
                    <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="postal">Postal Code</label>
                    <input className="p-3 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all" id="postal" placeholder="75001" type="text" required />
                  </div>
                  <div className="flex flex-col space-y-2 focus-within:scale-[1.01] transition-transform">
                    <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="country">Country</label>
                    <select className="p-3 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all appearance-none cursor-pointer" id="country" required>
                      <option value="fr">France</option>
                      <option value="uk">United Kingdom</option>
                      <option value="us">United States</option>
                      <option value="de">Germany</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 focus-within:scale-[1.01] transition-transform">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="phone">Phone Number</label>
                  <input className="p-3 border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all" id="phone" placeholder="+33 6 00 00 00 00" type="tel" required />
                </div>
                
                <div className="pt-stack-md">
                  <button 
                    className="w-full md:w-auto px-10 py-4 bg-primary text-on-primary font-bold rounded-lg shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Payment</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Right Column: Order Summary Sidebar */}
          <aside className="lg:col-span-4 space-y-stack-md">
            <div className="bg-surface-container-high p-stack-md rounded-xl border border-outline-variant sticky top-24">
              <h2 className="font-headline-md text-headline-md text-primary mb-stack-md">Order Summary</h2>
              
              {/* Items */}
              <div className="space-y-4 mb-stack-md">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant">
                    <img alt="Product 1" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4tqH1YqFNkIYmsUl3jIsrCRYi9V6U77VnsA58j4e5sSuYGDUyD4YWXMaq3fTHcYodNz688Cmg_h8B7K5jxuXJf5D-ITTgLqHHmssTHhS4rOUmpK5Kjb5oGP51GxTldg2h-FjVcGf7H9iam504UGUGAePSCqYUZnjWua8cwH_Aq-xaE5q4clRVoamvG5rrRoSaXRNLL36gLjGWKAf8LOYet8D5mtxN4-HCLGaf_Om4VG8BK3wD31RQdo2hgVgKYytMAWzLw4sHuUw"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md font-bold text-primary truncate">Chrono Classic Watch</p>
                    <p className="text-label-sm text-on-surface-variant">Qty: 1</p>
                  </div>
                  <p className="text-label-md font-bold text-secondary">€249.00</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-outline-variant">
                    <img alt="Product 2" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0iLAr_APT8ofARPJBjrX_nD26TTpww4CZtCd2ZmHizxL8XFRmqIyjo7sfNqYF7RbGEMsZbi1jtM4w_8jvN4p-_fZOasAFxNh95nWSlDPbCDXYVDq9Z7MqkmbG9SkzkYAqZ8S_odxwU0j1pXASIhdcbEPh03Gr_OqxOVvKdCyvnrY63iyqucHFCHK4AV_gTTD6eO7OpfRKufWZdC2x474GWa2K2LW2Hjgx3o-Nw3sQ8-eVBu1yAiJp_qr9n4zALdMEjiiPBZUuE9I"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-body-md font-bold text-primary truncate">Aero Max Sneakers</p>
                    <p className="text-label-sm text-on-surface-variant">Qty: 1</p>
                  </div>
                  <p className="text-label-md font-bold text-secondary">€120.00</p>
                </div>
              </div>
              
              {/* Totals */}
              <div className="border-t border-outline-variant pt-stack-md space-y-2">
                <div className="flex justify-between text-body-md text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>€369.00</span>
                </div>
                <div className="flex justify-between text-body-md text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-headline-md font-bold text-primary pt-2">
                  <span>Total</span>
                  <span>€369.00</span>
                </div>
              </div>
              
              <div className="mt-stack-md bg-white/50 p-3 rounded-lg border border-dashed border-outline text-label-sm text-on-surface-variant flex items-center space-x-2">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Secure checkout with 256-bit SSL encryption</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
};

export default Checkout;
