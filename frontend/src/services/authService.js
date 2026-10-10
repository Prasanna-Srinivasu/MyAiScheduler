import api from './api';

export const authService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async socialLogin(data) {
    const response = await api.post('/auth/social-login', data);
    return response.data;
  },

  async googleLogin(data) {
    const response = await api.post('/auth/google', data);
    return response.data;
  },

  async githubOAuth(data) {
    const response = await api.post('/auth/oauth/github', data);
    return response.data;
  },

  async getSession() {
    const response = await api.get('/auth/session');
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  async getPreferences() {
    const response = await api.get('/users/preferences');
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
