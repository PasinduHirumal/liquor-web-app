import axios from "axios";

const API_URL = import.meta.env.VITE_APP_NODE_ENV === "production"
    ? import.meta.env.VITE_APP_PRODUCTION_API_URL
    : import.meta.env.VITE_APP_DEVELOPMENT_API_URL;

export const axiosInstance = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});