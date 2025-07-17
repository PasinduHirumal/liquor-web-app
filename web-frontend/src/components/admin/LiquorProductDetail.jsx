import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

const LiquorProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/products/getProductById/${id}`);
                setProduct(res.data.data);
                setActiveImage(res.data.data.images?.[0] || null);
            } catch (err) {
                setError("Failed to load product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="container my-5">Loading product details...</div>;
    if (error) return <div className="container my-5 text-danger">{error}</div>;
    if (!product) return <div className="container my-5">Product not found.</div>;

    return (
        <div className="container-fluid mt-2">
            <h2 className="mb-4">{product.name}</h2>
            <div className="row">
                {/* Image Preview Section */}
                <div className="col-md-6 mb-4">
                    {activeImage ? (
                        <img
                            src={activeImage}
                            alt={product.name}
                            className="img-fluid border p-2"
                            style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                    ) : (
                        <div className="bg-light d-flex justify-content-center align-items-center border" style={{ height: "400px" }}>
                            <span>No Image Available</span>
                        </div>
                    )}

                    {/* Image thumbnails */}
                    {product.images?.length > 1 && (
                        <div className="d-flex flex-wrap gap-2 mt-3">
                            {product.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    onClick={() => setActiveImage(img)}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        border: activeImage === img ? "2px solid #007bff" : "1px solid #ccc",
                                        borderRadius: "5px",
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details Section */}
                <div className="col-md-6">
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th>Product Name</th>
                                <td>{product.name || "N/A"}</td>
                            </tr>
                            <tr>
                                <th>Category</th>
                                <td>{product.category_id?.name || "Uncategorized"}</td>
                            </tr>
                            <tr>
                                <th>Price</th>
                                <td>${product.price?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>Stock Quantity</th>
                                <td>{product.stock_quantity}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>
                                    <span className={`badge ${product.is_active ? "bg-success" : "bg-secondary"}`}>
                                        {product.is_active ? "Active" : "Inactive"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th>Availability</th>
                                <td>
                                    <span className={`badge ${product.is_in_stock ? "bg-primary" : "bg-warning text-dark"}`}>
                                        {product.is_in_stock ? "In Stock" : "Out of Stock"}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>{product.description || "No description provided."}</td>
                            </tr>
                            <tr>
                                <th>Created At</th>
                                <td>{new Date(product.createdAt).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <th>Updated At</th>
                                <td>{new Date(product.updatedAt).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LiquorProductDetail;
