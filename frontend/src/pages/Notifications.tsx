import Layout from "../components/Layout";

const Notifications = () => {
  // Script content from original HTML (needs manual adaptation):
  /*
  
        // Simple Micro-interactions
        document.querySelectorAll('form button').forEach(button => {
            button.addEventListener('click', (e) => {
                if(button.innerText.includes('Save')) {
                    e.preventDefault();
                    button.innerText = 'Alert Saved!';
                    button.classList.replace('bg-secondary', 'bg-green-600');
                    setTimeout(() => {
                        button.innerText = 'Save Alert';
                        button.classList.replace('bg-green-600', 'bg-secondary');
                    }, 2000);
                }
            });
        });

        // Hover Effect on cards
        document.querySelectorAll('.group').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    
  */

  return (
    <Layout>
      
{/*  TopNavBar  */}

<main className="flex-grow w-full max-w-container-max mx-auto px-margin-desktop py-stack-lg">
{/*  Header Section  */}
<div className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
<div>
<h1 className="font-headline-xl text-headline-xl text-primary mb-2">Notifications &amp; Alerts</h1>
<p className="text-body-lg text-on-surface-variant max-w-2xl">Stay informed about your bidding status, favorite categories, and exclusive market updates.</p>
</div>
<div className="flex gap-2">
<button className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-opacity flex items-center gap-2">
<span className="material-symbols-outlined text-[20px]" data-icon="settings">settings</span>
                    Manage Preferences
                </button>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/*  Left Column: Set Alert Panel (Bento Grid Style Item)  */}
<aside className="lg:col-span-4 space-y-gutter">
<section className="bg-surface-container-low border border-outline-variant rounded-xl p-stack-md shadow-sm">
<div className="flex items-center gap-2 mb-stack-md">
<span className="material-symbols-outlined text-secondary" data-icon="add_alert">add_alert</span>
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
{/*  Quick Stats / Secondary Panel  */}
<section className="bg-primary-container text-on-primary-container rounded-xl p-stack-md">
<h3 className="font-label-md mb-2 opacity-80 uppercase tracking-wider">Your Alert Activity</h3>
<div className="text-headline-lg font-headline-lg mb-4">12 Active Alerts</div>
<div className="space-y-2">
<div className="flex justify-between text-body-md border-b border-on-primary-fixed-variant pb-2">
<span className="">Keyword Hits</span>
<span className="font-bold">24 today</span>
</div>
<div className="flex justify-between text-body-md border-b border-on-primary-fixed-variant pb-2">
<span className="">Auction Reminders</span>
<span className="font-bold">3</span>
</div>
</div>
</section>
</aside>
{/*  Right Column: Notifications List  */}
<div className="lg:col-span-8">
<div className="flex items-center justify-between mb-stack-md">
<div className="flex gap-4">
<button className="font-label-md text-primary border-b-2 border-primary pb-1">All Notifications</button>
<button className="font-label-md text-on-surface-variant hover:text-primary transition-colors">Unread</button>
<button className="font-label-md text-on-surface-variant hover:text-primary transition-colors">Archived</button>
</div>
<button className="text-label-sm text-secondary hover:underline">Mark all as read</button>
</div>
<div className="space-y-stack-md">
{/*  Notification Card 1  */}
<div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex gap-4 transition-all hover:shadow-lg hover:border-primary-fixed">
<div className="relative w-24 h-24 flex-shrink-0">
<img alt="Modern Painting" className="w-full h-full object-cover rounded-lg" data-alt="A vibrant modern abstract oil painting on a square canvas, showcasing expressive brushstrokes in shades of deep navy, ochre, and crimson. The artwork is set against a clean, white gallery wall with professional track lighting, creating a premium and artistic atmosphere consistent with high-end marketplace curation." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-c8XIN_H8rjquBpEq9IqZICrULBXZwhTEsACaodRjeQz3rw9ZdCQj4OlKWriN68G3FfwRWiOVX3ekwpPMGv5gYBA3cKnMVyLt24RlNBFFHk25uL4yMOnbOIfpFSiTGxdUUr2SNwpUPFLYTo0a_Vu_CjEQnpaFejVUCwyhcaAckvCUGXb-mvvoUf_5lmRB8XGd24HhcdCF5usL2odNyx3aPWnSsxrRr8rbpIRC7P9nhVeaj3SuB98h6SWhAAIqetCaTwM8NdkjloQ" />
<span className="absolute -top-2 -left-2 bg-error text-on-error text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Outbid</span>
</div>
<div className="flex-grow flex flex-col justify-between py-1">
<div>
<div className="flex justify-between items-start">
<h4 className="font-headline-md text-body-lg text-primary leading-tight">Outbid on "Midnight Horizon" Abstract</h4>
<span className="text-label-sm text-outline">2m ago</span>
</div>
<p className="text-body-md text-on-surface-variant mt-1">Another user has placed a higher bid of $4,200. Act fast to stay in the lead.</p>
</div>
<div className="flex items-center justify-between mt-2">
<div className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-label-sm rounded uppercase">Auction Ending Soon</div>
<button className="px-4 py-1.5 border border-primary text-primary font-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all">View Item</button>
</div>
</div>
</div>
{/*  Notification Card 2  */}
<div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex gap-4 transition-all hover:shadow-lg">
<div className="relative w-24 h-24 flex-shrink-0">
<img alt="Luxury Watch" className="w-full h-full object-cover rounded-lg" data-alt="Close-up of a luxury mechanical watch with an intricate skeleton dial, featuring polished silver surfaces and a black leather strap. The watch is placed on a dark velvet cushion, lit by soft side-lighting that emphasizes the craftsmanship and texture. The mood is sophisticated, reflecting a corporate modern, high-end marketplace style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_i3maQ9RpWvvSeFJKQeZRk0FGGJxPTYh1gHx3wkU4mZmKxC4Nq8aU5Mc_2RkDWuEJka9DRkhXPqHQ2vEX_On0hFNYsK1D3mwFE70jbxVmjA7i_II0sOIYG8YiZyB00vBqSGKTzvwSujPZDXurLvKwB_t8Daw_9GxY4O0_kE1ZGnmdcVXzuPha3TQjQqxyeapnVvZcdldRE0V5AiIKlKMh1WFalNg6mYdilI5o93mKXwih2JEXipy9UtmkQjf89EpJXGnjWuirwnM" />
<div className="absolute inset-0 bg-primary/10 rounded-lg"></div>
</div>
<div className="flex-grow flex flex-col justify-between py-1">
<div>
<div className="flex justify-between items-start">
<h4 className="font-headline-md text-body-lg text-primary leading-tight">Offer Accepted: Patek Philippe Nautilus</h4>
<span className="text-label-sm text-outline">45m ago</span>
</div>
<p className="text-body-md text-on-surface-variant mt-1">The seller has accepted your offer of $82,000. Complete the checkout within 24 hours.</p>
</div>
<div className="flex items-center justify-between mt-2">
<div className="px-2 py-1 bg-secondary-container text-on-secondary-container text-label-sm rounded uppercase">Offer Accepted</div>
<button className="px-4 py-1.5 bg-secondary text-on-primary font-label-md rounded-lg hover:brightness-110 transition-all">Complete Checkout</button>
</div>
</div>
</div>
{/*  Notification Card 3  */}
<div className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex gap-4 transition-all hover:shadow-lg opacity-80 grayscale-[0.5]">
<div className="relative w-24 h-24 flex-shrink-0">
<img alt="Vintage Desk" className="w-full h-full object-cover rounded-lg" data-alt="A vintage mid-century modern wooden desk with clean lines and tapered legs, styled in a bright, minimalist home office. The lighting is crisp and natural, highlighting the warm wood grain and elegant design. The overall aesthetic is one of curated luxury and quiet professionalism, fitting for a high-end marketplace notification." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPkTZRxS-PFgdsUaxEB_s4d-cDoOvxqA_Q9cFuaHSu3VQPYVCuUpikawTwIDUUYz8L0IrTey9iNvEAeSCOlxOKwUf511QlKTw0v-7eaDcRuM3AMqd_bNKlx2alC8yWcZSlHkjIfrCztV_DFWuFnUplOXgbkCUyOJDQCB36mAecucUgU7B8Kwe56mEnBGSy5CGjLxOPaNrVJ1n-lgEFAmPs6jU6luRX7ftFzTxPdHF2BfZ5uuzaJpbnqq1h8mTeXy20LlWdt4QeocM" />
</div>
<div className="flex-grow flex flex-col justify-between py-1">
<div>
<div className="flex justify-between items-start">
<h4 className="font-headline-md text-body-lg text-primary leading-tight">New Arrival in "Vintage Furniture"</h4>
<span className="text-label-sm text-outline">3h ago</span>
</div>
<p className="text-body-md text-on-surface-variant mt-1">A rare 1960s Danish Teak Desk just landed. Matches your "Mid-century" alert.</p>
</div>
<div className="flex items-center justify-between mt-2">
<div className="px-2 py-1 bg-primary-fixed text-on-primary-fixed-variant text-label-sm rounded uppercase">New Arrival</div>
<button className="px-4 py-1.5 border border-outline text-on-surface-variant font-label-md rounded-lg hover:bg-surface-variant transition-all">Browse More</button>
</div>
</div>
</div>
{/*  Empty State / Loading simulation hint  */}
<div className="py-10 text-center">
<button className="text-label-md text-primary font-bold hover:underline">Load older notifications</button>
</div>
</div>
</div>
</div>
</main>
{/*  Footer  */}







    </Layout>
  );
};

export default Notifications;
