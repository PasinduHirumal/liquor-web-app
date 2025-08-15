import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../lib/axios";
import "bootstrap/dist/css/bootstrap.min.css";

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
                    image: reader.result,
                }));
                setPreviewImage(reader.result);
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
        <div className="modal show fade d-block pt-5" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Banner</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="form-control"
                                    rows="3"
                                    required
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Current / New Image</label>
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Banner Preview"
                                        className="img-fluid rounded border mb-2"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="form-control"
                                />
                            </div>

                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    id="activeCheck"
                                />
                                <label className="form-check-label" htmlFor="activeCheck">
                                    Active
                                </label>
                            </div>

                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="isLiquor"
                                    checked={formData.isLiquor}
                                    onChange={handleChange}
                                    id="liquorCheck"
                                />
                                <label className="form-check-label" htmlFor="liquorCheck">
                                    Liquor
                                </label>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditBannerModal;
