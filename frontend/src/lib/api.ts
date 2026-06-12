import axios from 'axios';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: 'buy_now' | 'negotiation' | 'auction';
  image: string;
  seller_id: string;
  status: string;
  created_at: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('clerk-db-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('clerk-db-token');
    }
    return Promise.reject(err);
  },
);

export async function getProducts(params?: {
  type?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const { data } = await api.get('/products', { params });
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export default api;

# 1781288289997388074
