import React from 'react';
import { Layout } from '../components/Layout';

export const Admin: React.FC = () => {
  return (
    <Layout>
      <div className="flex h-[calc(100vh-73px)] w-full overflow-hidden">
        {/* SideNavBar */}
        <aside className="bg-surface-container-low border-r border-outline-variant w-64 hidden md:flex flex-col p-stack-md space-y-stack-sm h-full">
          <div className="mb-stack-lg flex flex-col items-center text-center">
            <img 
              alt="Omnes Logo" 
              className="h-12 w-auto object-contain mb-2" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaj3vHZb9tkC91jen03F2veXvobHo9ezqHF6qQdK8ryNbungIosTMi0YG7Gplu3fetQgz6iUdP0m79CxTU7e-HisF85uH7ZvKEQWTsWSAJBt-Ddz4SxM3kR67EXGjUIGpXFh2_LUHL8qa8Vgnpq6vWH-6i04ol12JzKV_eLbtQyuM-L9aTreBqzBxQr_iDxMLbXy-eAps7aFh0uQNuS4O5mdAqfy0KTVjgyKQMbmqB3zoSCL98I029TfPQ4Ck5kBnccDWceEZp2ws" 
            />
            <div className="text-label-md font-headline-md font-bold text-primary uppercase tracking-tight">Omnes MarketPlace</div>
            <div className="text-[11px] font-label-md text-on-surface-variant mt-1">Admin Control Center</div>
          </div>
          <nav className="space-y-1">
            <AdminSidebarLink icon="dashboard" label="Dashboard" active />
            <AdminSidebarLink icon="storefront" label="Sellers" />
            <AdminSidebarLink icon="group" label="Buyers" />
            <AdminSidebarLink icon="list_alt" label="Listings" />
            <AdminSidebarLink icon="payments" label="Transactions" />
            <AdminSidebarLink icon="settings" label="Settings" />
          </nav>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-surface-bright p-margin-desktop">
          <header className="mb-stack-lg flex justify-between items-center">
            <div>
              <h1 className="text-headline-lg font-headline-lg text-primary">System Dashboard</h1>
              <p className="text-body-md text-on-surface-variant">Real-time overview of the marketplace ecosystem.</p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant rounded-lg text-label-md font-bold text-on-surface-variant hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined">download</span> Export Report
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
            <AdminStatCard label="Total Revenue" value="$42,390" trend="+12%" icon="payments" color="secondary" />
            <AdminStatCard label="Active Users" value="1,204" trend="+5%" icon="group" color="primary" />
            <AdminStatCard label="Live Listings" value="842" trend="-2%" icon="list_alt" color="tertiary" />
            <AdminStatCard label="Approval Queue" value="12" trend="Pending" icon="pending_actions" color="error" />
          </div>

          {/* Recent Listings Table */}
          <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h2 className="text-headline-md font-headline-md text-primary">Recent Listings</h2>
              <button className="text-primary font-bold text-label-md hover:underline">Manage All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-label-sm uppercase tracking-wider text-on-surface-variant">
                    <th className="px-6 py-4 font-bold">Item</th>
                    <th className="px-6 py-4 font-bold">Seller</th>
                    <th className="px-6 py-4 font-bold">Price</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-body-md">
                  <ListingRow 
                    item="1964 Vintage Watch" 
                    seller="Elite Collector" 
                    price="$12,500" 
                    status="Live" 
                    statusColor="bg-secondary-container text-on-secondary-container"
                  />
                  <ListingRow 
                    item="Modernist Lamp" 
                    seller="Studio Design" 
                    price="$450" 
                    status="Pending" 
                    statusColor="bg-tertiary-container text-on-tertiary-container"
                  />
                  <ListingRow 
                    item="Leica M3 Camera" 
                    seller="Photo Hub" 
                    price="$3,200" 
                    status="Sold" 
                    statusColor="bg-primary-container text-on-primary-container"
                  />
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
};

const AdminSidebarLink: React.FC<{ icon: string, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <a className={`flex items-center space-x-3 p-3 rounded-lg transition-all font-label-md ${
    active ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant'
  }`} href="#">
    <span className="material-symbols-outlined">{icon}</span>
    <span>{label}</span>
  </a>
);

const AdminStatCard: React.FC<{ label: string, value: string, trend: string, icon: string, color: string }> = ({ 
  label, value, trend, icon, color 
}) => (
  <div className="bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg bg-${color}-container/10 text-${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className={`text-label-sm font-bold ${trend.startsWith('+') ? 'text-secondary' : 'text-error'}`}>{trend}</span>
    </div>
    <p className="text-label-md text-on-surface-variant">{label}</p>
    <p className="text-headline-md font-headline-md text-primary">{value}</p>
  </div>
);

const ListingRow: React.FC<{ item: string, seller: string, price: string, status: string, statusColor: string }> = ({ 
  item, seller, price, status, statusColor 
}) => (
  <tr className="hover:bg-surface-bright transition-colors">
    <td className="px-6 py-4 font-bold text-primary">{item}</td>
    <td className="px-6 py-4 text-on-surface-variant">{seller}</td>
    <td className="px-6 py-4 font-mono">{price}</td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 rounded-full text-label-sm font-bold ${statusColor}`}>{status}</span>
    </td>
    <td className="px-6 py-4">
      <button className="text-primary hover:text-primary/70 material-symbols-outlined">more_horiz</button>
    </td>
  </tr>
);
