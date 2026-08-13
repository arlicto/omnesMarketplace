import { Link, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/react';
import { useRef, useState, useLayoutEffect, useCallback } from 'react';

const Header = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { pathname } = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const isActive = useCallback(
    (path: string) => (path === '/' ? pathname === '/' : pathname.startsWith(path)),
    [pathname],
  );

  const prevPathname = useRef(pathname);

  useLayoutEffect(() => {
    const link = linksRef.current.get(pathname);
    if (!link || !navRef.current) {
      setIndicator({ left: 0, width: 0 });
      return;
    }

    const navRect = navRef.current.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const newLeft = linkRect.left - navRect.left;
    const newWidth = linkRect.width;

    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setIndicator(prev => ({ ...prev, width: newWidth }));
      requestAnimationFrame(() => {
        setIndicator(prev => ({ ...prev, left: newLeft }));
      });
    } else {
      setIndicator({ left: newLeft, width: newWidth });
    }
  }, [pathname, isSignedIn]);

  const setLinkRef = (path: string) => (el: HTMLAnchorElement | null) => {
    if (el) linksRef.current.set(path, el);
    else linksRef.current.delete(path);
  };

  const linkClass = (path: string) =>
    `text-label-md pb-1 transition-colors duration-300 ${
      isActive(path)
        ? 'text-primary font-bold'
        : 'text-on-surface-variant font-medium hover:text-primary'
    }`;

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/browse', label: 'Browse All' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/cart', label: 'Cart' },

  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-outline-variant/50 shadow-sm">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-3 max-w-container-max mx-auto">
        <Link className="flex items-center gap-3 group" to="/">
          <img alt="Omnes MarketPlace Logo" className="h-9 w-auto object-contain transition-transform group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaj3vHZb9tkC91jen03F2veXvobHo9ezqHF6qQdK8ryNbungIosTMi0YG7Gplu3fetQgz6iUdP0m79CxTU7e-HisF85uH7ZvKEQWTsWSAJBt-Ddz4SxM3kR67EXGjUIGpXFh2_LUHL8qa8Vgnpq6vWH-6i04ol12JzKV_eLbtQyuM-L9aTreBqzBxQr_iDxMLbXy-eAps7aFh0uQNuS4O5mdAqfy0KTVjgyKQMbmqB3zoSCL98I029TfPQ4Ck5kBnccDWceEZp2ws"/>
          <span className="text-label-md font-bold text-primary font-headline-md tracking-[0.1em] uppercase">Omnes MarketPlace</span>
        </Link>
        <nav ref={navRef} className="hidden lg:flex items-center gap-8 relative">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              ref={setLinkRef(path)}
              className={linkClass(path)}
              to={path}
            >
              {label}
            </Link>
          ))}
          {indicator.width > 0 && (
            <div
              className="absolute bottom-0 h-0.5 bg-primary rounded-full transition-transform duration-500 ease-in-out"
              style={{ left: 0, width: indicator.width, transform: `translateX(${indicator.left}px)` }}
            />
          )}
        </nav>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all">search</button>
          <Link to="/cart" className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all">shopping_cart</Link>
          {isSignedIn ? (
            <Link to="/account">
              {user?.imageUrl ? (
                <img alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-outline-variant hover:border-primary transition-colors" src={user.imageUrl} />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary text-label-sm font-bold">
                  {(user?.fullName || user?.firstName || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className="material-symbols-outlined p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all"
            >account_circle</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

# 1781893089508817591

# 1784312287787395707

# 1786645088424489197
