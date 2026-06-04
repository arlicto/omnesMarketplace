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
) : section === 'orders' ? (
  <div className="space-y-stack-lg">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-headline-lg font-headline-lg text-primary">My Orders</h1>
        <p className="text-body-md text-on-surface-variant">Track and manage all your purchases.</p>
      </div>
    </div>
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
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
                    <img alt="Watch" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuUnPJU1EkhjRVKwiBfdZl_x1bcxx25ucDHnQ4bZTA2nXCM5ou9nHpZFaxj0rgLHsS0LP-A4f_HvIPv0V8dNQkWxCquWCLqmKzP_zxfl8y-yHjvpXkq-VaMn713MHExpJ805cYeoazdbzs4cHfMLPpsRZDlr_GWtpWAVzzQo5mpYBlXkog-Pb4X7L8FtZMvNuQJieUTtQA23SFlhrLWITmokNBm3oWMJagsYvUuQYOj4CiozzjOuoHJEgkJ1Ujd_h0-Jh-wCoNs2s" />
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
                    <img alt="Headphones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz963CbB_3RjGvrLVOH_ghRjIF1zLmPmYpqqEOrP-kj7jT_41opa_8IaN2jS67Mt2OKTdqkVNyCmMeSu0ey3G93S0yKOoq22MkgRJ5XCnW78XB0iBKyEwdgISYukZLX262xMCkROBbPpyi4VrQrkgFfWoApwDsSb_8vY1vpQQo2FvCq25wm7vS9Zi5-g4aYQGvt-36eK-BkRYvQwW_YRZbWGTUMLIZBf409LlLn7bH0iCly6H4uqGdoyNv-TGw5etHH_qjloRY0wA" />
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
                    <img alt="Shoes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM5-CF1UussBV4W4ryQu9cxXnA0lsh0N4HWJfjCEvgC4pJb5UJIodYbfmxiUKn_UcX1Io8zaJY7RAtKoJpn4KeaCwf_OA45RS7Nu7K1LAgCJyJ0kmaweXsjii3AFqx7-L8lj44fUOX0O1X0WsPw2gpoq97UYxdvDHxe_l8kLx-AVftcVVPBrEg1lIYo-RAMMkdMStD0twhx1tdQNBRTRHdsOj6ZaTxuByuSN1CVKaDSqUMsruhTWLi-zojom-qBDLUXZ76RDAZ-LA" />
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
  </div>
) : section === 'bids' ? (
  <div className="space-y-stack-lg">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-headline-lg font-headline-lg text-primary">Active Bids</h1>
        <p className="text-body-md text-on-surface-variant">Monitor your ongoing bids and auction activity.</p>
      </div>
    </div>
    <div className="space-y-stack-md">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-stack-md flex items-center gap-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
          <img alt="Item" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiQTRBcJI1Tms5soZInV1SgXzmG6ZjC36fA65Ab_GOCsS1ar_rqbyql0KC_FEG6FDl0HRZ4IROxddg794mEJfS7AL6wDOgFNlB1dsZYApvwLXddsYuBerH9MGAHQZwQdJCd5pMK-95B1gF3Iky-FmkEypPTfWzrXX2nlQsMrZjhcNkexv4r1uqWz3pcoA_hNLiMFWLELgb8a7QbFD4Kw-Vn1j8hWqmf-xWZDHXJB23_ITT5qeKmSl3-Nu_EEdQvSwx3efkTioDexQ" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-headline-sm font-headline-md text-primary">Midnight Horizon Abstract</h3>
              <p className="text-label-sm text-on-surface-variant">Lot #A-4221 — Ends in 4h 22m</p>
            </div>
            <div className="text-right">
              <p className="text-headline-sm font-bold text-secondary">€4,200</p>
              <p className="text-label-sm text-on-surface-variant">Your bid: €4,100</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-label-sm bg-tertiary-container text-on-tertiary-container">Leading</span>
              <span className="text-label-sm text-on-surface-variant">2 other bidders</span>
            </div>
            <button className="px-4 py-1.5 border border-primary text-primary font-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all">Place Bid</button>
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-stack-md flex items-center gap-4 opacity-70">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
          <img alt="Item" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDOUOq09YtmN8bdwD-5ElgaFQ7hCDsAr9MzYx-9GBSOvdIiFla_msxbpDFoYATHF0jZzEmRX2f_DcuSGFf6QxKcK5zXF5TeaNy4PORJysbWzuTSWQMRYb2URBHJo84YyZw94SiEkUbYYpi1gZ8CTZfFrj1nSZ_ou-29g52xMuRexwCunu0H0D7318atxDh0e9Ejmwnsng0HU_MPWvqkbo1EaeH7Lm884Se1s1vwu9_I1NkwAbExjCxC5hKpLs7y68IGa-Kc6AUeTQ" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-headline-sm font-headline-md text-primary">Limited Edition Library</h3>
              <p className="text-label-sm text-on-surface-variant">Lot #A-4198 — Ends in 1d 12h</p>
            </div>
            <div className="text-right">
              <p className="text-headline-sm font-bold text-secondary">€2,300</p>
              <p className="text-label-sm text-on-surface-variant">Your bid: €2,100</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-label-sm bg-error-container text-on-error-container">Outbid</span>
              <span className="text-label-sm text-on-surface-variant">5 other bidders</span>
            </div>
            <button className="px-4 py-1.5 bg-primary text-on-primary font-label-md rounded-lg hover:opacity-90 transition-all">Bid Again</button>
          </div>
        </div>
      </div>
    </div>
  </div>
) : section === 'negotiations' ? (
  <div className="space-y-stack-lg">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-headline-lg font-headline-lg text-primary">Active Negotiations</h1>
        <p className="text-body-md text-on-surface-variant">Manage your ongoing price negotiations with sellers.</p>
      </div>
    </div>
    <div className="space-y-stack-md">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-stack-md">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
            <img alt="Item" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATI-G7aWm8XwTuvkdM5VshY0t7p7vuBj0-eHydSWgmeSmYwhlvwG0wkO-gm2H19MOvdvl7igWhLLz9JTJ_HSe2goQ2_xXhDYBrFM_Mz_-FgMN0SmcV4Kc37nP_3rNAmgA5EJ2IcvWLcpj4jCaXT04C0Ywhekq7f6Xnv5QIgDxARumGzUNZGMELj0v5FpUjt82zxVEKVX9A0TvOsrRs5XgPTN16XGZOp9J8I4LoIL2ThDrxYqswF7x_MRCk-64a8GR6lTMpMB1yOtg" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-headline-sm font-headline-md text-primary">Vintage Danish Teak Desk</h3>
                <p className="text-label-sm text-on-surface-variant">Seller: VintageVault — Listed at €3,200</p>
              </div>
              <div className="text-right">
                <p className="text-headline-sm font-bold text-secondary">€2,800</p>
                <p className="text-label-sm text-on-surface-variant">Your offer</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-label-sm bg-secondary-container text-on-secondary-container">Counter Received</span>
                <span className="text-label-sm text-on-surface-variant">Expires in 2d 6h</span>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 border border-primary text-primary font-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all">Counter</button>
                <button className="px-4 py-1.5 bg-primary text-on-primary font-label-md rounded-lg hover:opacity-90 transition-all">Accept</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-stack-md">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
            <img alt="Item" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqkjAGB7Br0BHBSMokX2BfF-y2FbvCUP6BuTRbJu1IMIve4G_pevNCV70dxwxPWLNICZOAdgM6vyYz4yXXNSAgAzg5ygJ9KClLeBlE7ruhfIz2-Kdad4q6q-P-L6wcpWCxt_8kVDjRjeKo_onLv5jAa1sTd7XWQ9QJaeICVAdWYiJM1LH87Dcg0_AXHydimJl9MuFuYR2FJJ8f6a4s6JpFnkaV5KUtxa4GgTqTWXk1-w6Lcc01biF1rRr1ABhzpt3n7b38SM9XJ-4" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-headline-sm font-headline-md text-primary">Studio Monitor Speakers</h3>
                <p className="text-label-sm text-on-surface-variant">Seller: ProAudioGear — Listed at €1,800</p>
              </div>
              <div className="text-right">
                <p className="text-headline-sm font-bold text-secondary">—</p>
                <p className="text-label-sm text-on-surface-variant">Awaiting response</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-label-sm bg-primary-fixed text-on-primary-fixed-variant">Pending</span>
                <span className="text-label-sm text-on-surface-variant">Sent 3 days ago</span>
              </div>
              <button className="px-4 py-1.5 border border-outline text-on-surface-variant font-label-md rounded-lg hover:bg-surface-variant transition-all">Cancel Offer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
) : section === 'watchlist' ? (
  <div className="space-y-stack-lg">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-headline-lg font-headline-lg text-primary">Watchlist</h1>
        <p className="text-body-md text-on-surface-variant">Items you are tracking for price drops and auction end times.</p>
      </div>
      <button onClick={() => navigate('/browse')} className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md shadow-sm hover:opacity-90 transition-opacity">
        Browse Marketplace
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden group">
        <div className="h-48 overflow-hidden">
          <img alt="Watchlist item" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbqxibC6eGBhdMUse5qAs0jXM1l3_De_nVVjMUSBeIuiFVmoF8ZPkRglQNs7y8sYVBRUtxaSXPvCCdoVE_Yf75BDZPlubVWBwdUIQsquz-XssrILa34qAA25py3VWvF2OtcZtyfCBXxJUyPYNNdHnVv5A4NxyzFsuhkWpuINxZEcMA6bC_yrAEC7Yyn9WI8SsMo5tnoHnm6n1w379GdXHrRt-tzrgBp5uR4iqjzMUTjcC7OlPkCIKButLFqkqGbNs3HurWmc-ApXs" />
        </div>
        <div className="p-stack-md space-y-2">
          <h3 className="text-headline-sm font-headline-md text-primary">Ultrabook Pro Max</h3>
          <div className="flex justify-between items-center">
            <span className="text-headline-sm font-bold text-secondary">€2,499</span>
            <span className="text-label-sm text-on-surface-variant">−12% from avg.</span>
          </div>
          <button className="w-full mt-2 py-2 border border-primary text-primary font-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all">View Item</button>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden group">
        <div className="h-48 overflow-hidden">
          <img alt="Watchlist item" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1ENxzptUf30zTtud1bHfwTBUjFKwAKDsT8wxb0jZvsyUKUH27uTaYqxmhqXjP5NVKNuO606GfvCz_fr87X8A62KZRmIhxqc5p4voLkP7PVcxwii8dpQV46bpAErcLS125BXA_0nOtn9vXToHXiNI3V1h-p42t6qjnqsvFIeO5EFgpM7Or64gMAywDkOs_M5DCXoBHRfGERzvju2OZTpqhG5ZBMIv5z79EmF-eq7IcPJ048HlHIVDzizTvNGBdcjl9apcwJnJNiVY" />
        </div>
        <div className="p-stack-md space-y-2">
          <h3 className="text-headline-sm font-headline-md text-primary">Leica M6 Rangefinder</h3>
          <div className="flex justify-between items-center">
            <span className="text-headline-sm font-bold text-secondary">€3,800</span>
            <span className="text-label-sm text-on-surface-variant">−5% from avg.</span>
          </div>
          <button className="w-full mt-2 py-2 border border-primary text-primary font-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all">View Item</button>
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden group">
        <div className="h-48 overflow-hidden">
          <img alt="Watchlist item" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6MNZ2XIdhqT1jU0zXpoRH5Rhi69sGeQjuQTD4hFH2IUAF6F_M4ZjIYcGO2gZ4efB8YgRiFmiNHv61Xaj_eO1Ife5_3dq99vK6i_P9p8rC9AxfnuoZAx6hhrcWlY5RvjMCxkR4ckT5o3PbwzixZLcWjV3abVdoztyYoOKgQ2OV8Vv7dBDewfsennKcX3qdtU53XjofnHAV22h9zr91cMytySBCY4XYPljZCWAPoSat22Km2f8taayhIK_QFB-Y9K1Hb-pQa6AhIio" />
        </div>
        <div className="p-stack-md space-y-2">
          <h3 className="text-headline-sm font-headline-md text-primary">Bauhaus Desk Lamp</h3>
          <div className="flex justify-between items-center">
            <span className="text-headline-sm font-bold text-secondary">€890</span>
            <span className="text-label-sm text-on-surface-variant">−8% from avg.</span>
          </div>
          <button className="w-full mt-2 py-2 border border-primary text-primary font-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all">View Item</button>
        </div>
      </div>
    </div>
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

# 1780597085258940609
