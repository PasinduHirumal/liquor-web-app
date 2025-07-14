import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  // Login
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/user/login', credentials);
      set({
        user: res.data.data,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      toast.success(res.data.message || "Login successful");
    } catch (error) {
      set({ error: error.response?.data?.message || "Login failed", loading: false });
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  // Logout
  logout: async () => {
    set({ loading: true });
    try {
      await axiosInstance.post('/auth/user/logout');
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
      toast.success("Logout successful");
    } catch (error) {
      set({ error: error.response?.data?.message || "Logout failed", loading: false });
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  // Check Auth (e.g., on app load or refresh)
  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get('/auth/user/checkAuth');
      set({
        user: res.data.data,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: error.response?.data?.message || "Not authenticated",
      });
    }
  },
}));

export default useAuthStore;
