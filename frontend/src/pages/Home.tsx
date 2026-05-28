import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Home = () => {
  const [timeLeft, setTimeLeft] = useState('Ends in 04:22:15');

  useEffect(() => {
    let hours = 4, minutes = 22, seconds = 15;
    const interval = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }
      if (minutes < 0) {
        minutes = 59;
        hours--;
      }
      setTimeLeft(`Ends in ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <main className="space-y-stack-lg">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center overflow-hidden bg-primary-container">
          <img alt="Professional Marketplace Hero" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" src="/homepage.png"/>
          <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-on-primary">
            <div className="max-w-2xl space-y-stack-md">
              <h1 className="text-headline-xl-mobile md:text-headline-xl font-headline-xl text-white">Excellence in Every Transaction</h1>
              <p className="text-body-lg font-body-lg text-primary-fixed">Welcome to the official Omnes Education community marketplace. Discover a curated selection of rare collectibles and professional assets tailored for our distinguished network.</p>
              <div className="flex flex-wrap gap-4 pt-stack-sm">
                <button className="px-8 py-4 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:scale-105 transition-transform shadow-lg">Shop Now</button>
                <Link to="/register" className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-primary transition-all">Sell With Us</Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Selection of the Day */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-stack-md">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-headline-lg font-headline-lg text-primary">Selection of the Day</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">Handpicked items of exceptional quality.</p>
            </div>
            <button className="text-primary font-bold flex items-center gap-1 hover:underline">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="flex overflow-x-auto gap-gutter pb-4 no-scrollbar">
            {/* Card 1 */}
            <div className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden group">
              <div className="h-48 overflow-hidden relative">
                <img alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiQTRBcJI1Tms5soZInV1SgXzmG6ZjC36fA65Ab_GOCsS1ar_rqbyql0KC_FEG6FDl0HRZ4IROxddg794mEJfS7AL6wDOgFNlB1dsZYApvwLXddsYuBerH9MGAHQZwQdJCd5pMK-95B1gF3Iky-FmkEypPTfWzrXX2nlQsMrZjhcNkexv4r1uqWz3pcoA_hNLiMFWLELgb8a7QbFD4Kw-Vn1j8hWqmf-xWZDHXJB23_ITT5qeKmSl3-Nu_EEdQvSwx3efkTioDexQ"/>
                <span className="absolute top-3 left-3 bg-tertiary-container/50 backdrop-blur-sm text-on-tertiary px-3 py-1 rounded-full text-label-sm font-label-sm">High-end</span>
              </div>
              <div className="p-stack-md space-y-2">
                <span className="text-label-sm font-label-sm text-secondary bg-secondary-fixed/20 px-2 py-0.5 rounded">Buy Now</span>
                <h3 className="text-headline-sm font-headline-md text-primary">Titan Precision Watch</h3>
                <div className="flex justify-between items-center">
                  <span className="text-headline-sm font-headline-md text-secondary font-bold">$1,249</span>
                  <button className="material-symbols-outlined text-primary hover:scale-110 transition-transform">add_shopping_cart</button>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden group">
              <div className="h-48 overflow-hidden relative">
                <img alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBFm2m6Opn8_fQhxcyMYPtX70IrKtF7z4xy7-W2O96VvWhCheZyUZLzVp83qc3KNvgk2g7YO5stybuBiI3L3hq1M6fP1trOgb9r_77qyv6Z2jyBaVChfYDXwLVYp9VmEC3Cc6GWBUAmBNY74j0hNaetkpON0lyKFtYFxFy70ipH3HFTC309KczGlea6pwD5ts7tTmnS5HzvtiVVTrkEk_r2Si913p1wbqgVcr6Jqbr9f_YTJXVuQsZwyQcLNBDh-EngP5Z7nuJ1hw"/>
                <span className="absolute top-3 left-3 bg-primary-container/50 backdrop-blur-sm text-primary-fixed px-3 py-1 rounded-full text-label-sm font-label-sm">Rare</span>
              </div>
              <div className="p-stack-md space-y-2">
                <span className="text-label-sm font-label-sm text-primary bg-primary-fixed/20 px-2 py-0.5 rounded">Negotiation</span>
                <h3 className="text-headline-sm font-headline-md text-primary">Studio Pro Audio</h3>
                <div className="flex justify-between items-center">
                  <span className="text-headline-sm font-headline-md text-secondary font-bold">$499</span>
                  <button className="material-symbols-outlined text-primary hover:scale-110 transition-transform">add_shopping_cart</button>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden group">
              <div className="h-48 overflow-hidden relative">
                <img alt="Product" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDOUOq09YtmN8bdwD-5ElgaFQ7hCDsAr9MzYx-9GBSOvdIiFla_msxbpDFoYATHF0jZzEmRX2f_DcuSGFf6QxKcK5zXF5TeaNy4PORJysbWzuTSWQMRYb2URBHJo84YyZw94SiEkUbYYpi1gZ8CTZfFrj1nSZ_ou-29g52xMuRexwCunu0H0D7318atxDh0e9Ejmwnsng0HU_MPWvqkbo1EaeH7Lm884Se1s1vwu9_I1NkwAbExjCxC5hKpLs7y68IGa-Kc6AUeTQ"/>
                <span className="absolute top-3 left-3 bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-label-sm font-label-sm">Regular</span>
              </div>
              <div className="p-stack-md space-y-2">
                <span className="text-label-sm font-label-sm text-tertiary bg-tertiary-fixed/20 px-2 py-0.5 rounded">Best Offer</span>
                <h3 className="text-headline-sm font-headline-md text-primary">Limited Edition Library</h3>
                <div className="flex justify-between items-center">
                  <span className="text-headline-sm font-headline-md text-secondary font-bold">$2,100</span>
                  <button className="material-symbols-outlined text-primary hover:scale-110 transition-transform">add_shopping_cart</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Category Tiles */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div className="relative h-96 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
              <img alt="Rare Items" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATI-G7aWm8XwTuvkdM5VshY0t7p7vuBj0-eHydSWgmeSmYwhlvwG0wkO-gm2H19MOvdvl7igWhLLz9JTJ_HSe2goQ2_xXhDYBrFM_Mz_-FgMN0SmcV4Kc37nP_3rNAmgA5EJ2IcvWLcpj4jCaXT04C0Ywhekq7f6Xnv5QIgDxARumGzUNZGMELj0v5FpUjt82zxVEKVX9A0TvOsrRs5XgPTN16XGZOp9J8I4LoIL2ThDrxYqswF7x_MRCk-64a8GR6lTMpMB1yOtg"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-stack-md text-white">
                <h3 className="text-headline-md font-headline-md">Rare Items</h3>
                <p className="text-label-md font-label-md opacity-80">One-of-a-kind treasures</p>
                <div className="mt-4 flex items-center gap-2 text-primary-fixed">
                  <span className="font-bold">Explore</span>
                  <span className="material-symbols-outlined">east</span>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
              <img alt="High-end Items" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqkjAGB7Br0BHBSMokX2BfF-y2FbvCUP6BuTRbJu1IMIve4G_pevNCV70dxwxPWLNICZOAdgM6vyYz4yXXNSAgAzg5ygJ9KClLeBlE7ruhfIz2-Kdad4q6q-P-L6wcpWCxt_8kVDjRjeKo_onLv5jAa1sTd7XWQ9QJaeICVAdWYiJM1LH87Dcg0_AXHydimJl9MuFuYR2FJJ8f6a4s6JpFnkaV5KUtxa4GgTqTWXk1-w6Lcc01biF1rRr1ABhzpt3n7b38SM9XJ-4"/>
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-stack-md text-white">
                <h3 className="text-headline-md font-headline-md">High-end Items</h3>
                <p className="text-label-md font-label-md opacity-80">Professional grade quality</p>
                <div className="mt-4 flex items-center gap-2 text-secondary-fixed">
                  <span className="font-bold">Explore</span>
                  <span className="material-symbols-outlined">east</span>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
              <img alt="Regular Items" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6MNZ2XIdhqT1jU0zXpoRH5Rhi69sGeQjuQTD4hFH2IUAF6F_M4ZjIYcGO2gZ4efB8YgRiFmiNHv61Xaj_eO1Ife5_3dq99vK6i_P9p8rC9AxfnuoZAx6hhrcWlY5RvjMCxkR4ckT5o3PbwzixZLcWjV3abVdoztyYoOKgQ2OV8Vv7dBDewfsennKcX3qdtU53XjofnHAV22h9zr91cMytySBCY4XYPljZCWAPoSat22Km2f8taayhIK_QFB-Y9K1Hb-pQa6AhIio"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-stack-md text-white">
                <h3 className="text-headline-md font-headline-md">Daily Essentials</h3>
                <p className="text-label-md font-label-md opacity-80">Practical curated tools</p>
                <div className="mt-4 flex items-center gap-2 text-primary-fixed">
                  <span className="font-bold">Explore</span>
                  <span className="material-symbols-outlined">east</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flash Sales */}
        <section className="bg-surface-container py-stack-lg">
          <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-stack-md">
            <div className="flex items-center gap-4">
              <h2 className="text-headline-lg font-headline-lg text-primary">Flash Sales</h2>
              <div className="bg-error text-on-error px-3 py-1 rounded-full text-label-md font-label-md flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">timer</span>
                <span>{timeLeft}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              {/* Grid Item 1 */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant hover:shadow-md transition-shadow cursor-pointer">
                <img alt="Flash Item" className="w-full h-40 object-cover rounded-lg mb-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxkqrD_jf2GesDZAyU1BLidgV0y33BbH5L_1jdB7D5XjgdC-Z2tTsC0IcM-ldXRBYS866DQjZycoMsLHPSwmMJ_n8JFkOoiFnjCo9CPY_Er_DpEIokEUTJiReV1wmEeOAeR6bUVLCTJTKKs8lLqqx6oifhopYcQO6iuCfXCseTF40bhCqn5jVm1UXzocIKlA9KBEUrHVYceZHfDqMLiwBUI-RS18bJKB9CY-EVcA0zQRm6VSGlK62wnzUSsRzwzrcAc3gUVDgL31U"/>
                <h4 className="font-bold text-primary">Nomad Carry-On</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-secondary font-bold font-headline-md">$120</span>
                  <span className="text-on-surface-variant line-through text-sm">$185</span>
                </div>
              </div>
              {/* Grid Item 2 */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant hover:shadow-md transition-shadow cursor-pointer">
                <img alt="Flash Item" className="w-full h-40 object-cover rounded-lg mb-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKjcKOwDjRMh8YMFCpiqypfgxX8u3ycBjsCzbGzouzbXVGMPItVqxDefwCBYoXe_PBI0skqFOwtoelahTMSPXidb8yc9coLYPXwATLrJUvyCxP6yb9U6n5esXpC7Y2Swa5eHxcaVcE1fN716X86G5b7w73OjeB1merTV5RyatiNagIdwaQ_hQsiSMM-Kl_eaQDMjGtY-l7DRNYpHurGPzqunQpAyUlpg-85F-aGu5D4gnqb99lk0CBckB6GK47zNQsSfc6_YmzCvQ"/>
                <h4 className="font-bold text-primary">Retro Cam X</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-secondary font-bold font-headline-md">$95</span>
                  <span className="text-on-surface-variant line-through text-sm">$140</span>
                </div>
              </div>
              {/* Grid Item 3 */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant hover:shadow-md transition-shadow cursor-pointer">
                <img alt="Flash Item" className="w-full h-40 object-cover rounded-lg mb-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3N5yg2wC-UEJbtZr9sIYfCwn5W1K43Utg89UQlYRnJV8MxIwQC1LspX3hVonnL4hzxLFf8D15nEDN8GK6xcTpjk0mbQbLS0VP-9Fx9gAe4qb54uRD7akDpGPmvAmAd5CHUnLcvOZQPQOhnXFvBwSYf1elQ7S6Bv9cbCU3oaD0jFOlSE7jNwVl_P4dmc2cfcF5ebocCAJUyPdcHv7z8t1A2MjYJLZedRj9yU_TMg6PqFD8QbZcza9Tijdd4jCwMTH-7Mv99yxxXTc"/>
                <h4 className="font-bold text-primary">Collector's Case</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-secondary font-bold font-headline-md">$45</span>
                  <span className="text-on-surface-variant line-through text-sm">$80</span>
                </div>
              </div>
              {/* Grid Item 4 */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant hover:shadow-md transition-shadow cursor-pointer">
                <img alt="Flash Item" className="w-full h-40 object-cover rounded-lg mb-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC30ylcWasr7Q5_-IT6KFrdtjM3qF_n-0uHrPFe5uYDcgV2tnIL_BxGkozIWwo8-IMlJl3mH54yD3MvRsqn-87RECxlPP6Ra9S7qgJndvSF79ITrAq9uTJiCSNawEDQAZAUI2edt1OaUf15kvDPhMLFJr_tdAKU0eTP8uwk8DKi6YqqasBTbQ-2pFtdIhyzzUYbIU0-k3RE4MzLbhIZOg3oHmF6KpEL95cUUYjPSprogCZo_YM13U7PXw0mVfjGmJCt51AMGIlURyc"/>
                <h4 className="font-bold text-primary">Omnes Pad v4</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-secondary font-bold font-headline-md">$299</span>
                  <span className="text-on-surface-variant line-through text-sm">$450</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Maps Section */}
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter items-center pb-stack-lg">
          <div className="space-y-stack-md">
            <h2 className="text-headline-lg font-headline-lg text-primary">Visit Our Hub</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Located in the heart of the Omnes Campus, our physical marketplace hub is open for inspections and secure handovers.</p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                <div>
                  <p className="font-bold text-primary">Address</p>
                  <p className="text-on-surface-variant">10 Rue de la Victoire, 75009 Paris, France</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary">mail</span>
                <div>
                  <p className="font-bold text-primary">Email</p>
                  <p className="text-on-surface-variant">support@omnes-marketplace.edu</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary">phone</span>
                <div>
                  <p className="font-bold text-primary">Phone</p>
                  <p className="text-on-surface-variant">+33 1 45 67 89 00</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-80 bg-surface-container rounded-2xl overflow-hidden relative border border-outline-variant">
            <div className="absolute inset-0 flex items-center justify-center bg-surface-variant/30">
              <div className="text-center p-stack-md">
                <span className="material-symbols-outlined text-6xl text-primary/20 mb-4">map</span>
                <p className="text-on-surface-variant font-medium">Interactive Map Data - Paris Campus</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
