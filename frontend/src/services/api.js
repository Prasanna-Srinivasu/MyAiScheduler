import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Automatically includes secure HTTP-only session cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to handle unauthorized / session expiry gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If checking session returned 401, don't force redirect
    if (error.config && error.config.url && error.config.url.includes('/auth/session')) {
      return Promise.reject(error);
    }
    if (error.response && error.response.status === 401) {
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register') &&
        !window.location.pathname.includes('/practice') &&
        !window.location.pathname.includes('/courses') &&
        !window.location.pathname.includes('/roadmaps')
      ) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
