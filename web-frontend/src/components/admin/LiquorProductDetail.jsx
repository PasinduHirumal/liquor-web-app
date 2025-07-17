import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../styles/LiquorProductDetail.css";
import { FaWineBottle, FaBoxOpen, FaCalendarAlt, FaEdit, FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import { axiosInstance } from "../../lib/axios";
import DeleteLiquorButton from "./buttons/DeleteLiquorButton";

const LiquorProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/products/getProductById/${id}`);
                setProduct(res.data.data);
                setActiveImage(res.data.data.images?.[0] || null);
            } catch (err) {
                setError("Failed to load product details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleDeleteSuccess = () => {
        navigate("/products", { state: { message: "Product deleted successfully" } });
    };

    if (error) return (
        <div className="product-detail-error">
            <div className="error-message">
                <FaTimesCircle className="error-icon" />
                <h3>{error}</h3>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Retry
                </button>
            </div>
        </div>
    );

    return (
        <div className="container-fluid px-4 pb-2 mt-3">
            {loading ? (
                <div className="product-detail-loading">
                    <div className="loading-left">
                        <Skeleton height={400} />
                        <div className="loading-thumbnails">
                            {[1, 2, 3].map((item) => (
                                <Skeleton key={item} height={60} width={60} />
                            ))}
                        </div>
                    </div>
                    <div className="loading-right">
                        <Skeleton height={40} width="80%" />
                        <Skeleton count={8} />
                    </div>
                </div>
            ) : product ? (
                <>
                    <div className="product-header d-flex align-items-center gap-4">
                        <button onClick={() => navigate(-1)} className="btn btn-outline-dark d-flex align-items-center gap-2">
                            <FaArrowLeft />
                            Back
                        </button>

                        <h1>{product.name}</h1>
                    </div>

                    <div className="product-content">
                        {/* Image Gallery */}
                        <div className="product-gallery">
                            <div className="main-image-container">
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={product.name}
                                        className="main-image"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-bottle.jpg';
                                        }}
                                    />
                                ) : (
                                    <div className="no-image">
                                        <FaWineBottle className="no-image-icon" />
                                        <span>No Image Available</span>
                                    </div>
                                )}
                            </div>

                            {product.images?.length > 1 && (
                                <div className="thumbnail-container">
                                    {product.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail ${activeImage === img ? 'active' : ''}`}
                                            onClick={() => setActiveImage(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-bottle.jpg';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="product-info">
                            <div className="price-section">
                                <span className="current-price">${product.price?.toFixed(2)}</span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>

                            <div className="availability-section">
                                <div className={`stock-status ${product.is_in_stock ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.is_in_stock ? (
                                        <>
                                            <FaCheckCircle className="status-icon" />
                                            <span>In Stock</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaTimesCircle className="status-icon" />
                                            <span>Out of Stock</span>
                                        </>
                                    )}
                                </div>
                                <div className="stock-quantity">
                                    <FaBoxOpen className="quantity-icon" />
                                    <span>{product.stock_quantity} units available</span>
                                </div>
                            </div>

                            <div className="description-section">
                                <h3>Description</h3>
                                <p>{product.description || "No description provided."}</p>
                            </div>

                            <div className="details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Category:</span>
                                    <span className="detail-value">{product.category_id?.name || "Uncategorized"}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">ABV:</span>
                                    <span className="detail-value">{product.alcohol_content || "N/A"}%</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Volume:</span>
                                    <span className="detail-value">{product.volume || "N/A"} ml</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Status:</span>
                                    <span className={`detail-value status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                                        {product.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Created:</span>
                                    <span className="detail-value">
                                        <FaCalendarAlt className="calendar-icon" />
                                        {new Date(product.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Last Updated:</span>
                                    <span className="detail-value">
                                        <FaEdit className="edit-icon" />
                                        {new Date(product.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <div className="action-buttons">
                                    <button className="edit-button">Edit</button>
                                    <DeleteLiquorButton
                                        id={id}
                                        onSuccess={handleDeleteSuccess}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="product-not-found">
                    <FaTimesCircle className="not-found-icon" />
                    <h3>Product not found</h3>
                    <p>The requested product could not be located.</p>
                </div>
            )}
        </div>
    );
};

export default LiquorProductDetail;