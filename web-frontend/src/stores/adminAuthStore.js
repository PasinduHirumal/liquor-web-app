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
      await axiosInstance.post('/auth/admin/logout');
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
      toast.success('Logged out successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Logout failed';
      toast.error(errorMsg);
    }
  },

  // CHECK AUTH (Improved)
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
