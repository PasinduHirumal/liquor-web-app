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
        images: [],
    });

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
                    images: product.images || [],
                });
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

        if (["price", "stock_quantity", "alcohol_content", "volume"].includes(name)) {
            newValue = parseFloat(newValue) || 0;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.patch(`/products/update/${id}`, formData);
            toast.success("Product updated successfully!");
            navigate(-1);
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h2>Edit Liquor Product</h2>
            <form onSubmit={handleSubmit} className="edit-product-form">
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
                    <label className="form-check-label" htmlFor="is_active">Active</label>
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
                    <label className="form-check-label" htmlFor="is_in_stock">In Stock</label>
                </div>

                <button type="submit" className="btn btn-success mt-3">Update Product</button>
            </form>
        </div>
    );
};

export default LiquorEditForm;
