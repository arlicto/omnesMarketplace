import React from 'react';

export const Header: React.FC = () => {
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
          <a className="text-primary border-b-2 border-primary pb-1 font-bold text-label-md hover:opacity-80 transition-all" href="/">Home</a>
          <a className="text-on-surface-variant font-medium text-label-md hover:text-primary transition-colors" href="/browse">Browse All</a>
          <a className="text-on-surface-variant font-medium text-label-md hover:text-primary transition-colors" href="/notifications">Notifications</a>
          <a className="text-on-surface-variant font-medium text-label-md hover:text-primary transition-colors" href="/cart">Cart</a>
          <a className="text-on-surface-variant font-medium text-label-md hover:text-primary transition-colors" href="/account">Your Account</a>
        </nav>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all">search</button>
          <button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all">shopping_cart</button>
          <button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all">account_circle</button>
        </div>
      </div>
    </header>
  );
};
