import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
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
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.message || 'Login failed'
      });
      toast.error(err.response?.data?.message || 'Login failed');
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
      toast.error(err.response?.data?.message || 'Logout failed');
    }
  },

  // CHECK AUTH on app load
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
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      });
    }
  },

  // RESET error manually (optional)
  resetError: () => set({ error: null })
}));

export default useAuthStore;
