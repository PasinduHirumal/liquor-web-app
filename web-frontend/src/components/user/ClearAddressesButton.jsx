import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";

const ClearAddressesButton = ({ onSuccess, className = "", variant = "outline-light" }) => {
    const [isClearing, setIsClearing] = useState(false);

    const handleClearAddresses = async () => {
        // Confirm before clearing
        const confirmClear = window.confirm(
            "⚠️ Are you sure you want to clear ALL your addresses?\n\n" +
            "This action cannot be undone. All your saved addresses will be permanently deleted."
        );

        if (!confirmClear) return;

        setIsClearing(true);
        
        try {
            const response = await axiosInstance.delete("/clear/addresses/my");
            
            if (response.data?.success) {
                toast.success("All addresses cleared successfully");
                if (onSuccess) {
                    await onSuccess();
                }
            } else {
                toast.success("All addresses cleared successfully");
                if (onSuccess) {
                    await onSuccess();
                }
            }
        } catch (error) {
            console.error("Error clearing addresses:", error);
            
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again.");
            } else if (error.response?.status === 403) {
                toast.error("You don't have permission to clear addresses");
            } else {
                toast.error(error.response?.data?.message || "Failed to clear addresses");
            }
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <button
            className={`btn btn-${variant} d-flex align-items-center ${className}`}
            onClick={handleClearAddresses}
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
                    Clear All Addresses
                </>
            )}
        </button>
    );
};

export default ClearAddressesButton;