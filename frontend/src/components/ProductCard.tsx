import React, { useRef, useState, useEffect } from 'react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isHovered) {
      video.play();
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isHovered]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(Number(product.id));
  };

  return (
    <a
      href={`/product/${product.id}`}
      className="block min-w-[280px] md:min-w-[320px] bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-48 overflow-hidden relative flex items-center justify-center bg-surface-container">
        {product.video_url ? (
          <>
            <img
              alt={product.name}
              className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ${
                isHovered ? 'opacity-0' : 'opacity-100'
              }`}
              src={product.image_url}
            />
            <video
              ref={videoRef}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              src={product.video_url}
              muted
              loop
              playsInline
            />
          </>
        ) : product.image_url ? (
          <img
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            src={product.image_url}
          />
        ) : (
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">image</span>
        )}
        {product.tag && (
          <span className="absolute top-3 left-3 bg-tertiary-container/50 backdrop-blur-sm text-on-tertiary px-3 py-1 rounded-full text-label-sm font-label-sm">
            {product.tag}
          </span>
        )}
        {product.video_url && (
          <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 pointer-events-none">
            <span className="material-symbols-outlined text-sm">play_circle</span> Hover to play
          </span>
        )}
      </div>
      <div className="p-stack-md space-y-2">
        <span className="text-label-sm font-label-sm px-2 py-0.5 rounded text-secondary bg-secondary-fixed/20">
          Buy Now
        </span>
        <h3 className="text-headline-sm font-headline-md text-primary">{product.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-headline-sm font-headline-md text-secondary font-bold">${product.price.toLocaleString()}</span>
          <button onClick={handleAddToCart} className="material-symbols-outlined text-primary hover:scale-110 transition-transform">add_shopping_cart</button>
        </div>
      </div>
    </a>
  );
};
