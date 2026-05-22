import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import apiClient from '../services/apiClient';
import { useAuthStore } from '../store/authStore';

interface DashboardStats {
  users: { total: number; active: number; buyers: number; sellers: number; admins: number; banned: number };
  products: { total: number; active: number; inactive: number };
  orders: { total: number; pending: number; processing: number; shipped: number; delivered: number; cancelled: number };
  negotiations: { total: number; pending: number; accepted: number; rejected: number };
  revenue: { total_orders: number; total_revenue: number; avg_order_value: number; delivered_revenue: number };
}

interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  status: string;
  first_name: string | null;
  last_name: string | null;
  roles: string[];
  created_at: string;
}

const ROLE_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Buyers', value: 'buyer' },
  { label: 'Sellers', value: 'seller' },
  { label: 'Admins', value: 'admin' },
] as const;

export const Admin: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const loadData = async (role: string) => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = {};
      if (role) params.role = role;
      const [statsRes, usersRes] = await Promise.all([
        apiClient.get('/admin/analytics/overview'),
        apiClient.get('/admin/users', { params }),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to load data';
      setError(msg);
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData('');
  }, []);

  const handleFilterChange = (value: string) => {
    setRoleFilter(value);
    loadData(value);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-73px)] w-full overflow-hidden">
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

          {error && (
            <div className="mb-stack-lg bg-error-container text-on-error-container p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
            <AdminStatCard 
              label="Total Revenue" 
              value={stats ? `$${stats.revenue.total_revenue.toLocaleString()}` : '-'} 
              trend={stats ? `${stats.revenue.total_orders} orders` : ''} 
              icon="payments" 
              color="secondary" 
            />
            <AdminStatCard 
              label="Active Buyers" 
              value={stats ? stats.users.buyers.toLocaleString() : '-'} 
              trend={stats ? `${stats.users.sellers} sellers` : ''} 
              icon="group" 
              color="primary" 
            />
            <AdminStatCard 
              label="Live Listings" 
              value={stats ? stats.products.active.toLocaleString() : '-'} 
              trend={`${stats ? stats.products.total : 0} total`} 
              icon="list_alt" 
              color="tertiary" 
            />
            <AdminStatCard 
              label="Pending Orders" 
              value={stats ? stats.orders.pending.toLocaleString() : '-'} 
              trend={stats ? `${stats.negotiations.pending} pending negotations` : ''} 
              icon="pending_actions" 
              color="error" 
            />
          </div>

          <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-headline-md font-headline-md text-primary">Users</h2>
              <div className="flex gap-2">
                {ROLE_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => handleFilterChange(f.value)}
                    className={`px-4 py-2 rounded-lg text-label-md font-bold transition-all ${
                      roleFilter === f.value
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center text-on-surface-variant">Loading...</div>
              ) : users.length === 0 ? (
                <div className="p-6 text-center text-on-surface-variant">No users found.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-label-sm uppercase tracking-wider text-on-surface-variant">
                      <th className="px-6 py-4 font-bold">Name</th>
                      <th className="px-6 py-4 font-bold">Email</th>
                      <th className="px-6 py-4 font-bold">Role</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant text-body-md">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-surface-bright transition-colors">
                        <td className="px-6 py-4 font-bold text-primary">
                          {u.first_name || u.username} {u.last_name || ''}
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant">{u.email}</td>
                        <td className="px-6 py-4">
                          {u.roles?.map((role) => (
                            <span
                              key={role}
                              className={`inline-block px-3 py-1 rounded-full text-label-sm font-bold mr-1 ${
                                role === 'admin'
                                  ? 'bg-error-container text-on-error-container'
                                  : role === 'seller'
                                  ? 'bg-tertiary-container text-on-tertiary-container'
                                  : 'bg-primary-container text-on-primary-container'
                              }`}
                            >
                              {role}
                            </span>
                          ))}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-label-sm font-bold ${
                            u.status === 'active' 
                              ? 'bg-secondary-container text-on-secondary-container' 
                              : 'bg-error-container text-on-error-container'
                          }`}>{u.status}</span>
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
      <span className={`text-label-sm font-bold ${!trend.startsWith('-') ? 'text-secondary' : 'text-error'}`}>{trend}</span>
    </div>
    <p className="text-label-md text-on-surface-variant">{label}</p>
    <p className="text-headline-md font-headline-md text-primary">{value}</p>
  </div>
);
