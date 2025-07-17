import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const LiquorEditForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        brand: "",
        alcohol_content: 0,
        volume: 0,
        price: 0,
        stock_quantity: 0,
        is_active: true,
        is_in_stock: true,
        is_liquor: true,
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImagesBase64, setNewImagesBase64] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/products/getProductById/${id}`);
                const product = res.data.data;

                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    brand: product.brand || "",
                    alcohol_content: product.alcohol_content || 0,
                    volume: product.volume || 0,
                    price: product.price || 0,
                    stock_quantity: product.stock_quantity || 0,
                    is_active: product.is_active ?? true,
                    is_in_stock: product.is_in_stock ?? true,
                    is_liquor: product.is_liquor ?? true,
                });

                setExistingImages(product.images || []);
            } catch (err) {
                toast.error("Failed to load product.");
                navigate("/liquor-list");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === "checkbox" ? checked : value;

        if (
            ["price", "stock_quantity", "alcohol_content", "volume"].includes(name)
        ) {
            newValue = parseFloat(newValue) || 0;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const handleNewImagesChange = async (e) => {
        const files = Array.from(e.target.files);
        try {
            const base64Promises = files.map((file) => fileToBase64(file));
            const base64Images = await Promise.all(base64Promises);
            setNewImagesBase64((prev) => [...prev, ...base64Images]);
        } catch (error) {
            toast.error("Failed to read image files.");
        }
    };

    const removeExistingImage = (url) => {
        setExistingImages((prev) => prev.filter((img) => img !== url));
    };

    const removeNewImage = (index) => {
        setNewImagesBase64((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const finalImages = [...existingImages, ...newImagesBase64];

            const payload = {
                ...formData,
                images: finalImages,
            };

            await axiosInstance.patch(`/products/update/${id}`, payload);
            toast.success("Product updated successfully!");
            navigate(`/liquor/${id}`);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Update failed.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Edit Liquor Product</h2>
            <form
                onSubmit={handleSubmit}
                className="edit-product-form"
                encType="multipart/form-data"
            >
                {/* Other product fields */}
                <div className="form-group">
                    <label>Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Brand</label>
                    <input
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-row d-flex gap-3">
                    <div className="form-group flex-fill">
                        <label>Price</label>
                        <input
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group flex-fill">
                        <label>Stock Quantity</label>
                        <input
                            name="stock_quantity"
                            type="number"
                            value={formData.stock_quantity}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-row d-flex gap-3">
                    <div className="form-group flex-fill">
                        <label>Alcohol Content (ABV%)</label>
                        <input
                            name="alcohol_content"
                            type="number"
                            value={formData.alcohol_content}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group flex-fill">
                        <label>Volume (ml)</label>
                        <input
                            name="volume"
                            type="number"
                            value={formData.volume}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-check">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="form-check-input"
                        id="is_active"
                    />
                    <label className="form-check-label" htmlFor="is_active">
                        Active
                    </label>
                </div>

                <div className="form-check">
                    <input
                        type="checkbox"
                        name="is_in_stock"
                        checked={formData.is_in_stock}
                        onChange={handleChange}
                        className="form-check-input"
                        id="is_in_stock"
                    />
                    <label className="form-check-label" htmlFor="is_in_stock">
                        In Stock
                    </label>
                </div>

                {/* Image Management */}
                <div className="form-group mt-3">
                    <label>Current Images</label>
                    <div
                        className="image-preview-container"
                        style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                    >
                        {existingImages.length === 0 && <p>No images available</p>}
                        {existingImages.map((url, idx) => (
                            <div key={idx} style={{ position: "relative" }}>
                                <img
                                    src={url}
                                    alt={`existing-${idx}`}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        objectFit: "cover",
                                        borderRadius: 4,
                                    }}
                                    onError={(e) => (e.target.src = "/placeholder-bottle.jpg")}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(url)}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        background: "rgba(255,0,0,0.7)",
                                        border: "none",
                                        color: "white",
                                        borderRadius: "50%",
                                        width: 24,
                                        height: 24,
                                        cursor: "pointer",
                                    }}
                                    title="Remove image"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group mt-3">
                    <label>Add New Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleNewImagesChange}
                        className="form-control"
                    />
                    {newImagesBase64.length > 0 && (
                        <div
                            className="new-image-preview-container"
                            style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                                marginTop: "10px",
                            }}
                        >
                            {newImagesBase64.map((base64, idx) => (
                                <div key={idx} style={{ position: "relative" }}>
                                    <img
                                        src={base64}
                                        alt={`new-${idx}`}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            objectFit: "cover",
                                            borderRadius: 4,
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(idx)}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            background: "rgba(255,0,0,0.7)",
                                            border: "none",
                                            color: "white",
                                            borderRadius: "50%",
                                            width: 24,
                                            height: 24,
                                            cursor: "pointer",
                                        }}
                                        title="Remove image"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-success mt-4">
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default LiquorEditForm;
