import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Small delay to ensure the transition triggers after initial render
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface font-body-md overflow-hidden">
      {/* SideNavBar */}
      <aside className={`${mobileMenuOpen ? 'flex absolute z-50 bg-surface' : 'hidden'} md:flex flex-col h-full p-stack-md space-y-stack-sm bg-surface-container-low border-r border-outline-variant w-64 shrink-0`}>
        <div className="mb-stack-lg px-2 flex flex-col items-center">
          <div className="bg-surface-container-low p-2 rounded-lg">
            <img alt="Omnes MarketPlace Logo" className="h-9 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaj3vHZb9tkC91jen03F2veXvobHo9ezqHF6qQdK8ryNbungIosTMi0YG7Gplu3fetQgz6iUdP0m79CxTU7e-HisF85uH7ZvKEQWTsWSAJBt-Ddz4SxM3kR67EXGjUIGpXFh2_LUHL8qa8Vgnpq6vWH-6i04ol12JzKV_eLbtQyuM-L9aTreBqzBxQr_iDxMLbXy-eAps7aFh0uQNuS4O5mdAqfy0KTVjgyKQMbmqB3zoSCL98I029TfPQ4Ck5kBnccDWceEZp2ws"/>
          </div>
          <h1 className="text-label-md font-bold text-primary mt-2 text-center font-headline-md tracking-[0.1em] uppercase">Omnes MarketPlace</h1>
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mt-1">Admin Management</p>
        </div>
        <div className="flex items-center space-x-3 px-2 py-3 mb-stack-md bg-surface-container-high rounded-xl">
          <img alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrcmBFMyzk-NXNp7-8_Otbh-cbMeDx71HsOtkILpA00cCXSAGZktJKFo3HFWGJ2OqM2nVU8EVjrRByqMU4jDNgNZwKVVEsZf9Tnd5GRnjij4IE6vkTAYUGPbW1Kk-XCB472Vj9tGDj-eIaao55o8WBM4zjsEwkJTuES-q_8Zb_SrCm3QApJODewClWhujVASOtThNK473qEaeLQwUgHbx0EGhuaxBXlKXf5GCdcBUSD4NyRWfLBqTFj7qgkmUqOy5E5xv-yU5p070"/>
          <div>
            <p className="font-bold text-label-md text-primary leading-tight">Admin Panel</p>
            <p className="text-label-sm text-on-surface-variant">Omnes Management</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col space-y-1">
          <a className="flex items-center space-x-3 p-3 bg-primary-container text-on-primary-container font-bold rounded-lg scale-95 transition-transform" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-label-md">Dashboard</span>
          </a>
          <a className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">storefront</span>
            <span className="text-label-md">Sellers</span>
          </a>
          <a className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">group</span>
            <span className="text-label-md">Buyers</span>
          </a>
          <a className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">list_alt</span>
            <span className="text-label-md">Listings</span>
          </a>
          <a className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">gavel</span>
            <span className="text-label-md">Auctions</span>
          </a>
          <a className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="text-label-md">Transactions</span>
          </a>
          <a className="flex items-center space-x-3 p-3 text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-label-md">Settings</span>
          </a>
        </nav>
        <button className="w-full py-3 px-4 bg-primary text-on-primary font-bold rounded-lg flex items-center justify-center space-x-2 mt-auto hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-label-md">Add New Admin</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-surface relative">
        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-50" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>

        {/* Header */}
        <header className="w-full px-margin-desktop py-4 bg-surface border-b border-outline-variant flex justify-between items-center sticky top-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-headline-md font-headline-md text-primary">Dashboard Overview</h2>
            <p className="text-body-md text-on-surface-variant">Real-time marketplace performance metrics</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary relative transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-outline-variant mx-2"></div>
            <div className="flex items-center space-x-2">
              <span className="text-label-md font-bold text-primary">System Admin</span>
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold text-xs">SA</div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-margin-desktop max-w-container-max mx-auto w-full space-y-stack-lg flex-grow">
          {/* KPI Cards Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Total Users */}
            <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col space-y-stack-sm group hover:border-primary transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-primary-fixed text-primary rounded-lg">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <span className="text-secondary font-bold text-label-sm flex items-center">
                  +12% <span className="material-symbols-outlined text-[16px]">trending_up</span>
                </span>
              </div>
              <div>
                <p className="text-label-md text-on-surface-variant">Total Users</p>
                <h3 className="text-headline-md font-headline-md text-primary">24,892</h3>
              </div>
            </div>
            {/* Active Listings */}
            <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col space-y-stack-sm group hover:border-primary transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-secondary-fixed text-secondary rounded-lg">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <span className="text-secondary font-bold text-label-sm flex items-center">
                  +5.4% <span className="material-symbols-outlined text-[16px]">trending_up</span>
                </span>
              </div>
              <div>
                <p className="text-label-md text-on-surface-variant">Active Listings</p>
                <h3 className="text-headline-md font-headline-md text-primary">8,103</h3>
              </div>
            </div>
            {/* Revenue */}
            <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col space-y-stack-sm group hover:border-primary transition-colors">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-tertiary-fixed text-tertiary rounded-lg">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-error font-bold text-label-sm flex items-center">
                  -2.1% <span className="material-symbols-outlined text-[16px]">trending_down</span>
                </span>
              </div>
              <div>
                <p className="text-label-md text-on-surface-variant">Gross Revenue</p>
                <h3 className="text-headline-md font-headline-md text-primary">€1,248,500</h3>
              </div>
            </div>
          </section>

          {/* Analytics Row */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Revenue Trend Chart */}
            <div className="lg:col-span-8 bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-stack-lg">
                <h4 className="text-headline-sm font-headline-md text-primary">Revenue Trend</h4>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-label-sm font-bold bg-primary text-on-primary rounded-full">Monthly</button>
                  <button className="px-3 py-1 text-label-sm font-medium text-on-surface-variant hover:bg-surface-variant rounded-full transition-colors">Weekly</button>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between space-x-4 pt-4">
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-primary-fixed rounded-t-sm group-hover:bg-primary transition-[height] duration-1000 ease-out" style={{ height: mounted ? '40%' : '0px' }}></div>
                  <span className="text-label-sm text-on-surface-variant mt-2">Jan</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-primary-fixed rounded-t-sm group-hover:bg-primary transition-[height] duration-1000 ease-out" style={{ height: mounted ? '55%' : '0px' }}></div>
                  <span className="text-label-sm text-on-surface-variant mt-2">Feb</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-primary-fixed rounded-t-sm group-hover:bg-primary transition-[height] duration-1000 ease-out" style={{ height: mounted ? '48%' : '0px' }}></div>
                  <span className="text-label-sm text-on-surface-variant mt-2">Mar</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-primary-fixed rounded-t-sm group-hover:bg-primary transition-[height] duration-1000 ease-out" style={{ height: mounted ? '75%' : '0px' }}></div>
                  <span className="text-label-sm text-on-surface-variant mt-2">Apr</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-primary-fixed rounded-t-sm group-hover:bg-primary transition-[height] duration-1000 ease-out" style={{ height: mounted ? '62%' : '0px' }}></div>
                  <span className="text-label-sm text-on-surface-variant mt-2">May</span>
                </div>
                <div className="flex flex-col items-center flex-1 group">
                  <div className="w-full bg-primary-fixed rounded-t-sm group-hover:bg-primary transition-[height] duration-1000 ease-out" style={{ height: mounted ? '90%' : '0px' }}></div>
                  <span className="text-label-sm text-on-surface-variant mt-2">Jun</span>
                </div>
              </div>
            </div>
            {/* Category Share */}
            <div className="lg:col-span-4 bg-surface-container-lowest p-stack-lg rounded-xl border border-outline-variant shadow-sm">
              <h4 className="text-headline-sm font-headline-md text-primary mb-stack-lg">Sales by Category</h4>
              <div className="space-y-stack-md">
                <div className="space-y-1">
                  <div className="flex justify-between text-label-md">
                    <span className="text-on-surface">Luxury Watches</span>
                    <span className="font-bold text-primary">42%</span>
                  </div>
                  <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-[width] duration-1000 ease-out" style={{ width: mounted ? '42%' : '0px' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-label-md">
                    <span className="text-on-surface">Fine Art</span>
                    <span className="font-bold text-primary">28%</span>
                  </div>
                  <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary-container h-full transition-[width] duration-1000 ease-out" style={{ width: mounted ? '28%' : '0px' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-label-md">
                    <span className="text-on-surface">Collectibles</span>
                    <span className="font-bold text-primary">18%</span>
                  </div>
                  <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                    <div className="bg-tertiary-container h-full transition-[width] duration-1000 ease-out" style={{ width: mounted ? '18%' : '0px' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-label-md">
                    <span className="text-on-surface">Electronics</span>
                    <span className="font-bold text-primary">12%</span>
                  </div>
                  <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
                    <div className="bg-outline h-full transition-[width] duration-1000 ease-out" style={{ width: mounted ? '12%' : '0px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Activity Feed */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="px-stack-lg py-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h4 className="text-headline-sm font-headline-md text-primary">Recent Activity</h4>
              <button className="text-label-md text-primary hover:underline font-bold">View All</button>
            </div>
            <div className="divide-y divide-outline-variant">
              <div className="p-stack-lg flex items-start space-x-4 hover:bg-surface-container transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </div>
                <div className="flex-1">
                  <p className="text-body-md text-on-surface">
                    <span className="font-bold text-primary">New Sale:</span> Rare Rolex Submariner (Reference 5513) sold by <span className="font-bold">ArtisanHorology</span>.
                  </p>
                  <p className="text-label-sm text-on-surface-variant mt-1">2 minutes ago</p>
                </div>
                <div className="text-right">
                  <p className="text-label-md font-bold text-secondary">+€14,200.00</p>
                  <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Completed</span>
                </div>
              </div>
              <div className="p-stack-lg flex items-start space-x-4 hover:bg-surface-container transition-colors">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <div className="flex-1">
                  <p className="text-body-md text-on-surface">
                    <span className="font-bold text-primary">New Seller:</span> <span className="font-bold">Gallery Modern</span> has been verified and joined the platform.
                  </p>
                  <p className="text-label-sm text-on-surface-variant mt-1">15 minutes ago</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Verified</span>
                </div>
              </div>
              <div className="p-stack-lg flex items-start space-x-4 hover:bg-surface-container transition-colors">
                <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">report</span>
                </div>
                <div className="flex-1">
                  <p className="text-body-md text-on-surface">
                    <span className="font-bold text-primary">Listing Flagged:</span> "Limited Edition Sneakers" reported for suspicious authenticity.
                  </p>
                  <p className="text-label-sm text-on-surface-variant mt-1">42 minutes ago</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] bg-error-container text-on-error-container px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Review Needed</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-auto bg-[#1a2b4c] text-white">
          <div className="max-w-container-max mx-auto px-margin-desktop py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              {/* Brand Column */}
              <div className="md:col-span-5 space-y-6">
                <Link className="flex items-center gap-3" to="/">
                  <img alt="Omnes MarketPlace Logo" className="h-9 w-auto brightness-0 invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaj3vHZb9tkC91jen03F2veXvobHo9ezqHF6qQdK8ryNbungIosTMi0YG7Gplu3fetQgz6iUdP0m79CxTU7e-HisF85uH7ZvKEQWTsWSAJBt-Ddz4SxM3kR67EXGjUIGpXFh2_LUHL8qa8Vgnpq6vWH-6i04ol12JzKV_eLbtQyuM-L9aTreBqzBxQr_iDxMLbXy-eAps7aFh0uQNuS4O5mdAqfy0KTVjgyKQMbmqB3zoSCL98I029TfPQ4Ck5kBnccDWceEZp2ws"/>
                  <span className="text-label-md font-bold tracking-[0.15em] uppercase font-headline-md text-white">Omnes MarketPlace</span>
                </Link>
                <p className="text-primary-fixed/70 text-body-md max-w-sm">The official premium marketplace for the Omnes Education community. Curating excellence for students and faculty alike.</p>
                <div className="flex space-x-4">
                  <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-secondary-container hover:text-on-secondary-container transition-all" href="#"><span className="material-symbols-outlined">public</span></a>
                  <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-secondary-container hover:text-on-secondary-container transition-all" href="#"><span className="material-symbols-outlined">chat</span></a>
                  <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-secondary-container hover:text-on-secondary-container transition-all" href="#"><span className="material-symbols-outlined">share</span></a>
                </div>
              </div>
              {/* Links Grid */}
              <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-primary-fixed text-label-md uppercase tracking-wider">Marketplace</h4>
                  <nav className="flex flex-col space-y-3">
                    <Link className="text-primary-fixed/60 hover:text-white transition-colors text-label-md" to="/browse">Browse All</Link>
                    <Link className="text-primary-fixed/60 hover:text-white transition-colors text-label-md" to="#">Rare Items</Link>
                    <Link className="text-primary-fixed/60 hover:text-white transition-colors text-label-md" to="#">Daily Selection</Link>
                    <Link className="text-primary-fixed/60 hover:text-white transition-colors text-label-md" to="#">Sell With Us</Link>
                  </nav>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-primary-fixed text-label-md uppercase tracking-wider">Support</h4>
                  <nav className="flex flex-col space-y-3">
                    <Link className="text-primary-fixed/60 hover:text-white transition-colors text-label-md" to="#">Contact Hub</Link>
                    <Link className="text-primary-fixed/60 hover:text-white transition-colors text-label-md" to="#">Student Guidelines</Link>
                    <Link className="text-primary-fixed/60 hover:text-white transition-colors text-label-md" to="#">Help Center</Link>
                  </nav>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-primary-fixed text-label-md uppercase tracking-wider">Legal</h4>
                  <nav className="flex flex-col space-y-3">
                    <Link className="text-primary-fixed/60 hover:text-white transition-colors text-label-md" to="#">Privacy Policy</Link>
                    <Link className="text-primary-fixed/60 hover:text-white transition-colors text-label-md" to="#">Terms of Service</Link>
                    <Link className="text-primary-fixed/60 hover:text-white transition-colors text-label-md" to="#">Compliance</Link>
                  </nav>
                </div>
              </div>
            </div>
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-primary-fixed/40 text-label-sm">© 2024 Omnes Education. All rights reserved.</p>
              <div className="flex gap-6">
                <span className="text-primary-fixed/40 text-label-sm">Designed for Excellence</span>
                <span className="text-primary-fixed/40 text-label-sm">Paris, FR</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Admin;
