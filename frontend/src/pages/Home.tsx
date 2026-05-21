import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Product } from '../types';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const DAILY_SELECTION = products.slice(0, 4);

  const FLASH_SALES = [
    { name: 'Nomad Carry-On', price: 120, oldPrice: 185, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxkqrD_jf2GesDZAyU1BLidgV0y33BbH5L_1jdB7D5XjgdC-Z2tTsC0IcM-ldXRBYS866DQjZycoMsLHPSwmMJ_n8JFkOoiFnjCo9CPY_Er_DpEIokEUTJiReV1wmEeOAeR6bUVLCTJTKKs8lLqqx6oifhopYcQO6iuCfXCseTF40bhCqn5jVm1UXzocIKlA9KBEUrHVYceZHfDqMLiwBUI-RS18bJKB9CY-EVcA0zQRm6VSGlK62wnzUSsRzwzrcAc3gUVDgL31U' },
    { name: 'Retro Cam X', price: 95, oldPrice: 140, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKjcKOwDjRMh8YMFCpiqypfgxX8u3ycBjsCzbGzouzbXVGMPItVqxDefwCBYoXe_PBI0skqFOwtoelahTMSPXidb8yc9coLYPXwATLrJUvyCxP6yb9U6n5esXpC7Y2Swa5eHxcaVcE1fN716X86G5b7w73OjeB1merTV5RyatiNagIdwaQ_hQsiSMM-Kl_eaQDMjGtY-l7DRNYpHurGPzqunQpAyUlpg-85F-aGu5D4gnqb99lk0CBckB6GK47zNQsSfc6_YmzCvQ' },
    { name: 'Collector\'s Case', price: 45, oldPrice: 80, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3N5yg2wC-UEJbtZr9sIYfCwn5W1K43Utg89UQlYRnJV8MxIwQC1LspX3hVonnL4hzxLFf8D15nEDN8GK6xcTpjk0mbQbLS0VP-9Fx9gAe4qb54uRD7akDpGPmvAmAd5CHUnLcvOZQPQOhnXFvBwSYf1elQ7S6Bv9cbCU3oaD0jFOlSE7jNwVl_P4dmc2cfcF5ebocCAJUyPdcHv7z8t1A2MjYJLZedRj9yU_TMg6PqFD8QbZcza9Tijdd4jCwMTH-7Mv99yxxXTc' },
    { name: 'Omnes Pad v4', price: 299, oldPrice: 450, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC30ylcWasr7Q5_-IT6KFrdtjM3qF_n-0uHrPFe5uYDcgV2tnIL_BxGkozIWwo8-IMlJl3mH54yD3MvRsqn-87RECxlPP6Ra9S7qgJndvSF79ITrAq9uTJiCSNawEDQAZAUI2edt1OaUf15kvDPhMLFJr_tdAKU0eTP8uwk8DKi6YqqasBTbQ-2pFtdIhyzzUYbIU0-k3RE4MzLbhIZOg3oHmF6KpEL95cUUYjPSprogCZo_YM13U7PXw0mVfjGmJCt51AMGIlURyc' }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden bg-primary-container">
        <img 
          alt="Professional Marketplace Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwv7usGVjyarxW4uk7OhrWC7nx-PtDkllAjsx93_mx3aHyzrjuY57JPYT7i4AIsm5UBu0eBnQcWQrlu2-xsI4o6gXyLYjKNoiz9oI_y_5jtjeDgDm-pcA6WsmCJrYGXMDFu9BFTWBiWCewaEZR8FWLpx49p5K1CsTvcua0dtnftBeWCzSAmH9uRhQHBNBF5ZRXEf5oXtVBUCOUC7ln7Zjyyj_mWGRTkQlOuKhdIDlzFeuVr8Hlo7Wxcl1Jkp0kHjF9f_lHW3WsVMc"
        />
        <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-on-primary">
          <div className="max-w-2xl space-y-stack-md">
            <h1 className="text-headline-xl-mobile md:text-headline-xl font-headline-xl text-white">Excellence in Every Transaction</h1>
            <p className="text-body-lg font-body-lg text-primary-fixed">Welcome to the official Omnes Education community marketplace. Discover a curated selection of rare collectibles and professional assets tailored for our distinguished network.</p>
            <div className="flex flex-wrap gap-4 pt-stack-sm">
              <Button variant="secondary">Shop Now</Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">Sell With Us</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Selection of the Day */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-stack-md">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-primary">Selection of the Day</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Handpicked items of exceptional quality.</p>
          </div>
          <button className="text-primary font-bold flex items-center gap-1 hover:underline">
            View All <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
        <div className="flex overflow-x-auto gap-gutter pb-4 no-scrollbar">
          {DAILY_SELECTION.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Product Category Tiles */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <CategoryTile 
            title="Rare Items" 
            subtitle="One-of-a-kind treasures" 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuATI-G7aWm8XwTuvkdM5VshY0t7p7vuBj0-eHydSWgmeSmYwhlvwG0wkO-gm2H19MOvdvl7igWhLLz9JTJ_HSe2goQ2_xXhDYBrFM_Mz_-FgMN0SmcV4Kc37nP_3rNAmgA5EJ2IcvWLcpj4jCaXT04C0Ywhekq7f6Xnv5QIgDxARumGzUNZGMELj0v5FpUjt82zxVEKVX9A0TvOsrRs5XgPTN16XGZOp9J8I4LoIL2ThDrxYqswF7x_MRCk-64a8GR6lTMpMB1yOtg"
            gradient="from-primary/90"
            textColor="text-primary-fixed"
          />
          <CategoryTile 
            title="High-end Items" 
            subtitle="Professional grade quality" 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuAqkjAGB7Br0BHBSMokX2BfF-y2FbvCUP6BuTRbJu1IMIve4G_pevNCV70dxwxPWLNICZOAdgM6vyYz4yXXNSAgAzg5ygJ9KClLeBlE7ruhfIz2-Kdad4q6q-P-L6wcpWCxt_8kVDjRjeKo_onLv5jAa1sTd7XWQ9QJaeICVAdWYiJM1LH87Dcg0_AXHydimJl9MuFuYR2FJJ8f6a4s6JpFnkaV5KUtxa4GgTqTWXk1-w6Lcc01biF1rRr1ABhzpt3n7b38SM9XJ-4"
            gradient="from-secondary/90"
            textColor="text-secondary-fixed"
          />
          <CategoryTile 
            title="Daily Essentials" 
            subtitle="Practical curated tools" 
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuC6MNZ2XIdhqT1jU0zXpoRH5Rhi69sGeQjuQTD4hFH2IUAF6F_M4ZjIYcGO2gZ4efB8YgRiFmiNHv61Xaj_eO1Ife5_3dq99vK6i_P9p8rC9AxfnuoZAx6hhrcWlY5RvjMCxkR4ckT5o3PbwzixZLcWjV3abVdoztyYoOKgQ2OV8Vv7dBDewfsennKcX3qdtU53XjofnHAV22h9zr91cMytySBCY4XYPljZCWAPoSat22Km2f8taayhIK_QFB-Y9K1Hb-pQa6AhIio"
            gradient="from-primary-container/90"
            textColor="text-primary-fixed"
          />
        </div>
      </section>

      {/* Flash Sales */}
      <section className="bg-surface-container py-stack-lg">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-stack-md">
          <div className="flex items-center gap-4">
            <h2 className="text-headline-lg font-headline-lg text-primary">Flash Sales</h2>
            <div className="bg-error text-on-error px-3 py-1 rounded-full text-label-md font-label-md flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">timer</span>
              <span>Ends in 04:14:39</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {FLASH_SALES.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant hover:shadow-md transition-shadow cursor-pointer">
                <img alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" src={item.image} />
                <h4 className="font-bold text-primary">{item.name}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-secondary font-bold font-headline-md">${item.price}</span>
                  <span className="text-on-surface-variant line-through text-sm">${item.oldPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Maps Section */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter items-center pb-stack-lg">
        <div className="space-y-stack-md">
          <h2 className="text-headline-lg font-headline-lg text-primary">Visit Our Hub</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">Located in the heart of the Omnes Campus, our physical marketplace hub is open for inspections and secure handovers.</p>
          <div className="space-y-4 pt-4">
            <ContactInfo icon="location_on" title="Address" content="10 Rue de la Victoire, 75009 Paris, France" />
            <ContactInfo icon="mail" title="Email" content="marketplace@omnes.edu" />
            <ContactInfo icon="call" title="Phone" content="+33 (0) 1 44 67 22 22" />
          </div>
        </div>
        <div className="h-[400px] bg-surface-container-high rounded-2xl overflow-hidden shadow-inner relative group">
          <img 
            alt="Campus Map" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTUa1r8nZpWlS5zC_G0n358wD0M7z-KkR7Y7O8E6y6J68w_n8k9r-T_4pL"
          />
          <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
        </div>
      </section>
    </Layout>
  );
};

const CategoryTile: React.FC<{ title: string, subtitle: string, image: string, gradient: string, textColor: string }> = ({ 
  title, subtitle, image, gradient, textColor 
}) => (
  <div className="relative h-96 rounded-xl overflow-hidden group cursor-pointer shadow-lg">
    <img alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={image} />
    <div className={`absolute inset-0 bg-gradient-to-t ${gradient} to-transparent`}></div>
    <div className="absolute bottom-0 left-0 p-stack-md text-white">
      <h3 className="text-headline-md font-headline-md">{title}</h3>
      <p className="text-label-md font-label-md opacity-80">{subtitle}</p>
      <div className={`mt-4 flex items-center gap-2 ${textColor}`}>
        <span className="font-bold">Explore</span>
        <span className="material-symbols-outlined">east</span>
      </div>
    </div>
  </div>
);

const ContactInfo: React.FC<{ icon: string, title: string, content: string }> = ({ icon, title, content }) => (
  <div className="flex items-start gap-4">
    <span className="material-symbols-outlined text-secondary">{icon}</span>
    <div>
      <p className="font-bold text-primary">{title}</p>
      <p className="text-on-surface-variant">{content}</p>
    </div>
  </div>
);
