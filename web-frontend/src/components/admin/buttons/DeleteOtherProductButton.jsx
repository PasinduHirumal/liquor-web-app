import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import ConfirmDialog from "../../../common/ConfirmDialog";

const DeleteOtherProductButton = ({ id, onSuccess }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirmed = await ConfirmDialog({
            title: "Are you sure?",
            html: "You want to delete this product? This action cannot be undone.",
            icon: "warning",
        });

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            await axiosInstance.delete(`/other-products/delete/${id}`);
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
        <button
            className="delete-button d-flex align-items-center gap-2 px-3 py-2 rounded-3"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            <FaTrash />
            {isDeleting ? "Deleting..." : "Delete"}
        </button>
    );
};

export default DeleteOtherProductButton;
