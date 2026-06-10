import Layout from "../components/Layout";

const Negotiations = () => {
  // Script content from original HTML (needs manual adaptation):
  /*
  
        // Micro-interaction: Scroll to bottom of chat on load
        window.addEventListener('DOMContentLoaded', () => {
            const chatContainer = document.querySelector('.chat-container');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });

        // Simple button click effect for Accept Price
        const acceptBtn = document.querySelector('.bg-secondary');
        acceptBtn.addEventListener('click', () => {
            acceptBtn.innerHTML = '<span className="material-symbols-outlined animate-spin">refresh</span> Processing...';
            setTimeout(() => {
                alert('Agreement reached! Redirecting to checkout.');
                window.location.reload();
            }, 1500);
        });
    
  */

  return (
    <Layout>
      
{/*  TopNavBar  */}

<main className="mt-[88px] max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
{/*  Side Info: Item & Negotiation Status  */}
<aside className="lg:col-span-4 space-y-stack-md">
<div className="bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm">
<div className="flex gap-stack-md mb-stack-md">
<img className="w-24 h-24 object-cover rounded-lg" data-alt="A high-end, minimalist white wristwatch with a light brown leather strap, shot against a soft grey background. The lighting is crisp and editorial, highlighting the metallic textures and premium craftsmanship of the accessory. The aesthetic is clean and contemporary, reflecting a luxury lifestyle brand." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBarVUUVdBsM95w1YMSnxce3UeDHcljPSbtsqDrcdoPUQ9jR5jJ4v6DydhZsK2B6-BKP73gQCfsdOij2UwhFkN0vYfAIdAd6-kiEdQZLqkP9V7fz2pgEsqDhQXR6rBdbsl_0oO-jWYtAsKheW8Pycfvl-3kmqIxQPbGQf69y9rpKDv_DNZffcRPPHthcXVKxnu_a_ttnKsfT4Ds7MNsU6PWfBoZObpt7cXJYqf6_R9U2828Bu_hFG9F1JV0GeXkzB1GtsBjKPYPDqM" />
<div className="flex flex-col justify-center">
<h2 className="font-headline-md text-body-lg text-primary">Classic Minimalist Watch</h2>
<p className="text-label-md text-on-surface-variant">Seller: <span className="text-secondary font-bold">Julien Dupont</span></p>
<p className="text-headline-md text-primary mt-1">€245.00</p>
</div>
</div>
<div className="pt-stack-md border-t border-outline-variant space-y-stack-sm">
<div className="flex justify-between items-center">
<span className="text-label-md text-on-surface-variant uppercase tracking-wider">Round Status</span>
<span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-sm font-bold">Round 2 of 5</span>
</div>
<div className="flex justify-between items-center">
<span className="text-label-md text-on-surface-variant uppercase tracking-wider">Current High Offer</span>
<span className="text-secondary font-bold">€210.00</span>
</div>
<div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden mt-2">
<div className="bg-secondary h-full w-2/5 transition-all duration-500"></div>
</div>
</div>
</div>
{/*  Tactics & Safety  */}
<div className="bg-tertiary-fixed text-on-tertiary-fixed p-stack-md rounded-xl space-y-stack-sm">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-tertiary-fixed-variant">info</span>
<h3 className="font-label-md text-on-tertiary-fixed-variant">Negotiation Tips</h3>
</div>
<p className="text-label-sm leading-relaxed">Be fair and respectful. Most successful deals happen within 15% of the original asking price. Avoid low-balling to keep the seller engaged.</p>
</div>
</aside>
{/*  Chatroom Canvas  */}
<div className="lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
{/*  Header of Chat  */}
<div className="p-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
<div className="flex items-center gap-3">
<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
<span className="font-label-md text-primary">Negotiation active</span>
</div>
<span className="text-label-sm text-on-surface-variant italic">Started 12 mins ago</span>
</div>
{/*  Thread  */}
<div className="chat-container overflow-y-auto p-stack-md space-y-stack-md flex flex-col">
{/*  Buyer Msg  */}
<div className="self-end max-w-[80%]">
<div className="bg-primary text-on-primary p-4 rounded-t-xl rounded-bl-xl shadow-md">
<div className="flex items-center gap-2 mb-1">
<span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-[10px] font-bold uppercase">Offer Sent</span>
<span className="text-label-sm opacity-80 italic">Round 1</span>
</div>
<p className="text-body-md">Hello! I'm really interested in this timepiece. Would you consider €190 for it?</p>
<div className="mt-3 inline-block bg-white/10 px-3 py-1 rounded-full border border-white/20">
<span className="text-label-md font-bold">Offer: €190.00</span>
</div>
</div>
<span className="text-[10px] text-on-surface-variant block text-right mt-1">10:42 AM</span>
</div>
{/*  Seller Msg  */}
<div className="self-start max-w-[80%]">
<div className="bg-surface-container-high text-on-surface p-4 rounded-t-xl rounded-br-xl border border-outline-variant">
<div className="flex items-center gap-2 mb-1">
<span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold uppercase">Counteroffer Received</span>
<span className="text-label-sm text-on-surface-variant italic">Round 2</span>
</div>
<p className="text-body-md">Hi there! It's a pristine piece, I can't go that low unfortunately. How about €220?</p>
<div className="mt-3 inline-block bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
<span className="text-label-md font-bold text-primary">Offer: €220.00</span>
</div>
</div>
<span className="text-[10px] text-on-surface-variant block mt-1">10:45 AM</span>
</div>
{/*  System Message  */}
<div className="self-center py-2 px-4 bg-surface-container rounded-full text-label-sm text-on-surface-variant">
                        Waiting for your response to Round 2
                     </div>
</div>
{/*  Input Zone  */}
<div className="p-stack-md border-t border-outline-variant bg-surface-container-lowest">
<div className="flex flex-col gap-stack-md">
<div className="flex gap-gutter items-end">
<div className="flex-1">
<label className="text-label-sm text-on-surface-variant mb-1 block">Propose Your New Price</label>
<div className="relative">
<span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">€</span>
<input className="w-full pl-8 pr-4 py-3 rounded-lg border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold text-lg bg-surface-bright" placeholder="0.00" type="number" />
</div>
</div>
<button className="bg-primary text-on-primary px-margin-mobile py-3.5 rounded-lg font-label-md hover:opacity-90 transition-opacity whitespace-nowrap">
                                Submit Offer
                            </button>
</div>
<div className="flex flex-wrap gap-stack-sm items-center justify-between pt-2">
<div className="flex gap-stack-sm">
<button className="flex items-center gap-2 bg-secondary text-on-secondary px-4 py-2 rounded-lg font-label-md hover:scale-95 transition-transform shadow-md">
<span className="material-symbols-outlined text-[18px]" >check_circle</span>
                                    Accept Seller's Price (€220)
                                </button>
<button className="px-4 py-2 text-error font-label-md hover:bg-error-container rounded-lg transition-colors">
                                    Cancel
                                </button>
</div>
<span className="text-label-sm text-on-surface-variant">Round 2/5</span>
</div>
</div>
</div>
</div>
</div>
{/*  Disclaimer Banner  */}
<div className="mt-stack-lg bg-surface-container p-4 rounded-lg flex items-start gap-4 border border-outline-variant">
<span className="material-symbols-outlined text-primary mt-1">gavel</span>
<div>
<p className="text-label-md text-primary font-bold">Important Disclaimer</p>
<p className="text-body-md text-on-surface-variant text-sm">Once an offer is accepted by both parties, it becomes a binding agreement. You are expected to proceed with the payment within 24 hours. Failure to comply may result in account suspension and loss of buyer rating.</p>
</div>
</div>
</main>
{/*  Footer  */}





    </Layout>
  );
};

export default Negotiations;

# 1781115484986093678
