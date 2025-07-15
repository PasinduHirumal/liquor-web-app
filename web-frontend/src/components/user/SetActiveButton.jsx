import React from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const SetActiveButton = ({ addressId, isActive, onSuccess }) => {
    const toggleStatus = async () => {
        try {
            await axiosInstance.patch(`/addresses/update/${addressId}`, {
                isActive: !isActive,
            });
            toast.success(`Address ${!isActive ? "activated" : "deactivated"} successfully`);
            if (onSuccess) onSuccess(); // refetch list
        } catch (error) {
            console.error("Toggle active error:", error.response?.data || error.message);
            toast.error("Failed to update status");
        }
    };

    return (
        <button
            className={`btn btn-sm ${isActive ? "btn-outline-danger" : "btn-outline-success"}`}
            onClick={toggleStatus}
        >
            {isActive ? "Set as Inactive" : "Set as Active"}
        </button>
    );
};

export default SetActiveButton;
