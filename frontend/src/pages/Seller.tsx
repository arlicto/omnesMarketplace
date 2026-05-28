import Layout from "../components/Layout";

const Seller = () => {
  // Script content from original HTML (needs manual adaptation):
  /*
  
        // Simple micro-interaction for active state scaling
        document.querySelectorAll('button, a').forEach(el => {
            el.addEventListener('mousedown', () => el.classList.add('opacity-70'));
            el.addEventListener('mouseup', () => el.classList.remove('opacity-70'));
            el.addEventListener('mouseleave', () => el.classList.remove('opacity-70'));
        });
    
  */

  return (
    <Layout>
      
{/*  TopNavBar  */}

<main className="flex min-h-[calc(100vh-140px)] max-w-container-max mx-auto">
{/*  SideNavBar  */}
<aside className="bg-surface-container-low dark:bg-surface-container-highest border-r border-outline-variant dark:border-outline h-auto w-64 hidden md:flex flex-col p-stack-md space-y-stack-sm sticky top-[73px]">
<div className="mb-stack-lg">
<div className="text-headline-sm font-headline-md font-bold text-primary dark:text-primary-fixed">Seller Panel</div>
<div className="text-label-md font-label-md text-on-surface-variant">Omnes Management</div>
</div>
<nav className="space-y-1">
<a className="flex items-center space-x-3 p-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant dark:hover:bg-surface-variant rounded-lg transition-all font-label-md" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span className="">Dashboard</span>
</a>
<a className="flex items-center space-x-3 p-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant dark:hover:bg-surface-variant rounded-lg transition-all font-label-md" href="#">
<span className="material-symbols-outlined" data-icon="storefront">storefront</span>
<span className="">Sellers</span>
</a>
<a className="flex items-center space-x-3 p-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant dark:hover:bg-surface-variant rounded-lg transition-all font-label-md" href="#">
<span className="material-symbols-outlined" data-icon="group">group</span>
<span className="">Buyers</span>
</a>
<a className="flex items-center space-x-3 p-3 bg-primary-container dark:bg-primary-container text-on-primary-container dark:text-on-primary-container font-bold rounded-lg transition-transform active:scale-95 font-label-md" href="#">
<span className="material-symbols-outlined" data-icon="list_alt" >list_alt</span>
<span className="">Listings</span>
</a>
<a className="flex items-center space-x-3 p-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-variant dark:hover:bg-surface-variant rounded-lg transition-all font-label-md" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span className="">Settings</span>
</a>
</nav>
<div className="mt-auto pt-stack-lg">
<button className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold flex items-center justify-center space-x-2 transition-opacity hover:opacity-90">
<span className="material-symbols-outlined" data-icon="add">add</span>
<span className="">Add New Admin</span>
</button>
</div>
</aside>
{/*  Content Canvas  */}
<section className="flex-1 p-margin-desktop max-w-[1016px] mx-auto">
{/*  Seller Profile Header  */}
<div className="relative w-full rounded-xl overflow-hidden mb-stack-lg shadow-sm border border-outline-variant">
<div className="h-48 w-full bg-primary-container relative">
<img alt="Seller Banner" className="w-full h-full object-cover opacity-60" data-alt="An expansive, wide-angle shot of a high-end, minimalist corporate showroom with floor-to-ceiling windows overlooking a clean metropolitan skyline at dusk. The interior is characterized by sleek glass surfaces, polished concrete floors, and soft ambient lighting in shades of cool blue and warm amber, projecting an image of global trade and professional excellence." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrZniTQBff2gRIU6qfw2APbzj_3pUCcZm-qtXQQ95YqiWdk8q6LopKl_1EN9QZzJOAHCg_Op2znvUIYjsIMjHO481pMenyRr37fhQxw-7muIqw7W03OIVpiU9esPtFBdLuihNZwr1i6APTeUeehdBuKiNSY_cgbpyTQ1Hi0SzQVOObhyil_j8KbZUx3hJ2HPwaTF2BAez4ggbk98CuuR4dxgpTOIdkiEUAzIP3kZLLE4qPg6TBPZBp3iHKw3kW2lciwoLpg-_9xxk" />
</div>
<div className="p-stack-lg bg-surface flex flex-col md:flex-row items-end md:items-center -mt-12 relative z-10">
<div className="w-24 h-24 rounded-xl border-4 border-surface shadow-lg overflow-hidden bg-white mb-4 md:mb-0">
<img alt="Seller Profile" className="w-full h-full object-cover" data-alt="A close-up portrait of a professional corporate leader with a sharp, intelligent gaze. The person is dressed in business attire with a neutral-colored background that emphasizes clarity and focus. The lighting is crisp and detailed, showcasing textures of high-quality fabric and skin, conveying a sense of established authority and reliability." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpQfdFmDF00suQsl0lGKA_K3bF5vhM0M61wjja_HECr5Sy98Ihzy5M8_2a4NChNE8TXTaRqgUoVrC3MMApKy0cPlW_k5HX5_geirmX_soR4h51Im3uSEO50Axz-oSWtXVhUjteMq2JjioMHCEZKzA6E5Q8oBUM46Ryw4mcx5PnOB1sD_jCjk7M_WGhXqUuDG1SPZR-BoHOuiFbtgNULB812km0_C4NUarEXghqImqddwrZIdvifpkqw5_bzTtEU_sxwc8fPL-mTJU" />
</div>
<div className="md:ml-stack-md flex-1 text-center md:text-left">
<h1 className="text-headline-lg font-headline-lg text-primary">Elite Collector Group</h1>
<p className="text-body-md text-on-surface-variant max-w-2xl">Specializing in high-end curation and authenticated luxury assets for discerning individual collectors worldwide. Trust, transparency, and excellence since 2018.</p>
</div>
<div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
<div className="flex items-center bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-bold mb-1">
<span className="material-symbols-outlined text-sm mr-1" >star</span>
<span className="">4.9 Rating</span>
</div>
<span className="text-label-sm text-on-surface-variant">248 Sales Completed</span>
</div>
</div>
</div>
{/*  Form: Add New Item  */}
<div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-stack-lg shadow-sm">
<div className="flex items-center justify-between mb-stack-lg border-b border-outline-variant pb-4">
<div>
<h2 className="text-headline-md font-headline-md text-primary">Add New Item</h2>
<p className="text-label-md font-label-md text-on-surface-variant">Listing ID: <span className="font-mono text-primary">AUTO-823-GEN</span></p>
</div>
<button className="text-on-surface-variant hover:text-error transition-colors">
<span className="material-symbols-outlined" data-icon="close">close</span>
</button>
</div>
<form className="space-y-stack-md">
<div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
{/*  Left Column: Media & Info  */}
<div className="space-y-stack-md">
<div>
<label className="block text-label-md font-label-md text-on-surface-variant mb-1">Item Name</label>
<input className="w-full px-4 py-2 rounded border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="e.g. Vintage Sapphire Chronograph" required type="text" />
</div>
<div>
<label className="block text-label-md font-label-md text-on-surface-variant mb-1">Category</label>
<select className="w-full px-4 py-2 rounded border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white" required>
<option value="">Select Category</option>
<option value="watches">Luxury Watches</option>
<option value="art">Fine Art</option>
<option value="jewelry">Exquisite Jewelry</option>
<option value="tech">Premium Electronics</option>
</select>
</div>
<div>
<label className="block text-label-md font-label-md text-on-surface-variant mb-1">Item Description</label>
<textarea className="w-full px-4 py-2 rounded border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Describe the item's history, condition, and unique features..." required rows={6}></textarea>
</div>
</div>
{/*  Right Column: Pricing & Upload  */}
<div className="space-y-stack-md">
<div>
<label className="block text-label-md font-label-md text-on-surface-variant mb-1">Item Photos</label>
<div className="border-2 border-dashed border-outline-variant rounded-lg p-stack-lg flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-variant transition-colors cursor-pointer group h-48">
<span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:scale-110 transition-transform mb-2" data-icon="cloud_upload">cloud_upload</span>
<p className="text-label-md font-label-md text-on-surface-variant">Click to upload or drag and drop</p>
<p className="text-label-sm text-on-surface-variant opacity-70">PNG, JPG up to 10MB</p>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="block text-label-md font-label-md text-on-surface-variant mb-1">Price (EUR)</label>
<input className="w-full px-4 py-2 rounded border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-bold" placeholder="0.00" required type="number" />
</div>
<div>
<label className="block text-label-md font-label-md text-on-surface-variant mb-1">Quantity</label>
<input className="w-full px-4 py-2 rounded border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" type="number" value="1" />
</div>
</div>
<div>
<label className="block text-label-md font-label-md text-on-surface-variant mb-4">Sale Type</label>
<div className="flex flex-wrap gap-3">
<label className="flex-1 cursor-pointer">
<input checked className="sr-only peer" name="sale_type" type="radio" />
<div className="p-3 border border-outline-variant rounded-lg text-center peer-checked:bg-primary peer-checked:text-on-primary peer-checked:border-primary transition-all">
<span className="text-label-md font-label-md">Buy Now</span>
</div>
</label>
<label className="flex-1 cursor-pointer">
<input className="sr-only peer" name="sale_type" type="radio" />
<div className="p-3 border border-outline-variant rounded-lg text-center peer-checked:bg-primary peer-checked:text-on-primary peer-checked:border-primary transition-all">
<span className="text-label-md font-label-md">Negotiate</span>
</div>
</label>
<label className="flex-1 cursor-pointer">
<input className="sr-only peer" name="sale_type" type="radio" />
<div className="p-3 border border-outline-variant rounded-lg text-center peer-checked:bg-primary peer-checked:text-on-primary peer-checked:border-primary transition-all">
<span className="text-label-md font-label-md">Best Offer</span>
</div>
</label>
</div>
</div>
</div>
</div>
<div className="flex items-center justify-end space-x-4 pt-stack-lg border-t border-outline-variant">
<button className="px-6 py-3 border border-primary text-primary font-bold rounded-lg hover:bg-surface-variant transition-colors" type="button">Save as Draft</button>
<button className="px-10 py-3 bg-secondary-container text-on-secondary-container font-bold rounded-lg hover:opacity-90 shadow-md transform active:scale-95 transition-all" type="submit">Publish Item</button>
</div>
</form>
</div>
</section>
</main>
{/*  Footer  */}





    </Layout>
  );
};

export default Seller;
