import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInputRef.current?.value;
    if (query) {
      navigate(`/browse?search=${encodeURIComponent(query)}`);
      setShowSearch(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-outline-variant/50 shadow-sm">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-3 max-w-container-max mx-auto">
        <a className="flex items-center gap-3 group" href="/">
          <img 
            alt="Omnes MarketPlace Logo" 
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaj3vHZb9tkC91jen03F2veXvobHo9ezqHF6qQdK8ryNbungIosTMi0YG7Gplu3fetQgz6iUdP0m79CxTU7e-HisF85uH7ZvKEQWTsWSAJBt-Ddz4SxM3kR67EXGjUIGpXFh2_LUHL8qa8Vgnpq6vWH-6i04ol12JzKV_eLbtQyuM-L9aTreBqzBxQr_iDxMLbXy-eAps7aFh0uQNuS4O5mdAqfy0KTVjgyKQMbmqB3zoSCL98I029TfPQ4Ck5kBnccDWceEZp2ws"
          />
          <span className="text-label-md font-bold text-primary font-headline-md tracking-[0.1em] uppercase">Omnes MarketPlace</span>
        </a>
        <nav className="hidden lg:flex items-center space-x-8">
          <a 
            className={`${location.pathname === '/' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant font-medium'} text-label-md hover:opacity-80 transition-all`} 
            href="/"
          >
            Home
          </a>
          <a 
            className={`${location.pathname === '/browse' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant font-medium'} text-label-md hover:text-primary transition-colors`} 
            href="/browse"
          >
            Browse All
          </a>
          <a 
            className={`${location.pathname === '/notifications' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant font-medium'} text-label-md hover:text-primary transition-colors`} 
            href="/notifications"
          >
            Notifications
          </a>
        </nav>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button 
            className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all"
            onClick={() => setShowSearch(!showSearch)}
            aria-label="Search"
          >
            search
          </button>
          <button 
            className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all"
            onClick={() => navigate('/cart')}
            aria-label="Cart"
          >
            shopping_cart
          </button>
          <button 
            className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all"
            onClick={() => navigate('/account')}
            aria-label="Account"
          >
            account_circle
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      {showSearch && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-outline-variant shadow-lg px-margin-mobile md:px-margin-desktop py-4">
          <form onSubmit={handleSearch} className="max-w-container-max mx-auto">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-12 bg-surface-container border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              >
                close
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};
