import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const useAdminAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  // LOGIN
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/admin/login', credentials);
      set({
        user: res.data.data,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      toast.success(res.data.message);
      
      window.location.reload();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: errorMsg
      });
      toast.error(errorMsg);
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      // Try to call backend logout first
      try {
        await axiosInstance.post('/auth/admin/logout');
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        console.warn('Backend logout failed, proceeding with frontend cleanup');
      }

      // Manual cookie clearing for cross-origin scenarios
      const cookiesToClear = [
        'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;',
        'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.liquor-dash.sivdesanews.lk;',
        'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=liquor-dash.sivdesanews.lk;',
        'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.sivdesanews.lk;',
        'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=sivdesanews.lk;'
      ];

      cookiesToClear.forEach(cookie => {
        document.cookie = cookie;
      });

      // Clear any stored tokens in localStorage/sessionStorage as backup
      localStorage.removeItem('jwt');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('jwt');
      sessionStorage.removeItem('authToken');

      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });

      toast.success('Logged out successfully');

      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Logout failed';
      toast.error(errorMsg);

      // Even if logout fails, clear frontend state
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  },

  // CHECK AUTH
  checkAuth: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get('/auth/admin/checkAuth');
      set({
        user: res.data.data,
        isAuthenticated: true,
        loading: false,
        error: null
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Session expired';
      console.warn('Auth check failed:', errorMsg);

      // Clear any remaining cookies on auth failure
      document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  },

  resetError: () => set({ error: null })
}));

export default useAdminAuthStore;
