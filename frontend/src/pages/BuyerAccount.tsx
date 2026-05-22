import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/apiClient';

export const BuyerAccount: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({ negotiations: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/negotiations/offers/buyer')
      .then(r => {
        const list = r.data.negotiations || [];
        setStats({ negotiations: list.length });
        setRecent(list.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettings = () => {
    alert('Coming soon');
  };

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg flex flex-col md:flex-row gap-gutter">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface-container-low rounded-xl p-stack-md flex flex-col space-y-stack-sm h-fit">
            <div className="pb-4 mb-4 border-b border-outline-variant">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant/50">person</span>
                </div>
                <div>
                  <p className="font-headline-md text-label-md text-on-surface">{user?.username || 'Account'}</p>
                  <p className="text-label-sm text-on-surface-variant">{user?.email || ''}</p>
                </div>
              </div>
            </div>
            <nav className="flex flex-col space-y-1">
              <SidebarLink icon="dashboard" label="Overview" active onClick={() => {}} />
              <SidebarLink icon="shopping_bag" label="My Orders" onClick={() => navigate('/account')} />
              <SidebarLink icon="gavel" label="Active Bids" onClick={() => navigate('/browse')} />
              <SidebarLink icon="handshake" label="Active Negotiations" onClick={() => navigate('/negotiations')} />
              <SidebarLink icon="favorite" label="Watchlist" onClick={() => navigate('/browse')} />
              <SidebarLink icon="settings" label="Settings" onClick={handleSettings} />
              <div className="pt-4 mt-4 border-t border-outline-variant">
                <SidebarLink icon="logout" label="Logout" variant="error" onClick={handleLogout} />
              </div>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-grow space-y-stack-lg">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-headline-lg font-headline-lg text-primary">Buyer Overview</h1>
              <p className="text-body-md text-on-surface-variant">Welcome back, {user?.username || 'there'}. Here's what's happening with your account.</p>
            </div>
            <button onClick={() => navigate('/browse')} className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md shadow-sm hover:opacity-90 transition-opacity">
              Browse Marketplace
            </button>
          </div>

          {/* Stats Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <StatCard icon="shopping_cart" label="Items Bought" value="—" trend="Coming soon" color="secondary" />
            <StatCard icon="gavel" label="Active Negotiations" value={String(stats.negotiations)} trend="Across all products" color="primary" />
            <StatCard icon="payments" label="Total Spent" value="—" trend="Coming soon" color="tertiary" />
          </div>

          {/* Recent Activity */}
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h2 className="text-headline-md font-headline-md text-primary">Recent Activity</h2>
            </div>
            <div className="divide-y divide-outline-variant">
              {recent.length === 0 ? (
                <p className="p-6 text-body-md text-on-surface-variant text-center">No recent activity.</p>
              ) : (
                recent.map((n: any, i: number) => (
                  <ActivityItem
                    key={n.id || i}
                    title="Negotiation Offer"
                    description={`You offered $${Number(n.initial_offer).toLocaleString()} on product #${n.product_id}`}
                    time={n.created_at ? new Date(n.created_at).toLocaleDateString() : ''}
                    icon="handshake"
                  />
                ))
              )}
            </div>
          </section>
        </section>
      </main>
    </Layout>
  );
};

const SidebarLink: React.FC<{ icon: string, label: string, active?: boolean, variant?: 'default' | 'error', onClick?: () => void }> = ({
  icon, label, active, variant = 'default', onClick
}) => (
  <a
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
      active
        ? 'bg-primary-container text-on-primary-container font-bold scale-95'
        : variant === 'error'
          ? 'text-error hover:bg-error-container/10'
          : 'text-on-surface-variant hover:bg-surface-variant'
    }`}
    onClick={(e) => {
      e.preventDefault();
      onClick?.();
    }}
  >
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-label-md">{label}</span>
  </a>
);

const StatCard: React.FC<{ icon: string, label: string, value: string, trend: string, color: string }> = ({
  icon, label, value, trend, color
}) => (
  <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <span className={`material-symbols-outlined text-${color} text-headline-md`}>{icon}</span>
      <span className={`text-label-sm text-on-${color}-container bg-${color}-container/10 px-2 py-1 rounded`}>{trend}</span>
    </div>
    <div className="mt-4">
      <p className="text-label-md text-on-surface-variant">{label}</p>
      <p className="text-headline-lg font-headline-lg text-primary">{value}</p>
    </div>
  </div>
);

const ActivityItem: React.FC<{ title: string, description: string, time: string, icon: string }> = ({
  title, description, time, icon
}) => (
  <div className="p-6 flex gap-4 hover:bg-surface-bright transition-colors">
    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-primary">{icon}</span>
    </div>
    <div className="flex-grow">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-primary">{title}</h3>
        <span className="text-label-sm text-on-surface-variant">{time}</span>
      </div>
      <p className="text-body-md text-on-surface-variant">{description}</p>
    </div>
  </div>
);
