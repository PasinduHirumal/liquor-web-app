import React, { useState } from "react";
import { axiosInstance } from "../../../lib/axios";

function CreateBannerModal({ onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(""); // Base64 string
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!image) newErrors.image = "Image is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result); // Base64 string
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axiosInstance.post("/banners/create", {
                title,
                description,
                image, // send Base64
            });

            setTitle("");
            setDescription("");
            setImage("");
            setErrors({});
            onCreated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create banner");
            console.error("Error creating banner:", err);
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
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: 24,
                    borderRadius: 8,
                    width: 500,
                    maxWidth: "90%",
                    position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ marginBottom: 16 }}>Create Banner</h3>
                <div style={{ marginBottom: 12 }}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: "100%", padding: 8 }}
                    />
                    {errors.title && <p style={{ color: "red", fontSize: 12 }}>{errors.title}</p>}
                </div>
                <div style={{ marginBottom: 12 }}>
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ width: "100%", padding: 8 }}
                    />
                    {errors.description && (
                        <p style={{ color: "red", fontSize: 12 }}>{errors.description}</p>
                    )}
                </div>
                <div style={{ marginBottom: 12 }}>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {errors.image && <p style={{ color: "red", fontSize: 12 }}>{errors.image}</p>}
                    {image && (
                        <img
                            src={image}
                            alt="Preview"
                            style={{ marginTop: 8, maxWidth: "100%", maxHeight: 200 }}
                        />
                    )}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "8px 16px",
                            border: "1px solid #ccc",
                            background: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateBannerModal;