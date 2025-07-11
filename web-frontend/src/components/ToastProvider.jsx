import React from "react";
import { Toaster } from "react-hot-toast";

const toastOptions = {
  style: {
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "500",
    fontFamily: "system-ui, sans-serif",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  duration: 4000,

  success: {
    style: {
      background: "#d1fae5",
      color: "#065f46",
      border: "1px solid #34d399",
    },
    iconTheme: {
      primary: "#10b981",
      secondary: "#ffffff",
    },
  },

  error: {
    style: {
      background: "#fee2e2",
      color: "#991b1b",
      border: "1px solid #f87171",
    },
    iconTheme: {
      primary: "#ef4444",
      secondary: "#ffffff",
    },
  },
};

const ToastProvider = () => <Toaster position="top-center" toastOptions={toastOptions} />;

export default ToastProvider;
