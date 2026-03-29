import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";

const ClearCartButton = ({ onSuccess, className = "", variant = "outline-danger" }) => {
    const [isClearing, setIsClearing] = useState(false);

    const handleClearCart = async () => {
        // Confirm before clearing
        const confirmClear = window.confirm(
            "⚠️ Are you sure you want to clear your entire cart?\n\n" +
            "This action cannot be undone. All items in your cart will be permanently removed."
        );

        if (!confirmClear) return;

        setIsClearing(true);

        try {
            const response = await axiosInstance.delete("/clear/cart/my");

            if (response.data?.success) {
                toast.success("Cart cleared successfully");
                if (onSuccess) {
                    await onSuccess();
                }
            } else {
                toast.success("Cart cleared successfully");
                if (onSuccess) {
                    await onSuccess();
                }
            }
        } catch (error) {
            console.error("Error clearing cart:", error);

            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
            } else if (error.response?.status === 403) {
                toast.error("You don't have permission to clear cart");
            } else {
                toast.error(error.response?.data?.message || "Failed to clear cart");
            }
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <button
            className={`btn btn-${variant} d-flex align-items-center ${className}`}
            onClick={handleClearCart}
            disabled={isClearing}
        >
            {isClearing ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Clearing...
                </>
            ) : (
                <>
                    <FaTrashAlt className="me-2" />
                    Clear Cart
                </>
            )}
        </button>
    );
};

export default ClearCartButton;