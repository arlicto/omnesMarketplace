import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import apiClient from '../services/apiClient';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Failed to load product.';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await apiClient.get('/products');
        const all: Product[] = Array.isArray(response.data) ? response.data : [];
        const filtered = all.filter((p) => p.id !== id).slice(0, 4);
        setRelatedProducts(filtered);
      } catch {
        // silently fail for related products
      }
    };

    fetchRelated();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    addItem(Number(product.id));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg animate-pulse">
          <div className="h-4 bg-surface-container rounded w-48 mb-stack-md"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            <div className="aspect-square rounded-2xl bg-surface-container"></div>
            <div className="space-y-4">
              <div className="h-3 bg-surface-container rounded w-24"></div>
              <div className="h-8 bg-surface-container rounded w-3/4"></div>
              <div className="h-4 bg-surface-container rounded w-full"></div>
              <div className="h-4 bg-surface-container rounded w-2/3"></div>
              <div className="h-16 bg-surface-container rounded w-1/2 mt-8"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="max-w-container-max mx-auto px-margin-desktop py-stack-lg text-center">
          <h1 className="text-headline-xl font-headline-xl text-primary mb-4">Product Not Found</h1>
          <p className="text-body-lg text-on-surface-variant mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/browse">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-container-max mx-auto px-margin-desktop py-stack-lg">
        <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-stack-md">
          <Link to="/browse" className="hover:text-primary">Browse All</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-primary font-bold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-stack-lg">
          <section className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant shadow-sm flex items-center justify-center">
              {product.image_url ? (
                <img
                  alt={product.name}
                  className="w-full h-full object-cover"
                  src={product.image_url}
                />
              ) : (
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30">image</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Thumbnail active />
              <Thumbnail />
              <Thumbnail />
              <Thumbnail />
            </div>
          </section>

          <section className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {product.category && (
                  <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">{product.category}</span>
                )}
                <span className="text-label-sm text-on-surface-variant">Ref: #{product.id}</span>
              </div>
              <h1 className="text-headline-xl font-headline-xl text-primary mb-2">{product.name}</h1>
              <p className="text-body-lg text-on-surface-variant">{product.description || 'No description available.'}</p>
            </div>

            <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant mb-8">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-label-sm text-on-surface-variant uppercase mb-1">Price</p>
                  <p className="text-headline-xl font-headline-xl text-secondary">${Number(product.price).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-label-sm text-on-surface-variant mb-1">Status</p>
                  <p className="text-label-md font-bold text-primary flex items-center gap-1 justify-end">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span> Available Now
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={handleAddToCart} className="flex-grow py-4">Add to Cart</Button>
                <Button variant="outline" className="flex-grow py-4" onClick={() => navigate(`/negotiations?product_id=${product.id}`)}>Make an Offer</Button>
              </div>
            </div>

            <div className="space-y-6">
              <CollapsibleSection title="Specifications">
                <ul className="grid grid-cols-2 gap-4 text-body-md">
                  <li><span className="text-on-surface-variant">Product ID:</span> {product.id}</li>
                  <li><span className="text-on-surface-variant">Category:</span> {product.category || 'General'}</li>
                  <li><span className="text-on-surface-variant">Type:</span> Buy Now</li>
                  <li><span className="text-on-surface-variant">Price:</span> ${Number(product.price).toLocaleString()}</li>
                </ul>
              </CollapsibleSection>
              <CollapsibleSection title="Shipping & Returns">
                <p className="text-body-md text-on-surface-variant">Secure campus delivery available within 24 hours. Free returns within 7 days for verified items in original condition.</p>
              </CollapsibleSection>
            </div>
          </section>
        </div>

        {relatedProducts.length > 0 && (
          <section className="pt-stack-lg border-t border-outline-variant">
            <h2 className="text-headline-lg font-headline-lg text-primary mb-stack-md">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
};

const Thumbnail: React.FC<{ active?: boolean }> = ({ active }) => (
  <div className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
    active ? 'border-primary' : 'border-transparent hover:border-outline-variant'
  }`}>
    <div className="w-full h-full bg-surface-container"></div>
  </div>
);

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-b border-outline-variant pb-4">
    <button className="w-full flex justify-between items-center py-2 text-headline-sm font-headline-md text-primary">
      {title}
      <span className="material-symbols-outlined">expand_more</span>
    </button>
    <div className="mt-2">
      {children}
    </div>
  </div>
);
