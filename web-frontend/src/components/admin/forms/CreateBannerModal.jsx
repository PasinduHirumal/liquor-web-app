import React, { useState } from "react";

export default function CreateBannerModal({ onClose, onSave }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const handleSave = () => {
        if (!title || !description || !image) {
            alert("Please fill all fields");
            return;
        }
        onSave({ title, description, image });
        setTitle("");
        setDescription("");
        setImage("");
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
                        style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "#fff", border: "none" }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
