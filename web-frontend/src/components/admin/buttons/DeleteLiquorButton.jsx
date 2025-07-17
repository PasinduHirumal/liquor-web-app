import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const DeleteLiquorButton = ({ id, onSuccess }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);

        try {
            await axiosInstance.delete(`/products/delete/${id}`);
            toast.success("Product deleted successfully!");
            onSuccess?.();
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to delete product. Please try again.";
            toast.error(errorMsg);
            console.error("Delete error:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="delete-button-container">
            <button
                className="delete-button"
                onClick={handleDelete}
                disabled={isDeleting}
            >
                <FaTrash className="delete-icon" />
                {isDeleting ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
};

export default DeleteLiquorButton;
