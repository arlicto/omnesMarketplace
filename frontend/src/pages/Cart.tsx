import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <Layout>
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-desktop py-stack-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Cart Content */}
          <div className="lg:col-span-8 space-y-stack-lg">
            <div className="flex items-baseline gap-4">
              <h1 className="text-headline-xl font-headline-xl text-primary">Your Cart</h1>
              <span className="text-on-surface-variant text-body-lg">(4 items)</span>
            </div>

            {/* Immediate Purchases */}
            <section className="space-y-stack-md">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant">
                <span className="material-symbols-outlined text-primary">shopping_bag</span>
                <h2 className="text-headline-md font-headline-md text-primary">Immediate Purchases</h2>
              </div>
              <div className="space-y-4">
                {/* Item Row */}
                <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex gap-gutter group transition-all hover:shadow-md">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                    <img alt="Smart Watch" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzXie92uZZbqybGIoRIzP4V2zWWq__phDKEaitQycKFT6q14TKtLTfJHQXh1kIFXZRzu52q32LrVXa_c8LOf696FnfZjB3TywqjBcrE0zfZRyQqAHF14Hj4i6VaavrIkVZDa-yAHcgZqshuW-UxJAckZMeGULRZKptczkJ69KamoixL7pGVya3GPhm2Tgjf3wEzwfItU1gRYI6GRZ27qsBaPdFCEiiCgpNRwJ7i4_RGlFLO-lE2lBqdKaSfRQuPU6_3jMz1WxmFwQ"/>
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-label-sm font-label-sm text-secondary uppercase tracking-wider mb-1">Electronics</p>
                        <h3 className="text-headline-sm font-headline-md text-on-surface">Omnes Chronos Gen-5</h3>
                        <p className="text-body-md text-on-surface-variant">Silver Aluminum Case with White Sport Band</p>
                      </div>
                      <p className="text-headline-md font-headline-md text-primary">€299.00</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-outline-variant rounded-lg p-1">
                        <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95"><span className="material-symbols-outlined">remove</span></button>
                        <span className="px-4 font-bold text-primary">1</span>
                        <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95"><span className="material-symbols-outlined">add</span></button>
                      </div>
                      <button className="flex items-center gap-1 text-error font-medium hover:underline opacity-80 transition-opacity active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                        <span className="text-label-md">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
                {/* Item Row 2 */}
                <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex gap-gutter group transition-all hover:shadow-md">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                    <img alt="Premium Headphones" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDU3sa8mGPvBQGLfcb3z_en4o1FiVq3dMbC8gTUR9t2y4orri0hC9bBqBlmADrWAALG3L6XmAjrq1Zy_ctwKUOBg5Ra3etSZ7ppkJDxKifYziS1I6GrUFmifDaR6N79X_8zdUeu8jjvkvWJtYEdL5KoGDDSltI3npP7ELrEzKq8gYaf_PpJBxYyYUHT-AE19cYjpcB9YXGbxqFw6KSXHuOURM1flAMVnHO9zHBw_L3waZzYrXkQN9DxOwaN7t3Lhgmsptdg-rNDBoI"/>
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-label-sm font-label-sm text-secondary uppercase tracking-wider mb-1">Audio</p>
                        <h3 className="text-headline-sm font-headline-md text-on-surface">Omnes Soundscape Pro</h3>
                        <p className="text-body-md text-on-surface-variant">Midnight Black, Active Noise Cancellation</p>
                      </div>
                      <p className="text-headline-md font-headline-md text-primary">€349.00</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-outline-variant rounded-lg p-1">
                        <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95"><span className="material-symbols-outlined">remove</span></button>
                        <span className="px-4 font-bold text-primary">1</span>
                        <button className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors active:scale-95"><span className="material-symbols-outlined">add</span></button>
                      </div>
                      <button className="flex items-center gap-1 text-error font-medium hover:underline opacity-80 transition-opacity active:scale-95">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                        <span className="text-label-md">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Won Auctions */}
            <section className="space-y-stack-md">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant">
                <span className="material-symbols-outlined text-secondary">gavel</span>
                <h2 className="text-headline-md font-headline-md text-primary">Won Auctions</h2>
              </div>
              <div className="bg-surface-container-low p-stack-md rounded-xl border border-outline-variant flex gap-gutter relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-secondary text-on-secondary px-4 py-1 text-label-sm font-bold rounded-bl-lg">AUCTION WON</div>
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                  <img alt="Vintage Camera" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbNXNnq-O2c4LpJ1uFsvrHowCsD-g6hPdVw3JBvavD2Z8vN6wpylgys4bJDxPUecDgOAA5jwdQOCHCtLXCN7qB2wJXBhN5HFHy0mUfthKPn8Va2xBWCUcDu4IOKb986uZYVerd47uUDMYl-99Ngh2hjGe3NSeWWLwutd4LCr1X9dAW74_4c8hr6ENWXwy5-MChIj5OOHFZPcNVMuCX-VO23k9r1qZtolJJp_4iyoPHxILSijj9am5rMtpG2HdOAwkgh-sTSQ8Lj7Q"/>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-label-sm font-label-sm text-secondary uppercase tracking-wider mb-1">Collectibles</p>
                    <h3 className="text-headline-sm font-headline-md text-on-surface">1960 Heritage Leica-Inspired</h3>
                    <p className="text-body-md text-on-surface-variant">Final Winning Bid: Aug 12, 2024</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="bg-surface-container text-on-surface-variant px-3 py-1 rounded text-label-md">
                      Qty: 1 (Fixed)
                    </div>
                    <p className="text-headline-md font-headline-md text-primary">€1,250.00</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Successful Negotiations */}
            <section className="space-y-stack-md">
              <div className="flex items-center gap-2 pb-2 border-b border-outline-variant">
                <span className="material-symbols-outlined text-[#745c00]">handshake</span>
                <h2 className="text-headline-md font-headline-md text-primary">Successful Negotiations</h2>
              </div>
              <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant flex gap-gutter group border-l-4 border-l-secondary">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                  <img alt="Luxury Pen" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5mWOSZqPEZrHNP6M8LtmXsHR3qW239puzlQ9InKijgRpAZcPEQ_ZQBI8WOma9LkmhEy6tj18kAgBXAAj3NOmDUxzoO_EjiYSzlaXeZ0EIDbtOgge_8OCQYIBqGljMzcgMY4raZ5vMtXv4hXByTmkGBvQQfabSoHWmD9CPZuNzCQVd93Uy1YisJ-BGWNy4C_GzU75Jy6AsBg8V0lcek2Wr8ySM7WvB8gjAw5-YGfKNeViEgWfmqysWObQCu-94ViXD67Lwx4QIeNc"/>
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-label-sm font-label-sm text-secondary uppercase tracking-wider">Stationery</p>
                        <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold">OFFER ACCEPTED</span>
                      </div>
                      <h3 className="text-headline-sm font-headline-md text-on-surface">Executive Signature Pen</h3>
                      <p className="text-body-md text-on-surface-variant line-through text-[14px]">Original: €120.00</p>
                    </div>
                    <div className="text-right">
                      <p className="text-headline-md font-headline-md text-secondary">€85.00</p>
                      <p className="text-label-sm text-secondary-fixed-dim font-bold">You saved €35!</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-outline-variant rounded-lg p-1 opacity-50 cursor-not-allowed">
                      <button className="w-8 h-8 flex items-center justify-center"><span className="material-symbols-outlined">remove</span></button>
                      <span className="px-4 font-bold text-primary">1</span>
                      <button className="w-8 h-8 flex items-center justify-center"><span className="material-symbols-outlined">add</span></button>
                    </div>
                    <button className="flex items-center gap-1 text-error font-medium hover:underline opacity-80 active:scale-95">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                      <span className="text-label-md">Decline Deal</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-stack-md">
              <div className="bg-surface-container-high p-stack-lg rounded-xl border border-outline-variant shadow-lg">
                <h2 className="text-headline-md font-headline-md text-primary mb-stack-md border-b border-outline-variant pb-stack-sm">Order Summary</h2>
                <div className="space-y-4 mb-stack-lg">
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Immediate Subtotal</span>
                    <span className="font-medium">€648.00</span>
                  </div>
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Auction Items (1)</span>
                    <span className="font-medium">€1,250.00</span>
                  </div>
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Negotiated Items (1)</span>
                    <span className="font-medium">€85.00</span>
                  </div>
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Shipping Estimate</span>
                    <span className="text-secondary font-bold">FREE</span>
                  </div>
                  <div className="pt-4 border-t border-outline-variant">
                    <div className="flex justify-between items-baseline">
                      <span className="text-headline-sm font-bold text-primary">Total</span>
                      <span className="text-headline-lg font-headline-lg text-primary">€1,983.00</span>
                    </div>
                    <p className="text-label-sm text-on-surface-variant mt-1 text-right">VAT Included where applicable</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link to="/checkout" className="block text-center w-full bg-secondary text-on-secondary py-4 rounded-lg font-headline-md text-headline-sm hover:brightness-110 active:scale-95 transition-all shadow-md">
                    Proceed to Checkout
                  </Link>
                  <Link to="/browse" className="block text-center w-full border-2 border-primary text-primary py-4 rounded-lg font-bold hover:bg-primary hover:text-on-primary transition-all active:scale-95">
                    Continue Shopping
                  </Link>
                </div>
                <div className="mt-stack-md flex items-center justify-center gap-4 text-on-surface-variant">
                  <span className="material-symbols-outlined text-label-md">lock</span>
                  <span className="text-label-md">Secure SSL Encryption</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Cart;

# 1784485092683407809
