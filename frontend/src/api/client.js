import axios from 'axios';

export const AUTH_KEY = 'sanora_auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore broken storage */
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    if (status === 401 && !url.includes('/api/auth/') && localStorage.getItem(AUTH_KEY)) {
      localStorage.removeItem(AUTH_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/** Turns any Axios error into { message, fields } using our backend's ErrorResponse format. */
export function getErrorInfo(error) {
  if (!error.response) {
    return { message: 'Cannot reach the server. Please check that the backend is running.', fields: {} };
  }
  const data = error.response.data;
  if (data instanceof Blob) {
    return {
      message: error.response.status === 404 ? 'File not found.' : 'Could not download the file.',
      fields: {},
    };
  }
  return {
    message: data?.message || 'Something went wrong. Please try again.',
    fields: data?.errors || {},
  };
}

export default api;