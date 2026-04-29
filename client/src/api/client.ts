import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', response.data.access);
          return client(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      } else {
        // Aucun token de secours : on nettoie et on sort du dashboard
        localStorage.removeItem('access_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
