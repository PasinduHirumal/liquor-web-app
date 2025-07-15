import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const SetActiveButton = ({ addressId, isActive, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const toggleStatus = async () => {
        try {
            setLoading(true);
            await axiosInstance.patch(`/addresses/update/${addressId}`, {
                isActive: !isActive,
            });
            toast.success(`Address ${!isActive ? "activated" : "deactivated"} successfully`);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Toggle active error:", error.response?.data || error.message);
            toast.error("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`btn btn-sm ${isActive ? "btn-outline-danger" : "btn-outline-success"}`}
            onClick={toggleStatus}
            disabled={loading}
        >
            {loading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            ) : null}
            {isActive ? "Set as Inactive" : "Set as Active"}
        </button>
    );
};

export default SetActiveButton;
