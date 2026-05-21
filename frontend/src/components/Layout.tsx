import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-secondary-container selection:text-on-secondary-container">
      <Header />
      <main className="space-y-stack-lg">
        {children}
      </main>
      <footer className="bg-surface-container-lowest border-t border-outline-variant/50 pt-16 pb-8 mt-stack-lg">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-12">
            <div className="col-span-1 md:col-span-2 space-y-4">
              <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <img 
                  alt="Omnes MarketPlace Logo" 
                  className="h-8 w-auto grayscale" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaj3vHZb9tkC91jen03F2veXvobHo9ezqHF6qQdK8ryNbungIosTMi0YG7Gplu3fetQgz6iUdP0m79CxTU7e-HisF85uH7ZvKEQWTsWSAJBt-Ddz4SxM3kR67EXGjUIGpXFh2_LUHL8qa8Vgnpq6vWH-6i04ol12JzKV_eLbtQyuM-L9aTreBqzBxQr_iDxMLbXy-eAps7aFh0uQNuS4O5mdAqfy0KTVjgyKQMbmqB3zoSCL98I029TfPQ4Ck5kBnccDWceEZp2ws"
                />
                <span className="text-label-md font-bold text-primary tracking-widest uppercase">Omnes MarketPlace</span>
              </a>
              <p className="text-body-md text-on-surface-variant max-w-sm">
                The premier marketplace for the Omnes Education community. Empowering students and faculty through a professional trading platform.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-4 uppercase text-label-sm tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="/browse">Browse Products</a></li>
                <li><a className="hover:text-primary transition-colors" href="/sell">Sell Items</a></li>
                <li><a className="hover:text-primary transition-colors" href="/support">Support Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="/terms">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-4 uppercase text-label-sm tracking-wider">Contact</h4>
              <ul className="space-y-2 text-on-surface-variant">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">mail</span> marketplace@omnes.edu</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm">location_on</span> Paris, France</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-outline-variant/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-label-sm text-on-surface-variant">
            <p>© 2024 Omnes MarketPlace. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
