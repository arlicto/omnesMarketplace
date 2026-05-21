import React from 'react';
import { Layout } from '../components/Layout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export const SellerAccount: React.FC = () => {
  return (
    <Layout>
      <main className="flex min-h-[calc(100vh-140px)] max-w-container-max mx-auto">
        {/* SideNavBar */}
        <aside className="bg-surface-container-low border-r border-outline-variant h-auto w-64 hidden md:flex flex-col p-stack-md space-y-stack-sm sticky top-[73px]">
          <div className="mb-stack-lg flex flex-col items-center text-center">
            <img 
              alt="Omnes Logo" 
              className="h-12 w-auto object-contain mb-2" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaj3vHZb9tkC91jen03F2veXvobHo9ezqHF6qQdK8ryNbungIosTMi0YG7Gplu3fetQgz6iUdP0m79CxTU7e-HisF85uH7ZvKEQWTsWSAJBt-Ddz4SxM3kR67EXGjUIGpXFh2_LUHL8qa8Vgnpq6vWH-6i04ol12JzKV_eLbtQyuM-L9aTreBqzBxQr_iDxMLbXy-eAps7aFh0uQNuS4O5mdAqfy0KTVjgyKQMbmqB3zoSCL98I029TfPQ4Ck5kBnccDWceEZp2ws" 
            />
            <div className="text-label-md font-headline-md font-bold text-primary uppercase tracking-tight">Omnes MarketPlace</div>
            <div className="text-[11px] font-label-md text-on-surface-variant mt-1">Seller Panel</div>
          </div>
          <nav className="space-y-1">
            <SidebarLink icon="dashboard" label="Dashboard" />
            <SidebarLink icon="storefront" label="Inventory" />
            <SidebarLink icon="handshake" label="Negotiations" />
            <SidebarLink icon="list_alt" label="Add Listing" active />
            <SidebarLink icon="settings" label="Settings" />
          </nav>
        </aside>

        {/* Content Canvas */}
        <section className="flex-1 p-margin-desktop max-w-[1016px] mx-auto">
          {/* Seller Profile Header */}
          <div className="relative w-full rounded-xl overflow-hidden mb-stack-lg shadow-sm border border-outline-variant">
            <div className="h-48 w-full bg-primary-container relative">
              <img 
                alt="Seller Banner" 
                className="w-full h-full object-cover opacity-60" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrZniTQBff2gRIU6qfw2APbzj_3pUCcZm-qtXQQ95YqiWdk8q6LopKl_1EN9QZzJOAHCg_Op2znvUIYjsIMjHO481pMenyRr37fhQxw-7muIqw7W03OIVpiU9esPtFBdLuihNZwr1i6APTeUeehdBuKiNSY_cgbpyTQ1Hi0SzQVOObhyil_j8KbZUx3hJ2HPwaTF2BAez4ggbk98CuuR4dxgpTOIdkiEUAzIP3kZLLE4qPg6TBPZBp3iHKw3kW2lciwoLpg-_9xxk" 
              />
            </div>
            <div className="p-stack-lg bg-surface flex flex-col md:flex-row items-end md:items-center -mt-12 relative z-10">
              <div className="w-24 h-24 rounded-xl border-4 border-surface shadow-lg overflow-hidden bg-white mb-4 md:mb-0">
                <img 
                  alt="Seller Profile" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpQfdFmDF00suQsl0lGKA_K3bF5vhM0M61wjja_HECr5Sy98Ihzy5M8_2a4NChNE8TXTaRqgUoVrC3MMApKy0cPlW_k5HX5_geirmX_soR4h51Im3uSEO50Axz-oSWtXVhUjteMq2JjioMHCEZKzA6E5Q8oBUM46Ryw4mcx5PnOB1sD_jCjk7M_WGhXqUuDG1SPZR-BoHOuiFbtgNULB812km0_C4NUarEXghqImqddwrZIdvifpkqw5_bzTtEU_sxwc8fPL-mTJU" 
                />
              </div>
              <div className="md:ml-stack-md flex-1 text-center md:text-left">
                <h1 className="text-headline-lg font-headline-lg text-primary">Elite Collector Group</h1>
                <p className="text-body-md text-on-surface-variant max-w-2xl">Specializing in high-end curation and authenticated luxury assets for discerning individual collectors worldwide.</p>
              </div>
              <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
                <div className="flex items-center bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-bold mb-1">
                  <span className="material-symbols-outlined text-sm mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span>4.9 Rating</span>
                </div>
                <span className="text-label-sm text-on-surface-variant">248 Sales Completed</span>
              </div>
            </div>
          </div>

          {/* Form: Add New Item */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-stack-lg shadow-sm">
            <div className="flex items-center justify-between mb-stack-lg border-b border-outline-variant pb-4">
              <div>
                <h2 className="text-headline-md font-headline-md text-primary">Add New Item</h2>
                <p className="text-label-md font-label-md text-on-surface-variant">Listing ID: <span className="font-mono text-primary">AUTO-823-GEN</span></p>
              </div>
            </div>
            <form className="space-y-stack-md" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <div className="space-y-stack-md">
                  <Input label="Item Name" placeholder="e.g. 1964 Vintage Chronograph" />
                  <div className="flex flex-col gap-2">
                    <label className="text-label-sm text-on-surface-variant uppercase">Category</label>
                    <select className="w-full border-outline-variant rounded-lg p-3 bg-surface">
                      <option>Rare Items</option>
                      <option>High-end</option>
                      <option>Regular</option>
                    </select>
                  </div>
                  <Input label="Price ($)" type="number" placeholder="0.00" />
                </div>
                <div className="space-y-stack-md">
                  <div className="flex flex-col gap-2">
                    <label className="text-label-sm text-on-surface-variant uppercase">Description</label>
                    <textarea 
                      className="w-full border-outline-variant rounded-lg p-3 bg-surface h-32" 
                      placeholder="Detail the provenance, condition, and unique features..."
                    ></textarea>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-label-sm text-on-surface-variant uppercase">Sale Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      <SaleTypeOption label="Buy Now" active />
                      <SaleTypeOption label="Negotiation" />
                      <SaleTypeOption label="Best Offer" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-outline-variant flex justify-end gap-4">
                <Button variant="outline">Save Draft</Button>
                <Button>Publish Listing</Button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </Layout>
  );
};

const SidebarLink: React.FC<{ icon: string, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <a className={`flex items-center space-x-3 p-3 rounded-lg transition-all font-label-md ${
    active ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant'
  }`} href="#">
    <span className="material-symbols-outlined">{icon}</span>
    <span>{label}</span>
  </a>
);

const SaleTypeOption: React.FC<{ label: string, active?: boolean }> = ({ label, active }) => (
  <button className={`py-2 px-1 rounded-lg border text-label-sm transition-all ${
    active ? 'border-primary bg-primary-container text-on-primary-container font-bold' : 'border-outline-variant text-on-surface-variant'
  }`}>
    {label}
  </button>
);
