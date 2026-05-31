import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1a2b4c] text-white">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <Link className="flex items-center gap-3" to="/">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-lg">store</span>
              </div>
              <span className="text-label-md font-bold tracking-[0.15em] uppercase font-headline-md text-white">Omnes MarketPlace</span>
            </Link>
            <p className="text-primary-fixed/70 text-body-md max-w-sm">The official premium marketplace for the Omnes Education community. Curating excellence for students and faculty alike.</p>
            <div className="flex space-x-4">
              <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-secondary-container hover:text-on-secondary-container transition-all" href="#"><span className="material-symbols-outlined text-lg">public</span></a>
              <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-secondary-container hover:text-on-secondary-container transition-all" href="#"><span className="material-symbols-outlined text-lg">chat</span></a>
              <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-secondary-container hover:text-on-secondary-container transition-all" href="#"><span className="material-symbols-outlined text-lg">share</span></a>
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
  );
};

export default Footer;

# 1780251487668562981
