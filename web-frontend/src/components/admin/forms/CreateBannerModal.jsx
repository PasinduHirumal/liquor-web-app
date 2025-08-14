import React, { useState } from "react";
import { axiosInstance } from "../../lib/axios";

export default function CreateBannerModal({ onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title || !description || !image) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post("/banners/create", { title, description, image });
            setTitle("");
            setDescription("");
            setImage("");
            setLoading(false);
            onCreated(); // Notify parent to refresh the list
            onClose();   // Close modal
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create banner");
            console.error("Error creating banner:", err);
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
                zIndex: 1000
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: 24,
                    borderRadius: 8,
                    width: 500,
                    maxWidth: "90%"
                }}
            >
                <h3>Create Banner</h3>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: "100%", marginBottom: 12, padding: 8 }}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: "100%", marginBottom: 12, padding: 8 }}
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    style={{ width: "100%", marginBottom: 12, padding: 8 }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button onClick={onClose} style={{ padding: "8px 16px" }}>
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer"
                        }}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
