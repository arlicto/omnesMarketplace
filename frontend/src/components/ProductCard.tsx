import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="min-w-[280px] md:min-w-[320px] bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden group">
      <div className="h-48 overflow-hidden relative">
        <img 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={product.image}
        />
        {product.tag && (
          <span className="absolute top-3 left-3 bg-tertiary-container/50 backdrop-blur-sm text-on-tertiary px-3 py-1 rounded-full text-label-sm font-label-sm">
            {product.tag}
          </span>
        )}
      </div>
      <div className="p-stack-md space-y-2">
        <span className={`text-label-sm font-label-sm px-2 py-0.5 rounded ${
          product.type === 'Buy Now' ? 'text-secondary bg-secondary-fixed/20' : 
          product.type === 'Negotiation' ? 'text-primary bg-primary-fixed/20' : 
          'text-tertiary bg-tertiary-fixed/20'
        }`}>
          {product.type}
        </span>
        <h3 className="text-headline-sm font-headline-md text-primary">{product.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-headline-sm font-headline-md text-secondary font-bold">${product.price.toLocaleString()}</span>
          <button className="material-symbols-outlined text-primary hover:scale-110 transition-transform">add_shopping_cart</button>
        </div>
      </div>
    </div>
  );
};
