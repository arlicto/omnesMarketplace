import { useEffect, useState } from "react";
import { useNotificationStore } from "../stores/notificationStore";
import Layout from "../components/Layout";

type Tab = "all" | "unread" | "archived";

const typeConfig: Record<string, { label: string; style: string }> = {
  outbid: { label: "Outbid", style: "bg-error text-on-error" },
  offer_accepted: { label: "Offer Accepted", style: "bg-secondary-container text-on-secondary-container" },
  offer_rejected: { label: "Offer Rejected", style: "bg-error-container text-on-error-container" },
  new_arrival: { label: "New Arrival", style: "bg-primary-fixed text-on-primary-fixed-variant" },
  price_drop: { label: "Price Drop", style: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
  auction_won: { label: "Auction Won", style: "bg-secondary-container text-on-secondary-container" },
  bid_update: { label: "Bid Update", style: "bg-primary-fixed text-on-primary-fixed-variant" },
  auction_ending: { label: "Auction Ending Soon", style: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
};

const defaultType = { label: "Update", style: "bg-surface-variant text-on-surface-variant" };

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const NotificationCard = ({ n, onMarkRead, onArchive }: { n: ReturnType<typeof useNotificationStore.getState>['items'][number]; onMarkRead: () => void; onArchive: () => void }) => {
  const typeInfo = typeConfig[n.type] || defaultType;
  return (
    <div
      className={`group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex gap-4 transition-all hover:shadow-lg hover:border-primary-fixed ${
        n.archived ? "opacity-80 grayscale-[0.5]" : ""
      }`}
    >
      <div className="flex-grow flex flex-col justify-between py-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {typeInfo && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${typeInfo.style}`}>
                {typeInfo.label}
              </span>
            )}
            {!n.read && (
              <span className="w-2 h-2 bg-error rounded-full" />
            )}
          </div>
          <div className="flex justify-between items-start">
            <h4 className="font-headline-md text-body-lg text-primary leading-tight">{n.title}</h4>
            <span className="text-label-sm text-outline whitespace-nowrap ml-2">{timeAgo(n.createdAt)}</span>
          </div>
          <p className="text-body-md text-on-surface-variant mt-1">{n.description}</p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {n.read ? (
              <button
                onClick={() => {/* already read */}}
                className="text-label-sm text-outline cursor-default"
              >
                Read
              </button>
            ) : (
              <button
                onClick={onMarkRead}
                className="text-label-sm text-secondary hover:underline"
              >
                Mark as read
              </button>
            )}
            {!n.archived && (
              <button
                onClick={onArchive}
                className="text-label-sm text-on-surface-variant hover:underline"
              >
                Archive
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [tab, setTab] = useState<Tab>("all");
  const [showPrefs, setShowPrefs] = useState(false);
  const { items, loading, fetchNotifications, markRead, archive } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All Notifications" },
    { key: "unread", label: "Unread" },
    { key: "archived", label: "Archived" },
  ];

  const filtered = items.filter((n) => {
    if (tab === "unread") return !n.read && !n.archived;
    if (tab === "archived") return n.archived;
    return !n.archived;
  });

  const unreadCount = items.filter((n) => !n.read && !n.archived).length;

  return (
    <Layout>
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Notifications &amp; Alerts</h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">Stay informed about your bidding status, favorite categories, and exclusive market updates.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowPrefs(true)} className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              Manage Preferences
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <aside className="lg:col-span-4 space-y-gutter">
            <section className="bg-surface-container-low border border-outline-variant rounded-xl p-stack-md shadow-sm">
              <div className="flex items-center gap-2 mb-stack-md">
                <span className="material-symbols-outlined text-secondary">add_alert</span>
                <h2 className="font-headline-md text-headline-md text-primary">Set Alert</h2>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="block font-label-sm text-on-surface-variant mb-1">Category</label>
                  <select className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                    <option>Fine Art &amp; Photography</option>
                    <option>Luxury Watches</option>
                    <option>Vintage Furniture</option>
                    <option>Rare Documents</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-sm text-on-surface-variant mb-1">Price Range (Min - Max)</label>
                  <div className="flex items-center gap-2">
                    <input className="w-1/2 bg-surface border border-outline-variant rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="0" type="number" />
                    <span className="text-outline">—</span>
                    <input className="w-1/2 bg-surface border border-outline-variant rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="10k" type="number" />
                  </div>
                </div>
                <div>
                  <label className="block font-label-sm text-on-surface-variant mb-1">Keywords</label>
                  <input className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Leica, Bauhaus, 1960s" type="text" />
                </div>
                <div className="pt-2">
                  <button className="w-full py-4 bg-secondary text-on-primary rounded-lg font-headline-md hover:brightness-110 transition-all shadow-md active:scale-[0.98]" type="button">
                    Save Alert
                  </button>
                </div>
              </form>
            </section>
            <section className="bg-gradient-to-br from-secondary-container/40 to-surface-container-low border border-secondary-container/40 rounded-xl p-stack-md shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider">Your Alert Activity</h3>
                <span className="material-symbols-outlined text-secondary text-xl">bar_chart</span>
              </div>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-headline-xl font-headline-xl text-primary">12</span>
                <span className="text-body-md text-on-surface-variant">Active Alerts</span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-body-md mb-1">
                    <span className="flex items-center gap-1.5 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm text-secondary">local_fire_department</span>
                      Keyword Hits
                    </span>
                    <span className="font-bold text-primary">24 today</span>
                  </div>
                  <div className="w-full h-2 bg-outline-variant/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary to-tertiary rounded-full w-3/4 transition-all" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-body-md mb-1">
                    <span className="flex items-center gap-1.5 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm text-secondary">notifications_active</span>
                      Auction Reminders
                    </span>
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div className="w-full h-2 bg-outline-variant/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary to-tertiary rounded-full w-2/5 transition-all" />
                  </div>
                </div>
              </div>
            </section>
          </aside>
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-stack-md">
              <div className="flex gap-4">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`font-label-md pb-1 transition-colors ${
                      tab === t.key
                        ? "text-primary border-b-2 border-primary"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {t.label}
                    {t.key === "unread" && unreadCount > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-error text-on-error text-[10px] rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {tab !== "archived" && (
                <button className="text-label-sm text-secondary hover:underline">Mark all as read</button>
              )}
            </div>
            {loading ? (
              <div className="py-16 text-center">
                <span className="material-symbols-outlined text-5xl text-outline mb-4">sync</span>
                <p className="text-body-lg text-on-surface-variant">Loading notifications...</p>
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-stack-md">
                {filtered.map((n) => (
                  <NotificationCard
                    key={n.id}
                    n={n}
                    onMarkRead={() => markRead(n.id)}
                    onArchive={() => archive(n.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <span className="material-symbols-outlined text-5xl text-outline mb-4">
                  {tab === "unread" ? "mark_email_read" : "archive"}
                </span>
                <p className="text-body-lg text-on-surface-variant">
                  {tab === "unread"
                    ? "No unread notifications"
                    : "No archived notifications"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Preferences Modal */}
      {showPrefs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">settings</span>
                <h2 className="font-headline-md text-headline-md text-primary">Notification Preferences</h2>
              </div>
              <button onClick={() => setShowPrefs(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Notification Types</h3>
                <div className="space-y-3">
                  {[
                    { id: "outbid", label: "Outbid Alerts", desc: "When another user outbids you" },
                    { id: "offer", label: "Offer Updates", desc: "When an offer is accepted, rejected, or countered" },
                    { id: "arrival", label: "New Arrivals", desc: "Items matching your saved alerts and categories" },
                    { id: "price", label: "Price Drops", desc: "When a watched item drops in price" },
                    { id: "auction", label: "Auction Reminders", desc: "Ending soon reminders for your active bids" },
                    { id: "newsletter", label: "Marketplace News", desc: "Weekly highlights, tips, and exclusive offers" },
                  ].map((p) => (
                    <label key={p.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant transition-colors cursor-pointer">
                      <div>
                        <div className="font-label-md text-primary">{p.label}</div>
                        <div className="text-label-sm text-on-surface-variant">{p.desc}</div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={p.id !== "newsletter"} className="sr-only peer" />
                        <div className="w-10 h-6 bg-outline-variant rounded-full peer-checked:bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-secondary peer-focus:ring-offset-2 peer-focus:ring-offset-surface-container-lowest transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-t border-outline-variant pt-6">
                <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Delivery Channels</h3>
                <div className="space-y-3">
                  {[
                    { id: "email", label: "Email", icon: "mail", checked: true },
                    { id: "push", label: "Push Notifications", icon: "notifications", checked: true },
                    { id: "sms", label: "SMS", icon: "sms", checked: false },
                  ].map((c) => (
                    <label key={c.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-variant transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-on-surface-variant">{c.icon}</span>
                        <span className="font-label-md text-primary">{c.label}</span>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={c.checked} className="sr-only peer" />
                        <div className="w-10 h-6 bg-outline-variant rounded-full peer-checked:bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-secondary peer-focus:ring-offset-2 peer-focus:ring-offset-surface-container-lowest transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-4 transition-transform" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="border-t border-outline-variant pt-6">
                <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-3">Quiet Hours</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-sm text-on-surface-variant mb-1">From</label>
                    <select className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
                      <option>9:00 PM</option>
                      <option>10:00 PM</option>
                      <option selected>11:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-sm text-on-surface-variant mb-1">To</label>
                    <select className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
                      <option>6:00 AM</option>
                      <option selected>7:00 AM</option>
                      <option>8:00 AM</option>
                    </select>
                  </div>
                </div>
                <p className="text-label-sm text-on-surface-variant mt-2">Non-urgent notifications will be silenced during this period.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-outline-variant bg-surface-container-low rounded-b-2xl">
              <button onClick={() => setShowPrefs(false)} className="px-5 py-2.5 border border-outline text-on-surface-variant rounded-lg font-label-md hover:bg-surface-variant transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowPrefs(false)} className="px-5 py-2.5 bg-secondary text-on-primary rounded-lg font-label-md hover:brightness-110 transition-all shadow-sm">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default Notifications;

# 1780683488551969482

# 1781115485454016603
