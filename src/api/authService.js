import apiClient from './client.js';

const STORAGE_KEY = 'campuspulse_auth_user';

/**
 * Enterprise Authentication API Service
 */
export const AuthService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  async signIn(email, password) {
    if (!email || !password) {
      throw new Error('Email address and password are required.');
    }

    return apiClient.post('/auth/signin', { email, password }, {
      mockHandler: () => {
        const user = {
          id: `USR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          email,
          name: email.split('@')[0].replace('.', ' '),
          role: 'Facility Manager',
          institution: 'Campus Sustainability Department',
          authenticatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
      }
    });
  },

  async signUp(name, email, password) {
    if (!name || !email || !password) {
      throw new Error('Full name, institutional email, and password are required.');
    }

    return apiClient.post('/auth/register', { name, email, password }, {
      mockHandler: () => {
        const user = {
          id: `USR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          name,
          email,
          role: 'Facility Manager',
          institution: 'Campus Sustainability Department',
          authenticatedAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return user;
      }
    });
  },

  async sendPasswordReset(email) {
    if (!email) {
      throw new Error('Please enter a valid institutional email.');
    }

    return apiClient.post('/auth/forgot-password', { email }, {
      mockHandler: () => ({
        success: true,
        message: `Recovery instructions sent to ${email}`
      })
    });
  },

  async signOut() {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  }
};

export default AuthService;
