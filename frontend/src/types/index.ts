export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  type: 'Buy Now' | 'Negotiation' | 'Best Offer';
  tag?: string;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
}
