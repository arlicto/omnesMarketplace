import React from 'react';
import { Layout } from '../components/Layout';

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Negotiation Offer',
    message: 'A seller has countered your offer for the "Vintage Leica M3". Review the new price now.',
    time: '5 mins ago',
    type: 'negotiation',
    unread: true,
    icon: 'handshake'
  },
  {
    id: '2',
    title: 'Price Drop Alert',
    message: 'An item in your watchlist "Modernist Lamp" has decreased by 15%.',
    time: '2 hours ago',
    type: 'alert',
    unread: true,
    icon: 'trending_down'
  },
  {
    id: '3',
    title: 'Order Dispatched',
    message: 'Your order #8842 for the "Leather Portfolio" has been handed over to the courier.',
    time: 'Yesterday',
    type: 'order',
    unread: false,
    icon: 'local_shipping'
  },
  {
    id: '4',
    title: 'Welcome to Omnes MarketPlace',
    message: 'Discover our community guidelines and start your first transaction today.',
    time: '3 days ago',
    type: 'system',
    unread: false,
    icon: 'info'
  }
];

export const Notifications: React.FC = () => {
  return (
    <Layout>
      <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        <header className="mb-stack-lg flex justify-between items-end">
          <div>
            <h1 className="text-headline-lg font-headline-lg text-primary">Notifications</h1>
            <p className="text-body-md text-on-surface-variant">Stay updated with your latest transactions and alerts.</p>
          </div>
          <button className="text-primary font-bold text-label-md hover:underline">Mark all as read</button>
        </header>

        <section className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden divide-y divide-outline-variant">
          {NOTIFICATIONS.map(notification => (
            <div 
              key={notification.id} 
              className={`p-6 flex gap-4 transition-colors hover:bg-surface-bright ${notification.unread ? 'bg-primary-container/5' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                notification.unread ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined">{notification.icon}</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold ${notification.unread ? 'text-primary' : 'text-on-surface'}`}>
                    {notification.title}
                  </h3>
                  <span className="text-label-sm text-on-surface-variant">{notification.time}</span>
                </div>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {notification.message}
                </p>
                <div className="mt-3 flex gap-3">
                  <button className="text-label-sm font-bold text-primary hover:underline uppercase tracking-wider">
                    View Details
                  </button>
                  {notification.unread && (
                    <button className="text-label-sm font-medium text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider">
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
              {notification.unread && (
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              )}
            </div>
          ))}
        </section>

        <footer className="mt-stack-lg text-center">
          <button className="px-8 py-3 border-2 border-outline-variant rounded-lg font-bold text-on-surface-variant hover:bg-surface-container transition-all">
            Load Older Notifications
          </button>
        </footer>
      </main>
    </Layout>
  );
};
