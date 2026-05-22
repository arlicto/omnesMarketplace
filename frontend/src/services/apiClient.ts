import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)omnes_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

apiClient.interceptors.request.use(
  (config) => {
    const csrf = getCsrfToken();
    if (csrf && config.method && !['get', 'head', 'options'].includes(config.method.toLowerCase())) {
      config.headers['X-CSRF-Token'] = csrf;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const { data } = await apiClient.post('/auth/refresh');
        useAuthStore.getState().setAuth(data.user, data.access_token);
        error.config.headers.Authorization = `Bearer ${data.access_token}`;
        return apiClient(error.config);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
