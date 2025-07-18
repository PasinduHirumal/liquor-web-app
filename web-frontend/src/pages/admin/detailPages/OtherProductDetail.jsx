import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
    FaWineBottle, FaBoxOpen, FaCalendarAlt, FaEdit, FaCheckCircle,
    FaTimesCircle, FaArrowLeft, FaWeightHanging, FaPercentage, FaTag
} from "react-icons/fa";
import { GiSodaCan } from "react-icons/gi";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";
import "../../../styles/OtherProductDetail.css";
import DeleteOtherProductButton from "../../../components/admin/buttons/DeleteOtherProductButton";

const OtherProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get(`/other-products/getOtherProductById/${id}`);
                if (!data.success || !data.data) {
                    throw new Error("Product not found");
                }
                setProduct(data.data);
                setActiveImage(data.data.images?.[0] || null);
                setError(null);
            } catch (err) {
                console.error("Fetch product error:", err);
                setError(err.message || "Failed to load product details");
                toast.error(err.message || "Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleDeleteSuccess = () => {
        toast.success("Product deleted successfully");
        navigate("/other-product-list");
    };

    if (error) {
        return (
            <div className="product-detail-error-container">
                <div className="product-not-found text-center py-5">
                    <FaTimesCircle className="not-found-icon text-danger" size={48} />
                    <h3 className="mt-3">Product not found</h3>
                    <p className="text-muted">The requested product could not be located.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-back mt-3"
                    >
                        <FaArrowLeft className="me-2" />
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return "N/A";
        }
    };

    const renderPriceSection = () => {
        if (!product) return null;

        return (
            <div className="product-price-section">
                <div className="price-display">
                    <span className="current-price">
                        ${product.selling_price?.toFixed(2) || "N/A"}
                    </span>
                </div>

                {product.discount_percentage > 0 && (
                    <div className="discount-display">
                        <span className="original-price">
                            ${product.marked_price?.toFixed(2)}
                        </span>
                        <span className="discount-badge">
                            <FaTag className="me-1" />
                            {product.discount_percentage}% OFF
                        </span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="product-detail-container">
            {loading ? (
                <div className="product-detail-skeleton">
                    <div className="skeleton-gallery">
                        <Skeleton height={500} className="skeleton-main-image" />
                        <div className="skeleton-thumbnails">
                            {[1, 2, 3, 4].map((item) => (
                                <Skeleton key={item} height={80} width={80} />
                            ))}
                        </div>
                    </div>
                    <div className="skeleton-info">
                        <Skeleton height={40} width="70%" />
                        <Skeleton height={30} width="50%" className="mt-3" />
                        <Skeleton count={5} className="mt-2" />
                        <div className="skeleton-actions mt-4">
                            <Skeleton height={45} width={150} />
                            <Skeleton height={45} width={150} className="ms-3" />
                        </div>
                    </div>
                </div>
            ) : product ? (
                <>
                    <div className="product-detail-header">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn-back"
                        >
                            <FaArrowLeft />
                            <span>Back</span>
                        </button>
                        <h1 className="product-title">{product.name}</h1>
                    </div>

                    <div className="product-detail-content">
                        {/* Image Gallery */}
                        <div className="product-gallery">
                            <div className="main-image-wrapper">
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={product.name}
                                        className="main-product-image"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-bottle.jpg';
                                            e.target.className = 'main-product-image placeholder';
                                        }}
                                    />
                                ) : (
                                    <div className="image-placeholder">
                                        {product.is_liquor ? (
                                            <FaWineBottle className="placeholder-icon" />
                                        ) : (
                                            <GiSodaCan className="placeholder-icon" />
                                        )}
                                        <span>No Image Available</span>
                                    </div>
                                )}
                            </div>

                            {product.images?.length > 1 && (
                                <div className="thumbnail-gallery">
                                    {product.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail-item ${activeImage === img ? 'active' : ''}`}
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
                            {renderPriceSection()}

                            <div className="product-status-section">
                                <div className={`stock-status ${product.is_in_stock ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.is_in_stock ? (
                                        <>
                                            <FaCheckCircle />
                                            <span>In Stock</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaTimesCircle />
                                            <span>Out of Stock</span>
                                        </>
                                    )}
                                </div>
                                <div className="stock-quantity">
                                    <FaBoxOpen />
                                    <span>{product.stock_quantity || 0} units available</span>
                                </div>
                            </div>

                            <div className="product-description">
                                <h3>Description</h3>
                                <p>
                                    {product.description || "No description provided."}
                                </p>
                            </div>

                            <div className="product-details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">
                                        <FaWeightHanging />
                                        Weight
                                    </span>
                                    <span className="detail-value">
                                        {product.weight || "N/A"} {product.weight ? "g" : ""}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">
                                        <FaPercentage />
                                        Discount
                                    </span>
                                    <span className="detail-value">
                                        {product.discount_percentage || 0}%
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Category</span>
                                    <span className="detail-value">
                                        {product.category_id?.name || "Uncategorized"}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Product Type</span>
                                    <span className="detail-value">
                                        {product.is_liquor ? "Liquor" : "Other Product"}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Status</span>
                                    <span className={`detail-value status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                                        {product.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">
                                        <FaCalendarAlt />
                                        Created
                                    </span>
                                    <span className="detail-value">
                                        {formatDate(product.created_at)}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">
                                        <FaEdit />
                                        Last Updated
                                    </span>
                                    <span className="detail-value">
                                        {formatDate(product.updated_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="product-actions">
                                <button
                                    className="btn-edit"
                                    onClick={() => navigate(`/other-products/edit/${id}`)}
                                >
                                    <FaEdit />
                                    Edit Product
                                </button>

                                <DeleteOtherProductButton
                                    id={id}
                                    onSuccess={handleDeleteSuccess}
                                    className="btn-delete"
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default OtherProductDetail;