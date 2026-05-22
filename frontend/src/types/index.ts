export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  tag?: string;
  description?: string;
  seller_id?: number;
  seller_name?: string;
  image_url?: string;
  thumbnail_url?: string;
  created_at?: string;
}

export interface User {
  id: string;
  uuid: string;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  roles: string[];
  status: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  line_total: number;
  name: string;
  image_url: string | null;
  thumbnail_url: string | null;
  category_name: string | null;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  total: number;
}

export interface Cart {
  cart: {
    id: number;
    uuid: string;
    user_id: number;
    status: string;
  } | null;
  items: CartItem[];
  summary: CartSummary;
}

export interface OrderPayload {
  shipping_address: string;
  notes?: string;
}

export interface OrderResult {
  message: string;
  order: {
    id: number;
    uuid: string;
    order_number: string;
    status: string;
    total_amount: number;
  };
}
