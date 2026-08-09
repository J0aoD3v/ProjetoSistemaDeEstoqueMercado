import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { definirAutenticacao } from '@/components/AuthGuard';

export const CHAVE_TOKEN = 'sistemaEstoque.token';

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://projetosistemadeestoquemercado.onrender.com/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type ConfigComRetry = InternalAxiosRequestConfig & { _tentouRetry?: boolean };

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(CHAVE_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const url = error.config?.url ?? '';
    const ehLogin = url.includes('/auth/login');
    const semSessao = !ehLogin && error.response?.status === 401;

    if (semSessao) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CHAVE_TOKEN);
        definirAutenticacao(false);
      }
      return Promise.reject(error);
    }

    const config = error.config as ConfigComRetry | undefined;
    const ehGet = config && config.method?.toUpperCase() === 'GET';
    if (error.code === 'ECONNABORTED' && config && ehGet && !config._tentouRetry) {
      config._tentouRetry = true;
      return api(config);
    }
    return Promise.reject(error);
  }
);

export default api;