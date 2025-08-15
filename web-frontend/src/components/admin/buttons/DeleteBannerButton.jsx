import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";
import ConfirmDeleteDialog from "../../../common/ConfirmDeleteDialog";

export default function DeleteBannerButton({ bannerId, onDeleted }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        const confirmed = await ConfirmDeleteDialog({
            title: "Delete Banner",
            html: "Are you sure you want to delete this banner? This action cannot be undone.",
            icon: "warning",
        });

        if (!confirmed) return;

        setLoading(true);
        try {
            await axiosInstance.delete(`/banners/delete/${bannerId}`);
            toast.success("Banner deleted successfully");
            onDeleted();
        } catch (err) {
            console.error("Error deleting banner:", err);
            toast.error(err.response?.data?.message || "Failed to delete banner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            style={{
                marginTop: 12,
                padding: "6px 12px",
                backgroundColor: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: loading ? "not-allowed" : "pointer",
                alignSelf: "flex-end",
                opacity: loading ? 0.6 : 1,
            }}
            onClick={handleDelete}
            disabled={loading}
        >
            {loading ? "Deleting..." : "Delete"}
        </button>
    );
}
