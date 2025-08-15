import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../lib/axios";

function EditBannerModal({ banner, onClose, onUpdated }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        isActive: false,
        isLiquor: false,
    });
    const [previewImage, setPreviewImage] = useState("");   
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Prefill form with banner data
    useEffect(() => {
        if (banner) {
            setFormData({
                title: banner.title || "",
                description: banner.description || "",
                image: banner.image || "",
                isActive: banner.isActive || false,
                isLiquor: banner.isLiquor || false,
            });
            setPreviewImage(banner.image || "");
        }
    }, [banner]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    image: reader.result, // Base64 string
                }));
                setPreviewImage(reader.result); // Show preview
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axiosInstance.patch(`/banners/update/${banner.banner_id}`, formData);

            onUpdated();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update banner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <div style={{ background: "#fff", padding: 20, borderRadius: 8, width: 400 }}>
                <h3>Edit Banner</h3>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 10 }}>
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            style={{ width: "100%" }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ width: "100%" }}
                            required
                        />
                    </div>

                    {/* Image Preview */}
                    <div style={{ marginBottom: 10 }}>
                        <label>Current / New Image</label>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Banner Preview"
                                style={{
                                    width: "100%",
                                    borderRadius: 4,
                                    marginBottom: 8,
                                    border: "1px solid #ccc",
                                }}
                            />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "1rem", marginBottom: 10 }}>
                        <label>
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                            Active
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="isLiquor"
                                checked={formData.isLiquor}
                                onChange={handleChange}
                            />
                            Liquor
                        </label>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                        <button type="button" onClick={onClose} style={{ padding: "6px 12px" }}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                borderRadius: 4,
                            }}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditBannerModal;
