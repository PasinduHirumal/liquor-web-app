import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
    FaWineBottle, FaBoxOpen, FaCalendarAlt, FaEdit,
    FaCheckCircle, FaTimesCircle, FaArrowLeft, FaPercentage
} from "react-icons/fa";
import "../../../styles/LiquorProductDetail.css";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";
import DeleteLiquorButton from "../../../components/admin/buttons/DeleteLiquorButton";
import ViewProductHistory from "../../../common/ViewProductHistory";
import { Chip } from "@mui/material";
import { styled } from "@mui/system";

const OriginBadge = styled(Chip)(({ theme, origin }) => ({
    position: "absolute",
    top: "16px",
    right: "16px",
    zIndex: 2,
    fontWeight: "bold",
    fontSize: "0.9rem",
    color: "black",
    backgroundColor: "#1ceb23ff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    "& .MuiChip-label": {
        padding: "0 10px",
    },
    "&:hover": {
        transform: "scale(1.05)",
    },
    transition: "all 0.2s ease",
}));

const LiquorProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axiosInstance.get(`/products/getProductById/${id}`);
                const productData = res.data?.data;
                if (!productData) throw new Error("Product not found");

                setProduct(productData);
                setActiveImage(productData.main_image || productData.images?.[0] || null);
            } catch (err) {
                toast.error("Failed to load product details. Please try again later.");
                navigate("/liquor-list");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleDeleteSuccess = () => {
        navigate("/liquor-list");
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return "Invalid date";
        }
    };

    const getDiscountPercentage = () => {
        const marked = product.marked_price;
        const selling = product.selling_price;
        if (!marked || !selling || marked <= selling) return null;
        return Math.round(((marked - selling) / marked) * 100);
    };

    const discountPercentage = product ? getDiscountPercentage() : null;

    return (
        <div className="container-fluid px-4 pb-2 pt-3 bg-white">
            {loading ? (
                <div className="product-detail-loading">
                    <div className="loading-left">
                        <Skeleton height={400} />
                        <div className="loading-thumbnails mt-3">
                            {[1, 2, 3].map((_, i) => (
                                <Skeleton key={i} height={60} width={60} />
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
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-outline-dark d-flex align-items-center gap-2"
                        >
                            <FaArrowLeft />
                            Back
                        </button>
                        <h1>{product.name}</h1>
                    </div>

                    <div className="product-content">
                        {/* Image Gallery */}
                        <div className="product-gallery">
                            <div className="main-image-container">
                                {product.product_from && (
                                        <OriginBadge
                                            label={`From: ${product.product_from}`}
                                            size="medium"
                                        />
                                )}
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

                            {/* Thumbnails */}
                            {(product.main_image || product.images?.length) && (
                                <div className="thumbnail-container">
                                    {[product.main_image, ...(product.images || [])]
                                        .filter((img, idx, arr) => img && arr.indexOf(img) === idx)
                                        .map((img, index) => (
                                            <div
                                                key={index}
                                                className={`thumbnail ${activeImage === img ? "active" : ""}`}
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
                            {/* Price & Discount */}
                            <div className="price-section d-flex align-items-center gap-3 flex-wrap m-0">
                                <span className="current-price text-success">
                                    Rs: {product.selling_price?.toFixed(2) || "N/A"}
                                </span>

                                {product.marked_price > product.selling_price && (
                                    <>
                                        <span className="original-price text-muted text-decoration-line-through">
                                            Rs: {product.marked_price?.toFixed(2)}
                                        </span>

                                        {discountPercentage && (
                                            <span className="badge bg-danger d-flex align-items-center gap-1 px-2 py-1">
                                                <FaPercentage />
                                                {discountPercentage}% OFF
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Stock */}
                            <div className="availability-section m-0">
                                <div className={`stock-status ${product.is_in_stock ? "in-stock" : "out-of-stock"}`}>
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
                                    <span>{product.stock_quantity || 0} units available</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="description-section m-0">
                                <h3>Description</h3>
                                <p>{product.description || "No description provided."}</p>
                            </div>

                            {/* Metadata Grid */}
                            <div className="details-grid m-0">
                                <div className="detail-item">
                                    <span className="detail-label">Category:</span>
                                    <span className="detail-value">
                                        {product.category_id?.name || "Uncategorized"}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">ABV:</span>
                                    <span className="detail-value">{product.alcohol_content || 0}%</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Volume:</span>
                                    <span className="detail-value">{product.volume || "N/A"} ml</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Status:</span>
                                    <span className={`detail-value status-badge ${product.is_active ? "active" : "inactive"}`}>
                                        {product.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Created:</span>
                                    <span className="detail-value">
                                        <FaCalendarAlt className="calendar-icon" />
                                        {formatDate(product.created_at)}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Last Updated:</span>
                                    <span className="detail-value">
                                        <FaEdit className="edit-icon" />
                                        {formatDate(product.updated_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="action-buttons d-flex gap-3 flex-wrap m-0">
                                <button
                                    className="edit-button d-flex align-items-center gap-2 px-3 py-2"
                                    onClick={() => navigate(`/products/edit/${id}`)}
                                >
                                    <FaEdit />
                                    Edit
                                </button>

                                <ViewProductHistory productId={id} productName={product.name} />

                                <DeleteLiquorButton
                                    id={id}
                                    onSuccess={handleDeleteSuccess}
                                />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="product-not-found text-center py-5">
                    <FaTimesCircle className="not-found-icon text-danger" size={48} />
                    <h3>Product not found</h3>
                    <p className="text-muted">The requested product could not be located.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-outline-dark mt-3"
                    >
                        <FaArrowLeft className="me-2" />
                        Back to Products
                    </button>
                </div>
            )}
        </div>
    );
};

export default LiquorProductDetail;