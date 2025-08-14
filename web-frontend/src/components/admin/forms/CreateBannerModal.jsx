import React, { useState } from "react";
import { axiosInstance } from "../../../lib/axios";

function CreateBannerModal({ onClose, onCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isLiquor, setIsLiquor] = useState(true);
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
            await axiosInstance.post("/banners/create", {
                title,
                description,
                image,
                isActive,
                isLiquor
            });
            setTitle("");
            setDescription("");
            setImage("");
            setIsActive(true);
            setIsLiquor(true);
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
            className="modal-backdrop d-flex justify-content-center align-items-center my-4"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(5px)",
                zIndex: 1050,
            }}
        >
            <div
                className="modal-dialog"
                style={{ maxWidth: "500px", width: "90%", maxHeight: "90vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="modal-content"
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: "85vh"
                    }}
                >
                    <div className="modal-header">
                        <h5 className="modal-title">Create Banner</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body" style={{ overflowY: "auto" }}>
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

                        <div className="d-flex align-items-center mb-3 gap-4">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={() => setIsActive(!isActive)}
                                    id="isActiveSwitch"
                                />
                                <label className="form-check-label" htmlFor="isActiveSwitch">
                                    Active
                                </label>
                            </div>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={isLiquor}
                                    onChange={() => setIsLiquor(!isLiquor)}
                                    id="isLiquorSwitch"
                                />
                                <label className="form-check-label" htmlFor="isLiquorSwitch">
                                    Is Liquor
                                </label>
                            </div>
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
                    <div className="modal-footer gap-2">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateBannerModal;
