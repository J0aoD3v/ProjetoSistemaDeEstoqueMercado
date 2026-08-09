import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

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

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
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