import React, { useState } from "react";
import { axiosInstance } from "../../../lib/axios";

function CreateBannerModal({ onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
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
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await axiosInstance.post("/banners/create", { title, description, image });
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
        <div className="modal show fade d-block mt-5" tabIndex="-1" onClick={onClose}>
            <div
                className="modal-dialog"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create Banner</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <input
                                type="text"
                                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                className={`form-control ${errors.image ? "is-invalid" : ""}`}
                                onChange={handleImageChange}
                            />
                            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                            {image && (
                                <img
                                    src={image}
                                    alt="Preview"
                                    className="img-fluid mt-2"
                                    style={{ maxHeight: "200px" }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBannerModal;
