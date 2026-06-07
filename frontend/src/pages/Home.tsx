import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, type Product } from '../lib/api';
import Layout from '../components/Layout';

const Home = () => {
  const [picks, setPicks] = useState<Product[]>([]);
  const [flash, setFlash] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState('Ends in 04:22:15');

  useEffect(() => {
    getProducts({ limit: 4 }).then(setPicks).catch(() => {});
    getProducts({ type: 'auction', limit: 4 }).then(setFlash).catch(() => {});
  }, []);

  useEffect(() => {
    let hours = 4, minutes = 22, seconds = 15;
    const interval = setInterval(() => {
      seconds--;
      if (seconds < 0) { seconds = 59; minutes--; }
      if (minutes < 0) { minutes = 59; hours--; }
      setTimeLeft(`Ends in ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const typeInfo = (t: string) => {
    if (t === 'buy_now') return { label: 'Buy Now', cls: 'text-secondary bg-secondary-fixed/20' };
    if (t === 'negotiation') return { label: 'Make Offer', cls: 'text-primary bg-primary-fixed/20' };
    return { label: 'Best Offer', cls: 'text-tertiary bg-tertiary-fixed/20' };
  };

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
                <Link to="/browse" className="px-8 py-4 bg-secondary-container text-on-secondary-container rounded-lg font-bold hover:scale-105 transition-transform shadow-lg">Shop Now</Link>
                <Link to="/register?role=seller" className="px-8 py-4 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-primary transition-all">Sell With Us</Link>
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
            <Link to="/browse" className="text-primary font-bold flex items-center gap-1 hover:underline">
              View All <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-gutter pb-4 no-scrollbar">
            {picks.map((p) => {
              const t = typeInfo(p.type);
              return (
                <Link key={p.id} to={`/product?id=${p.id}`} className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden group">
                  <div className="h-48 overflow-hidden relative">
                    <img alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={p.image} />
                    <span className="absolute top-3 left-3 bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-label-sm font-label-sm">{p.category}</span>
                  </div>
                  <div className="p-stack-md space-y-2">
                    <span className={`text-label-sm font-label-sm ${t.cls} px-2 py-0.5 rounded`}>{t.label}</span>
                    <h3 className="text-headline-sm font-headline-md text-primary">{p.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-headline-sm font-headline-md text-secondary font-bold">€{Number(p.price).toFixed(2)}</span>
                      <button className="material-symbols-outlined text-primary hover:scale-110 transition-transform">add_shopping_cart</button>
                    </div>
                  </div>
                </Link>
              );
            })}
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
        <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-stack-md">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-headline-lg font-headline-lg text-primary">Flash Sales</h2>
              <p className="text-body-md font-body-md text-on-surface-variant">Limited time deals on high-demand products.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-body-lg font-bold text-secondary">{timeLeft}</span>
              <Link to="/browse" className="text-primary font-bold flex items-center gap-1 hover:underline">
                View All <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-gutter pb-4 no-scrollbar">
            {flash.map((p) => {
              const t = typeInfo(p.type);
              return (
                <Link key={p.id} to={`/product?id=${p.id}`} className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden group">
                  <div className="h-48 overflow-hidden relative">
                    <img alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={p.image} />
                    <span className="absolute top-3 left-3 bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-label-sm font-label-sm">{p.category}</span>
                  </div>
                  <div className="p-stack-md space-y-2">
                    <span className={`text-label-sm font-label-sm ${t.cls} px-2 py-0.5 rounded`}>{t.label}</span>
                    <h3 className="text-headline-sm font-headline-md text-primary">{p.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-headline-sm font-headline-md text-secondary font-bold">€{Number(p.price).toFixed(2)}</span>
                      <button className="material-symbols-outlined text-primary hover:scale-110 transition-transform">add_shopping_cart</button>
                    </div>
                  </div>
                </Link>
              );
            })}
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

# 1780856287427111576
