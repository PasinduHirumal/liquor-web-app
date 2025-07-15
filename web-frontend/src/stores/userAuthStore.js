import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,

    // Login
    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.post("/auth/user/login", credentials);

            set({
                user: res.data.data,
                isAuthenticated: true,
                loading: false,
                error: null,
            });
            toast.success(res.data.message || "Login successful");
        } catch (error) {
            const errMsg = error.response?.data?.message || "Login failed";
            set({
                error: errMsg,
                loading: false,
                isAuthenticated: false,
            });
            toast.error(errMsg);
        }
    },

    // Logout
    logout: async () => {
        set({ loading: true });
        try {
            await axiosInstance.post("/auth/user/logout");

            set({
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            });
            toast.success("Logout successful");
        } catch (error) {
            const errMsg = error.response?.data?.message || "Logout failed";
            set({
                error: errMsg,
                loading: false,
            });
            toast.error(errMsg);
        }
    },

    // Check Auth
    checkAuth: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosInstance.get("/auth/user/checkAuth");

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
                error: null,
            });
        }
    },

    resetError: () => set({ error: null }),
}));

export default useAuthStore;
