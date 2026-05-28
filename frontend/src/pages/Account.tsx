import { useState } from 'react';
import { useUser, useClerk, UserProfile } from '@clerk/react';
import { useNavigate } from 'react-router-dom';
import Layout from "../components/Layout";

type Section = 'overview' | 'orders' | 'bids' | 'negotiations' | 'watchlist' | 'settings';

const navItems: { id: Section; icon: string; label: string }[] = [
  { id: 'overview', icon: 'dashboard', label: 'Overview' },
  { id: 'orders', icon: 'shopping_bag', label: 'My Orders' },
  { id: 'bids', icon: 'gavel', label: 'Active Bids' },
  { id: 'negotiations', icon: 'handshake', label: 'Active Negotiations' },
  { id: 'watchlist', icon: 'favorite', label: 'Watchlist' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
];

const Account = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('overview');

  const displayName = user?.fullName || user?.firstName || user?.username || 'User';
  const email = user?.primaryEmailAddress?.emailAddress || '';
  const avatarUrl = user?.imageUrl;

  return (
    <Layout>

<main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg flex flex-col md:flex-row gap-gutter">
<aside className="w-full md:w-64 flex-shrink-0">
<div className="bg-surface-container-low dark:bg-surface-container-highest rounded-xl p-stack-md flex flex-col space-y-stack-sm h-fit">
<div className="pb-4 mb-4 border-b border-outline-variant">
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-full overflow-hidden">
{avatarUrl ? (
  <img alt="User Avatar" className="w-full h-full object-cover" src={avatarUrl} />
) : (
  <div className="w-full h-full bg-primary flex items-center justify-center text-on-primary font-bold text-headline-md">
    {displayName.charAt(0).toUpperCase()}
  </div>
)}
</div>
<div>
<p className="font-headline-md text-label-md text-on-surface">{displayName}</p>
<p className="text-label-sm text-on-surface-variant">{email}</p>
</div>
</div>
</div>
<nav className="flex flex-col space-y-1">
{navItems.map(({ id, icon, label }) => (
  <button
    key={id}
    onClick={() => setSection(id)}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
      section === id
        ? 'bg-primary-container text-on-primary-container font-bold scale-95'
        : 'text-on-surface-variant hover:bg-surface-variant'
    }`}
  >
    <span className="material-symbols-outlined">{icon}</span>
    <span className="text-label-md">{label}</span>
  </button>
))}
<div className="pt-4 mt-4 border-t border-outline-variant">
<button onClick={() => signOut(() => navigate('/'))} className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/10 transition-all rounded-lg w-full text-left">
<span className="material-symbols-outlined">logout</span>
<span className="text-label-md">Logout</span>
</button>
</div>
</nav>
</div>
</aside>
<section className="flex-grow min-w-0">
{section === 'settings' ? (
  <div className="bg-surface-container-low rounded-xl overflow-hidden">
    <UserProfile
      appearance={{
        elements: {
          rootBox: 'w-full',
          card: 'shadow-none border-0 rounded-none bg-surface-container-low',
          navbar: 'bg-surface-container-low border-r border-outline-variant',
          navbarButton: 'text-on-surface-variant hover:text-primary',
          navbarButtonActive: 'text-primary bg-primary-container/50 font-bold',
          headerTitle: 'text-headline-md font-headline-md text-on-surface',
          headerSubtitle: 'text-label-sm text-on-surface-variant',
          profileSectionTitle: 'text-label-md font-bold text-on-surface',
          profileSectionTitleP: 'text-label-md font-bold text-on-surface',
          formFieldLabel: 'text-label-sm text-on-surface-variant',
          formFieldInput: 'bg-surface-container-highest border-outline-variant text-on-surface rounded-lg',
          formButtonPrimary: 'bg-primary text-on-primary rounded-lg shadow-sm hover:opacity-90 transition-opacity',
          formButtonReset: 'text-primary hover:underline',
          badge: 'bg-primary-container text-on-primary-container',
          menuList: 'bg-surface-container-highest border-outline-variant',
          menuItem: 'text-on-surface hover:bg-surface-variant',
          menuTrigger: 'text-on-surface-variant',
          dangerText: 'text-error',
          avatarImageContainer: 'border-2 border-outline-variant',
          avatarImage: 'rounded-full',
        },
      }}
    />
  </div>
) : (
  <div className="space-y-stack-lg">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-headline-lg font-headline-lg text-primary">Buyer Overview</h1>
        <p className="text-body-md text-on-surface-variant">Welcome back, {displayName}. Here's what's happening with your account.</p>
      </div>
      <button onClick={() => navigate('/browse')} className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md shadow-sm hover:opacity-90 transition-opacity">
        Browse Marketplace
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
      <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-secondary text-headline-md">shopping_cart</span>
          <span className="text-label-sm text-on-tertiary-container bg-tertiary-container/10 px-2 py-1 rounded">+2 this month</span>
        </div>
        <div className="mt-4">
          <p className="text-label-md text-on-surface-variant">Items Bought</p>
          <p className="text-headline-lg font-headline-lg text-primary">24</p>
        </div>
      </div>
      <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-secondary text-headline-md">gavel</span>
          <span className="text-label-sm text-on-primary-container bg-primary-container/10 px-2 py-1 rounded">3 ending soon</span>
        </div>
        <div className="mt-4">
          <p className="text-label-md text-on-surface-variant">Active Bids</p>
          <p className="text-headline-lg font-headline-lg text-primary">07</p>
        </div>
      </div>
      <div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="material-symbols-outlined text-secondary text-headline-md">payments</span>
          <span className="text-label-sm text-on-secondary-fixed-variant bg-secondary-fixed/30 px-2 py-1 rounded">Total saved</span>
        </div>
        <div className="mt-4">
          <p className="text-label-md text-on-surface-variant">Total Spend</p>
          <p className="text-headline-lg font-headline-lg text-primary">€12,450</p>
        </div>
      </div>
    </div>
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
        <h2 className="text-headline-md font-headline-md text-on-surface">Recent Orders</h2>
        <a className="text-label-md text-primary hover:underline" href="#">View All</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low text-label-sm text-on-surface-variant uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Item</th>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            <tr className="hover:bg-surface-bright transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-surface-container overflow-hidden">
                    <img alt="Minimalist Watch" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuUnPJU1EkhjRVKwiBfdZl_x1bcxx25ucDHnQ4bZTA2nXCM5ou9nHpZFaxj0rgLHsS0LP-A4f_HvIPv0V8dNQkWxCquWCLqmKzP_zxfl8y-yHjvpXkq-VaMn713MHExpJ805cYeoazdbzs4cHfMLPpsRZDlr_GWtpWAVzzQo5mpYBlXkog-Pb4X7L8FtZMvNuQJieUTtQA23SFlhrLWITmokNBm3oWMJagsYvUuQYOj4CiozzjOuoHJEgkJ1Ujd_h0-Jh-wCoNs2s" />
                  </div>
                  <span className="font-medium text-body-md text-primary">Heritage Chronograph</span>
                </div>
              </td>
              <td className="px-6 py-4 text-body-md text-on-surface-variant">#OMN-8821</td>
              <td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 12, 2023</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-label-sm bg-secondary-container text-on-secondary-container">Shipped</span>
              </td>
              <td className="px-6 py-4 font-bold text-body-md text-primary">€1,200.00</td>
              <td className="px-6 py-4">
                <button className="text-primary material-symbols-outlined">visibility</button>
              </td>
            </tr>
            <tr className="hover:bg-surface-bright transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-surface-container overflow-hidden">
                    <img alt="Studio Headphones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz963CbB_3RjGvrLVOH_ghRjIF1zLmPmYpqqEOrP-kj7jT_41opa_8IaN2jS67Mt2OKTdqkVNyCmMeSu0ey3G93S0yKOoq22MkgRJ5XCnW78XB0iBKyEwdgISYukZLX262xMCkROBbPpyi4VrQrkgFfWoApwDsSb_8vY1vpQQo2FvCq25wm7vS9Zi5-g4aYQGvt-36eK-BkRYvQwW_YRZbWGTUMLIZBf409LlLn7bH0iCly6H4uqGdoyNv-TGw5etHH_qjloRY0wA" />
                  </div>
                  <span className="font-medium text-body-md text-primary">Aura Noise Cancelling</span>
                </div>
              </td>
              <td className="px-6 py-4 text-body-md text-on-surface-variant">#OMN-7412</td>
              <td className="px-6 py-4 text-body-md text-on-surface-variant">Oct 05, 2023</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-label-sm bg-primary-container text-on-primary-container">Delivered</span>
              </td>
              <td className="px-6 py-4 font-bold text-body-md text-primary">€450.00</td>
              <td className="px-6 py-4">
                <button className="text-primary material-symbols-outlined">visibility</button>
              </td>
            </tr>
            <tr className="hover:bg-surface-bright transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-surface-container overflow-hidden">
                    <img alt="Sport Shoes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM5-CF1UussBV4W4ryQu9cxXnA0lsh0N4HWJfjCEvgC4pJb5UJIodYbfmxiUKn_UcX1Io8zaJY7RAtKoJpn4KeaCwf_OA45RS7Nu7K1LAgCJyJ0kmaweXsjii3AFqx7-L8lj44fUOX0O1X0WsPw2gpoq97UYxdvDHxe_l8kLx-AVftcVVPBrEg1lIYo-RAMMkdMStD0twhx1tdQNBRTRHdsOj6ZaTxuByuSN1CVKaDSqUMsruhTWLi-zojom-qBDLUXZ76RDAZ-LA" />
                  </div>
                  <span className="font-medium text-body-md text-primary">Vitesse Pro Runner</span>
                </div>
              </td>
              <td className="px-6 py-4 text-body-md text-on-surface-variant">#OMN-6500</td>
              <td className="px-6 py-4 text-body-md text-on-surface-variant">Sep 28, 2023</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-label-sm bg-error-container text-on-error-container">Cancelled</span>
              </td>
              <td className="px-6 py-4 font-bold text-body-md text-primary">€210.00</td>
              <td className="px-6 py-4">
                <button className="text-primary material-symbols-outlined">visibility</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
      <div className="bg-primary p-8 rounded-xl text-on-primary flex flex-col justify-between">
        <div>
          <h3 className="text-headline-md font-headline-md mb-2">Saved to Watchlist</h3>
          <p className="text-body-md opacity-80 mb-6">Items you are tracking for price drops and auction end times.</p>
        </div>
        <div className="flex -space-x-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary overflow-hidden bg-white">
            <img alt="Laptop" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbqxibC6eGBhdMUse5qAs0jXM1l3_De_nVVjMUSBeIuiFVmoF8ZPkRglQNs7y8sYVBRUtxaSXPvCCdoVE_Yf75BDZPlubVWBwdUIQsquz-XssrILa34qAA25py3VWvF2OtcZtyfCBXxJUyPYNNdHnVv5A4NxyzFsuhkWpuINxZEcMA6bC_yrAEC7Yyn9WI8SsMo5tnoHnm6n1w379GdXHrRt-tzrgBp5uR4iqjzMUTjcC7OlPkCIKButLFqkqGbNs3HurWmc-ApXs" />
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-primary overflow-hidden bg-white">
            <img alt="Camera" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1ENxzptUf30zTtud1bHfwTBUjFKwAKDsT8wxb0jZvsyUKUH27uTaYqxmhqXjP5NVKNuO606GfvCz_fr87X8A62KZRmIhxqc5p4voLkP7PVcxwii8dpQV46bpAErcLS125BXA_0nOtn9vXToHXiNI3V1h-p42t6qjnqsvFIeO5EFgpM7Or64gMAywDkOs_M5DCXoBHRfGERzvju2OZTpqhG5ZBMIv5z79EmF-eq7IcPJ048HlHIVDzizTvNGBdcjl9apcwJnJNiVY" />
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-primary overflow-hidden bg-white flex items-center justify-center text-primary font-bold bg-surface-variant">
            +12
          </div>
        </div>
      </div>
      <div className="bg-surface-container p-8 rounded-xl flex items-center justify-between">
        <div className="max-w-[60%]">
          <h3 className="text-headline-md font-headline-md text-primary mb-2">Need Assistance?</h3>
          <p className="text-body-md text-on-surface-variant mb-4">Our buyer support team is available 24/7 for purchase protection and dispute resolution.</p>
          <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Contact Support <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <span className="material-symbols-outlined text-[80px] text-primary/10">support_agent</span>
      </div>
    </div>
  </div>
)}
</section>
</main>

    </Layout>
  );
};

export default Account;
