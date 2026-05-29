import { useState } from 'react';
import Layout from '../components/Layout';

const Product = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [mainImgSrc, setMainImgSrc] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuB16_tgwjl2NrhismXmSj1-iFoB__V-Z6CYjRdHmMttSJ4I9oG18AyWtrC3hW-8sopViENGb-6sapGfhvzNVzwZ4yGCRC0iiGJJBJmzkGZk2S8KTf-o3Ta3Y43v6HFvL2AoBiJ2rufj0vTzDpzbFgPz5NXAhUflS1ugBb1T5YHqQGoxYHs4KEtlfxoHtct-ElEeoWM8qfAt4HutYVwAxixnb055Q8Y_z0hTB-U-7NtoVYNDr8ftUXNYhTAIyoqRrQ-w6auZTHBs7F0');

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-label-md font-label-md text-on-surface-variant mb-stack-lg">
          <a className="hover:text-primary transition-colors" href="#">Home</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <a className="hover:text-primary transition-colors" href="#">Browse All</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <a className="hover:text-primary transition-colors" href="#">High-end</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-bold">Luxury Watch</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Gallery Section (Left) */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-lowest rounded-xl p-stack-sm shadow-sm border border-outline-variant mb-gutter">
              <img 
                alt="Luxury Watch Main View" 
                className="w-full aspect-square object-cover rounded-lg transition-all duration-300" 
                id="main-image" 
                src={mainImgSrc} 
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <button 
                className={`thumbnail-btn border-2 rounded-lg overflow-hidden bg-surface-container ${mainImgSrc.includes('AB6AXuBnmOw') ? 'border-primary' : 'border-transparent hover:border-outline-variant'}`}
                onClick={() => setMainImgSrc('https://lh3.googleusercontent.com/aida-public/AB6AXuBnmOwgWcwsOrpeSJ_9xXGCeciET-xskZbiVjwslNBxe6iwwfm5vUCyhnrUEDcNl_Pqv0OvC3RKOj0Bwp0Nus5bftShK5bX66PmU4yXv4NfPmSR6Qisy1bq1GI92_Z4DfXjJdZFXvgxlIxFVSLwwNjf7zriQ5uZJoi-Y9Awvw5U0itpimlrVrbo2nRChOQmHj6yHh6lResiR2LLVWPW52Jm5zY3zGJDPRxdJ1Q6YprVPbhoBf4mldGDYCCqAT54U3mQAdNoQXWXb0w')}
              >
                <img alt="Thumbnail 1" className="w-full h-24 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnmOwgWcwsOrpeSJ_9xXGCeciET-xskZbiVjwslNBxe6iwwfm5vUCyhnrUEDcNl_Pqv0OvC3RKOj0Bwp0Nus5bftShK5bX66PmU4yXv4NfPmSR6Qisy1bq1GI92_Z4DfXjJdZFXvgxlIxFVSLwwNjf7zriQ5uZJoi-Y9Awvw5U0itpimlrVrbo2nRChOQmHj6yHh6lResiR2LLVWPW52Jm5zY3zGJDPRxdJ1Q6YprVPbhoBf4mldGDYCCqAT54U3mQAdNoQXWXb0w"/>
              </button>
              <button 
                className={`thumbnail-btn border-2 rounded-lg overflow-hidden bg-surface-container ${mainImgSrc.includes('AB6AXuCfAC2') ? 'border-primary' : 'border-transparent hover:border-outline-variant'}`}
                onClick={() => setMainImgSrc('https://lh3.googleusercontent.com/aida-public/AB6AXuCfAC2U6PEJC5l2wsiRW-TOalga_H_bBpRrcGHiDMUi2lCSeV7OJ_OJ8oH3WkwL_bWeGi_aWQdpZ1vOIDXnD_V54HeKJ3HVwWGk_CwD0RNOeEQNWoKZe3v4DdEPXVjzSdYmhAv7eamS9zu0clu_spb8-T30kIxowpyRBKUSHex03UFL1haIdKqAsEcHarK0leERrxbqIXQjkLimJmZV4_RRSJYY8uAnX40oYGU8FjFKrWHXeuZf7dfrLmKsVi3Xjg9HaGXkI5rNtUA')}
              >
                <img alt="Thumbnail 2" className="w-full h-24 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfAC2U6PEJC5l2wsiRW-TOalga_H_bBpRrcGHiDMUi2lCSeV7OJ_OJ8oH3WkwL_bWeGi_aWQdpZ1vOIDXnD_V54HeKJ3HVwWGk_CwD0RNOeEQNWoKZe3v4DdEPXVjzSdYmhAv7eamS9zu0clu_spb8-T30kIxowpyRBKUSHex03UFL1haIdKqAsEcHarK0leERrxbqIXQjkLimJmZV4_RRSJYY8uAnX40oYGU8FjFKrWHXeuZf7dfrLmKsVi3Xjg9HaGXkI5rNtUA"/>
              </button>
              <button 
                className={`thumbnail-btn border-2 rounded-lg overflow-hidden bg-surface-container ${mainImgSrc.includes('AB6AXuBRt40l') ? 'border-primary' : 'border-transparent hover:border-outline-variant'}`}
                onClick={() => setMainImgSrc('https://lh3.googleusercontent.com/aida-public/AB6AXuBRt40lCuiGO77LeteNck6MZivNDBaNYd3J9zYllGCBoWbZtSk16WfN8NMnooSKTWBSmN3HsS4J3sLrVGHC1Y9hF-A0PfLzGos7EKDeGeylR_vJEJDdYj8huHDPLHCSfDgAmKhjoSk4k29x44w92Na77BYEudffXUj34VKBd9Gm5wUeF8zCL9QqqiMUUk4Se3Kvsp84cdtb7EpORc_q0zK-KmNhEx9Ku00MQ8Qd7BPIDt7qp0TfSssHTSrMVdncUvCm5pEYVw-nolw')}
              >
                <img alt="Thumbnail 3" className="w-full h-24 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRt40lCuiGO77LeteNck6MZivNDBaNYd3J9zYllGCBoWbZtSk16WfN8NMnooSKTWBSmN3HsS4J3sLrVGHC1Y9hF-A0PfLzGos7EKDeGeylR_vJEJDdYj8huHDPLHCSfDgAmKhjoSk4k29x44w92Na77BYEudffXUj34VKBd9Gm5wUeF8zCL9QqqiMUUk4Se3Kvsp84cdtb7EpORc_q0zK-KmNhEx9Ku00MQ8Qd7BPIDt7qp0TfSssHTSrMVdncUvCm5pEYVw-nolw"/>
              </button>
              <button 
                className={`thumbnail-btn border-2 rounded-lg overflow-hidden bg-surface-container ${mainImgSrc.includes('AB6AXuA-Ge') ? 'border-primary' : 'border-transparent hover:border-outline-variant'}`}
                onClick={() => setMainImgSrc('https://lh3.googleusercontent.com/aida-public/AB6AXuA-Ge_4xiSvLUNHzSOQ1VpyHH05cXgmZrPo92-uTNJoOaK4339xdBU3MQOXLLDuEjA1GtmyY73CDsfGS8gPzcX-3FvAEwvq7s8vl1DZVpyjU-V0rWYi8GSSupl3Thc97t1qo2g_hRqwk-e6-gifYURtY5KeNoEmUmU2DdPtlI3lV9mCLRcMzjhiVvK6dmFLrMIjzos8HZSfrQMxiDhqf3ndnSuo-xYOUzk9pSAKKQH6wt3-GHqrrZ4wSvEVTZ4zhiwhtFMWOID-nI4')}
              >
                <img alt="Thumbnail 4" className="w-full h-24 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-Ge_4xiSvLUNHzSOQ1VpyHH05cXgmZrPo92-uTNJoOaK4339xdBU3MQOXLLDuEjA1GtmyY73CDsfGS8gPzcX-3FvAEwvq7s8vl1DZVpyjU-V0rWYi8GSSupl3Thc97t1qo2g_hRqwk-e6-gifYURtY5KeNoEmUmU2DdPtlI3lV9mCLRcMzjhiVvK6dmFLrMIjzos8HZSfrQMxiDhqf3ndnSuo-xYOUzk9pSAKKQH6wt3-GHqrrZ4wSvEVTZ4zhiwhtFMWOID-nI4"/>
              </button>
            </div>
          </div>
          {/* Details & Actions Section (Right) */}
          <div className="lg:col-span-5 flex flex-col space-y-gutter">
            {/* Product Identity */}
            <div className="space-y-stack-sm">
              <div className="flex justify-between items-start">
                <h1 className="font-headline-lg text-headline-lg text-primary">Master Collection: Heritage Chronograph</h1>
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-label-sm font-label-md">High-end</span>
              </div>
              <p className="text-label-md text-on-surface-variant font-label-md">Product ID: #12345</p>
              <div className="text-headline-xl font-headline-xl text-secondary mt-2">€2,500</div>
              <div className="py-stack-md border-y border-outline-variant space-y-stack-sm">
                <h3 className="font-headline-md text-body-lg text-on-surface">Description</h3>
                <p className="text-body-md text-on-surface-variant">A timeless masterpiece of horology. This Heritage Chronograph features a 42mm stainless steel case, sapphire crystal exhibition back, and a hand-stitched alligator leather strap. Perfect for the discerning collector who values tradition and precision.</p>
                <p className="text-body-md font-bold text-on-surface pt-2">Condition: <span className="font-normal text-on-surface-variant">Excellent / Like New. Includes original box and certificates.</span></p>
              </div>
            </div>
            {/* Seller Card */}
            <div className="flex items-center p-stack-md bg-surface-container-low rounded-xl border border-outline-variant space-x-stack-md shadow-sm">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-outline">
                <img alt="Seller Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0ky8TUWyzTWNIzuf6dIUpCXLGywGq-k36u4rjB-BKQGmhto75AfvrFT9fb2vAsO1yMB7RHd-OVlXj--wxa91t4Jxr5WvjV_wVdFn7vnhgb9wU3G7NTsW17KG4ZhWiORZFEKOp7F4NKMA84iB8kEFMAvE3yDelL-HZO1uBkf4KSpan_7tlS_55Juf2QI_B4vy9RGQY5B1h620aIKFcwNjzlr2hn2SY_FYE-wspjpW2NmC_Gs_7rCs2auqBayPYT_ihAVVIi296q1k"/>
              </div>
              <div className="flex-1">
                <p className="text-body-lg font-bold text-primary">Elite Horology Ltd.</p>
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
                <button 
                  className={`flex-1 py-4 text-label-md transition-all ${activeTab === 'buy' ? 'font-bold text-primary border-b-2 border-primary bg-surface-container-lowest' : 'font-medium text-on-surface-variant hover:bg-surface-variant bg-surface-container-low'}`} 
                  onClick={() => setActiveTab('buy')}
                >BUY NOW</button>
                <button 
                  className={`flex-1 py-4 text-label-md transition-all ${activeTab === 'offer' ? 'font-bold text-primary border-b-2 border-primary bg-surface-container-lowest' : 'font-medium text-on-surface-variant hover:bg-surface-variant bg-surface-container-low'}`} 
                  onClick={() => setActiveTab('offer')}
                >NEGOTIATE</button>
                <button 
                  className={`flex-1 py-4 text-label-md transition-all ${activeTab === 'auction' ? 'font-bold text-primary border-b-2 border-primary bg-surface-container-lowest' : 'font-medium text-on-surface-variant hover:bg-surface-variant bg-surface-container-low'}`} 
                  onClick={() => setActiveTab('auction')}
                >AUCTION</button>
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
                  <button className="w-full py-4 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-on-secondary-container transition-all">Buy Now — €2,500</button>
                  <p className="text-label-sm text-center text-on-surface-variant italic">Fast &amp; Secure Shipping from Switzerland</p>
                </div>
              )}
              {/* Negotiation Panel */}
              {activeTab === 'offer' && (
                <div className="p-6 space-y-stack-md">
                  <div className="bg-surface-container p-stack-md rounded-lg space-y-2">
                    <h4 className="text-label-md font-bold text-on-surface">Offer History</h4>
                    <div className="text-label-sm space-y-1">
                      <p className="flex justify-between"><span className="text-on-surface-variant">Round 1: You proposed</span> <span>€2,100</span></p>
                      <p className="flex justify-between font-bold"><span className="text-on-surface-variant">Round 1: Seller counter</span> <span>€2,350</span></p>
                      <p className="flex justify-between"><span className="text-on-surface-variant">Round 2: You proposed</span> <span>€2,200</span></p>
                    </div>
                  </div>
                  <div className="space-y-stack-sm">
                    <label className="text-label-sm font-bold text-primary uppercase">New Proposed Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">€</span>
                      <input className="w-full pl-10 pr-4 py-3 border border-outline rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" placeholder="2,300" type="number"/>
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
                    <span className="text-label-md text-on-surface-variant">Highest Bid</span>
                    <span className="text-headline-md font-bold text-secondary">€1,800</span>
                  </div>
                  <div className="space-y-stack-sm">
                    <label className="text-label-sm font-bold text-primary uppercase">Max Bid</label>
                    <input className="w-full px-4 py-3 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="Enter bid higher than €1,800" type="number"/>
                  </div>
                  <button className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all">Place Bid</button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Related Items Row */}
        <section className="mt-stack-lg pt-stack-lg border-t border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-primary mb-gutter">Similar Luxury Timepieces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden group hover:shadow-lg transition-all">
              <div className="h-48 overflow-hidden relative">
                <img alt="Related Watch 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVZtuP8dO8UeeeLt7WA5hm3yjDhP7TcgSx6kN5WUv13VBXzy47WuxhdIwQCDJKKzBV-RKIVR91ts5Y1yxJAgBB9f312NLB3ATZVpb1W1uTUbqwRZyzr31Oldi4kAsho2dq6-MWeqwxchIUD5f2I260XunparViYynlXyleztpyosRAT8xvPCRAFJ-1fUOQk2WXhLceBmsWnFlM9V5EuHCykcejjmPlWvlGbau79OT-MXOiSnSKW4TH2WOBppiGSvI5PoFjb2px3ho"/>
                <span className="absolute top-2 left-2 bg-primary/50 text-white text-[10px] px-2 py-1 rounded-sm backdrop-blur-md">Collection</span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-on-surface truncate">Elegance Gold Edition</h4>
                <p className="text-label-sm text-on-surface-variant">Mint Condition</p>
                <p className="text-body-lg font-bold text-secondary">€1,950</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden group hover:shadow-lg transition-all">
              <div className="h-48 overflow-hidden relative">
                <img alt="Related Watch 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdESJCtsElJ50qPFtRuSLHhR6qRQFhwd7wpshEFVavyjLwiYJG--c39EFHHLBh0wp2R9VtRhxsz3fEw-rjPYlv3DcYw3aPCX8lCWQm5K7aAPoJ1bQKYnnHrSbS0JLyx-05nhd7zdu2YqbZWuJGhmPwCxsut65eIiCKLPcZUKru-n1c8u8UhYo2IwBHb5PbWmu_Cv_y0z9FiR4kHLVz-mgTp0Ibzo03xZCqkX3fhwnKvfCLExHXviEAcCJysJtVhWiqYYzjRp9CTIU"/>
                <span className="absolute top-2 left-2 bg-primary/50 text-white text-[10px] px-2 py-1 rounded-sm backdrop-blur-md">Diver</span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-on-surface truncate">Seafarer Pro 300</h4>
                <p className="text-label-sm text-on-surface-variant">New</p>
                <p className="text-body-lg font-bold text-secondary">€3,200</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden group hover:shadow-lg transition-all">
              <div className="h-48 overflow-hidden relative">
                <img alt="Related Watch 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD44denJP1kHlCJ4-UKpMMdIA8jdL0GwadgvPwX98TBkNJz-Rj88lR-5pb0X4-lj25MUH1iOQzphlEZbaU9gP1tMrq4P4SGtcYO3AmCTxiNbKtIGzSExNj0R_yo01lJydeMGmfFYXoZV1VQOI6R-3lMnqpFrdiL0_C6LrAf5MxPjMvguBZn4C0j0ZcGUceZ6Of9DBRiudUkkuHhzWwaLe18aH7BK-QTfI4CcH3nv4EzPKYAFjACBtCzE3dJdozsEIVTlEPj6eiy_JY"/>
                <span className="absolute top-2 left-2 bg-primary/50 text-white text-[10px] px-2 py-1 rounded-sm backdrop-blur-md">Vintage</span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-on-surface truncate">Aviation Retro Chrono</h4>
                <p className="text-label-sm text-on-surface-variant">Good Condition</p>
                <p className="text-body-lg font-bold text-secondary">€1,450</p>
              </div>
            </div>
            {/* Card 4 */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden group hover:shadow-lg transition-all">
              <div className="h-48 overflow-hidden relative">
                <img alt="Related Watch 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmRbvAFbMqmp86v6LZIO9E28I37A9EQmInrDx9BxrhcQKvWqLPvfp9xjzOoYvWJFmJ42r91W28Ha9MDGLEMHCyremakQXelihkBDHXQYAeP2BkbN0IL05L4khH9TF0B3GUOqGcJExe3pldpR1TkcDJherxCqNbUmfIdG76edLRAkucIPqClmt1pPaWJQCGe0ken7DfXjwSEPl8iJNiYFKoIwgckmPGRpSpDlM_8VVV5J99iZNnuBprMF3TqMgS8HcQCDurRNMD2yk"/>
                <span className="absolute top-2 left-2 bg-primary/50 text-white text-[10px] px-2 py-1 rounded-sm backdrop-blur-md">Skeleton</span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-on-surface truncate">Titanium Skeleton Hub</h4>
                <p className="text-label-sm text-on-surface-variant">Excellent</p>
                <p className="text-body-lg font-bold text-secondary">€4,800</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Product;

# 1780078686976288184
