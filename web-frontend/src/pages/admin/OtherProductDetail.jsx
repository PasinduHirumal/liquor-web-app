import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { 
  FaWineBottle, 
  FaBoxOpen, 
  FaCalendarAlt, 
  FaEdit, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowLeft,
  FaWeightHanging,
  FaPercentage,
  FaDollarSign
} from "react-icons/fa";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import DeleteLiquorButton from "../../components/admin/buttons/DeleteLiquorButton";

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
            <div className="container-fluid px-4 pb-2 mt-3">
                <div className="product-not-found text-center py-5">
                    <FaTimesCircle className="not-found-icon" size={48} />
                    <h3 className="mt-3">Product not found</h3>
                    <p className="text-muted">The requested product could not be located.</p>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="btn btn-outline-primary mt-3"
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
            <div className="price-section mb-4">
                <div className="d-flex align-items-center">
                    <FaDollarSign className="me-2 text-muted" />
                    <span className="current-price fs-3 fw-bold">
                        ${product.selling_price?.toFixed(2) || "N/A"}
                    </span>
                </div>
                
                {product.discount_percentage > 0 && (
                    <div className="discount-info mt-2">
                        <span className="original-price me-2">
                            ${product.marked_price?.toFixed(2)}
                        </span>
                        <span className="discount-badge bg-danger text-white px-2 py-1 rounded">
                            {product.discount_percentage}% OFF
                        </span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="container-fluid px-4 pb-2 mt-3">
            {loading ? (
                <div className="product-detail-loading">
                    <div className="loading-left">
                        <Skeleton height={400} />
                        <div className="loading-thumbnails d-flex gap-2 mt-3">
                            {[1, 2, 3].map((item) => (
                                <Skeleton key={item} height={80} width={80} />
                            ))}
                        </div>
                    </div>
                    <div className="loading-right">
                        <Skeleton height={40} width="80%" />
                        <Skeleton count={8} />
                        <div className="mt-4">
                            <Skeleton height={50} width={120} />
                            <Skeleton height={50} width={120} className="ms-3" />
                        </div>
                    </div>
                </div>
            ) : product ? (
                <>
                    <div className="product-header d-flex align-items-center gap-4 mb-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="btn btn-outline-dark d-flex align-items-center gap-2"
                        >
                            <FaArrowLeft />
                            Back
                        </button>
                        <h1 className="mb-0">{product.name}</h1>
                    </div>

                    <div className="product-content row">
                        {/* Image Gallery */}
                        <div className="product-gallery col-lg-6 mb-4">
                            <div className="main-image-container ratio ratio-1x1 bg-light rounded">
                                {activeImage ? (
                                    <img
                                        src={activeImage}
                                        alt={product.name}
                                        className="main-image object-fit-contain p-3"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-bottle.jpg';
                                            e.target.className = 'main-image object-fit-cover';
                                        }}
                                    />
                                ) : (
                                    <div className="no-image d-flex flex-column justify-content-center align-items-center h-100">
                                        <FaWineBottle className="no-image-icon text-muted mb-2" size={48} />
                                        <span className="text-muted">No Image Available</span>
                                    </div>
                                )}
                            </div>

                            {product.images?.length > 1 && (
                                <div className="thumbnail-container d-flex flex-wrap gap-2 mt-3">
                                    {product.images.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail ratio ratio-1x1 ${activeImage === img ? 'active' : ''}`}
                                            onClick={() => setActiveImage(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="object-fit-cover"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-bottle.jpg';
                                                    e.target.className = 'object-fit-contain p-1';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="product-info col-lg-6">
                            {renderPriceSection()}

                            <div className="availability-section mb-4">
                                <div className={`stock-status d-flex align-items-center mb-2 ${product.is_in_stock ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.is_in_stock ? (
                                        <>
                                            <FaCheckCircle className="status-icon me-2" />
                                            <span>In Stock</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaTimesCircle className="status-icon me-2" />
                                            <span>Out of Stock</span>
                                        </>
                                    )}
                                </div>
                                <div className="stock-quantity d-flex align-items-center">
                                    <FaBoxOpen className="quantity-icon me-2 text-muted" />
                                    <span>{product.stock_quantity || 0} units available</span>
                                </div>
                            </div>

                            <div className="description-section mb-4">
                                <h3>Description</h3>
                                <p className="text-muted">
                                    {product.description || "No description provided."}
                                </p>
                            </div>

                            <div className="details-grid row row-cols-1 row-cols-md-2 g-3 mb-4">
                                <div className="detail-item col">
                                    <span className="detail-label d-flex align-items-center">
                                        <FaWeightHanging className="me-2 text-muted" />
                                        Weight:
                                    </span>
                                    <span className="detail-value">
                                        {product.weight || "N/A"} {product.weight ? "g" : ""}
                                    </span>
                                </div>
                                <div className="detail-item col">
                                    <span className="detail-label d-flex align-items-center">
                                        <FaPercentage className="me-2 text-muted" />
                                        Discount:
                                    </span>
                                    <span className="detail-value">
                                        {product.discount_percentage || 0}%
                                    </span>
                                </div>
                                <div className="detail-item col">
                                    <span className="detail-label">Category:</span>
                                    <span className="detail-value">
                                        {product.category_id?.name || "Uncategorized"}
                                    </span>
                                </div>
                                <div className="detail-item col">
                                    <span className="detail-label">Product Type:</span>
                                    <span className="detail-value">
                                        {product.is_liquor ? "Liquor" : "Other Product"}
                                    </span>
                                </div>
                                <div className="detail-item col">
                                    <span className="detail-label">Status:</span>
                                    <span className={`detail-value status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                                        {product.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="detail-item col">
                                    <span className="detail-label d-flex align-items-center">
                                        <FaCalendarAlt className="me-2 text-muted" />
                                        Created:
                                    </span>
                                    <span className="detail-value">
                                        {formatDate(product.created_at)}
                                    </span>
                                </div>
                                <div className="detail-item col">
                                    <span className="detail-label d-flex align-items-center">
                                        <FaEdit className="me-2 text-muted" />
                                        Last Updated:
                                    </span>
                                    <span className="detail-value">
                                        {formatDate(product.updated_at)}
                                    </span>
                                </div>
                            </div>

                            <div className="action-buttons d-flex gap-3">
                                <button
                                    className="btn btn-primary d-flex align-items-center gap-2"
                                    onClick={() => navigate(`/other-products/edit/${id}`)}
                                >
                                    <FaEdit />
                                    Edit Product
                                </button>

                                <DeleteLiquorButton
                                    id={id}
                                    onSuccess={handleDeleteSuccess}
                                    className="btn btn-danger"
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