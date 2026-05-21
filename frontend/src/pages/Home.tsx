import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/Button';
import { Product } from '../types';

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleShopNow = () => {
    const selectionSection = document.getElementById('selection-section');
    if (selectionSection) {
      selectionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSellWithUs = () => {
    navigate('/register?role=seller');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const DAILY_SELECTION = Array.isArray(products) ? products.slice(0, 4) : [];
  const RECOMMENDED = Array.isArray(products) ? products.slice(4, 14) : [];

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
      <section className="relative h-[600px] flex items-center overflow-hidden bg-primary">
        <img 
          alt="Omnes Education Campus" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          src="https://grandes-ecoles.studyrama.com/sites/default/files/styles/hero_big/public/inseec_paris.jpg.webp?itok=n_aHXOGc"
        />
        <div className="relative z-10 w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-on-primary">
          <div className="max-w-2xl space-y-stack-md">
            <h1 className="text-headline-xl-mobile md:text-headline-xl font-headline-xl text-white">Excellence in Every Transaction</h1>
            <p className="text-body-lg font-body-lg text-primary-fixed">Welcome to the official Omnes Education community marketplace. Discover a curated selection of rare collectibles and professional assets tailored for our distinguished network.</p>
            <div className="flex flex-wrap gap-4 pt-stack-sm">
              <Button variant="secondary" onClick={handleShopNow}>Shop Now</Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary" onClick={handleSellWithUs}>Sell With Us</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Selection of the Day */}
      <section id="selection-section" className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-stack-md">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-headline-lg font-headline-lg text-primary">Selection of the Day</h2>
            <p className="text-body-md font-body-md text-on-surface-variant">Handpicked items of exceptional quality.</p>
          </div>
          <button 
            className="text-primary font-bold flex items-center gap-1 hover:underline"
            onClick={() => navigate('/browse')}
          >
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
            gradient="from-primary/90"
            textColor="text-primary-fixed"
          />
          <CategoryTile 
            title="High-end Items" 
            subtitle="Professional grade quality" 
            gradient="from-secondary/90"
            textColor="text-secondary-fixed"
          />
          <CategoryTile 
            title="Daily Essentials" 
            subtitle="Practical curated tools" 
            gradient="from-primary-container/90"
            textColor="text-primary-fixed"
          />
        </div>
      </section>

      {/* Recommended for You */}
      <section className="bg-surface-container py-stack-lg">
        <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-stack-md">
          <h2 className="text-headline-lg font-headline-lg text-primary">Recommended for You</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {RECOMMENDED.map((product) => (
              <ProductCard key={product.id} product={product} />
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
            <ContactInfo icon="location_on" title="Address" content="10 Rue Sextius Michel, 75015 Paris" />
            <ContactInfo icon="mail" title="Email" content="marketplace@omnes.edu" />
            <ContactInfo icon="call" title="Phone" content="+33 (0) 1 44 67 22 22" />
          </div>
        </div>
        <div className="h-[400px] bg-surface-container-high rounded-2xl overflow-hidden shadow-inner relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.0!2d2.2950!3d48.8500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671d877737b2d%3A0xb975fcfa192f84d0!2s10+Rue+Sextius+Michel%2C+75015+Paris%2C+France!5e0!3m2!1sen!2sfr!4v1700000000000"
            className="w-full h-full border-0"
            title="Omnes Marketplace Location"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>
    </Layout>
  );
};

const CategoryTile: React.FC<{ title: string, subtitle: string, image?: string, gradient: string, textColor: string }> = ({ 
  title, subtitle, image, gradient, textColor 
}) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="relative h-96 rounded-xl overflow-hidden group cursor-pointer shadow-lg"
      onClick={() => navigate('/browse')}
    >
      {image ? (
        <img alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={image} />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${gradient}`}></div>
      )}
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
};

const ContactInfo: React.FC<{ icon: string, title: string, content: string }> = ({ icon, title, content }) => (
  <div className="flex items-start gap-4">
    <span className="material-symbols-outlined text-secondary">{icon}</span>
    <div>
      <p className="font-bold text-primary">{title}</p>
      <p className="text-on-surface-variant">{content}</p>
    </div>
  </div>
);
