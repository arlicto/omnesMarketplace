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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
        const data = response.data;
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].url);
        } else if (data.image_url) {
          setSelectedImage(data.image_url);
        }
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

  const images = product?.images ?? [];

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
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container border border-outline-variant shadow-sm group">
              {selectedImage ? (
                <img
                  key={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  src={selectedImage}
                />
              ) : (
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 absolute inset-0 flex items-center justify-center">image</span>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const idx = images.findIndex(i => i.url === selectedImage);
                      const prev = (idx - 1 + images.length) % images.length;
                      setSelectedImage(images[prev].url);
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-primary">chevron_left</span>
                  </button>
                  <button
                    onClick={() => {
                      const idx = images.findIndex(i => i.url === selectedImage);
                      const next = (idx + 1) % images.length;
                      setSelectedImage(images[next].url);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-primary">chevron_right</span>
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(img.url)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedImage === img.url ? 'bg-white w-3' : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img.url
                        ? 'border-primary'
                        : 'border-transparent hover:border-outline-variant'
                    }`}
                  >
                    <img alt={img.alt_text || product.name} className="w-full h-full object-cover" src={img.url} />
                  </button>
                ))}
              </div>
            )}
            {product.video_url && (
              <div className="rounded-2xl overflow-hidden bg-surface-container border border-outline-variant shadow-sm">
                <video
                  controls
                  className="w-full aspect-video"
                  src={product.video_url}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
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
