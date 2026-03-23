import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";
import useAdminAuthStore from "../stores/adminAuthStore";
import CartButton from "./CartButton";

const formatPrice = (value) => `Rs: ${Number(value || 0).toFixed(2)}`;

const OtherProductCard = ({ product, adminOnly = false }) => {
    const navigate = useNavigate();
    const adminAuth = useAdminAuthStore((state) => state.isAuthenticated);
    const showBuyNow = !adminOnly && !adminAuth;

    const productId = product.product_id || product.id;

    const combinedImages = useMemo(() => {
        const imgs = [
            ...(product.main_image ? [product.main_image] : []),
            ...(product.images || []),
        ];
        return imgs.filter((img, index, arr) => img && arr.indexOf(img) === index);
    }, [product.main_image, product.images]);

    const [activeImage, setActiveImage] = useState(combinedImages[0] || "");

    useEffect(() => {
        setActiveImage(combinedImages[0] || "");
    }, [combinedImages]);

    const handleViewDetail = () => {
        navigate(`/other-products/${productId}`);
    };

    const hasDiscount = Number(product.discount_percentage) > 0;
    const sellingPrice = Number(product.selling_price || 0);
    const markedPrice = Number(product.marked_price || product.price || 0);
    const displayPrice = hasDiscount ? sellingPrice : markedPrice;

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4">
            <div
                className="card h-100 shadow-sm border-secondary"
                style={{
                    transition: "transform 0.2s ease-in-out",
                    backgroundColor: "#0b0d17",
                    color: "#fff",
                    border: "1px solid #1c1f2b",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                {adminOnly && (
                    <div
                        className="header d-flex justify-content-between align-items-center px-2 py-1"
                        style={{
                            backgroundColor: "#141722",
                            borderBottom: "1px solid #1c1f2b",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            color: "#fff",
                        }}
                    >
                        <span style={{ color: product.isProfit ? "#22c55e" : "#ef4444" }}>
                            {product.isProfit ? "Profit" : "No Profit"}
                        </span>

                        <span>
                            Profit Value:{" "}
                            <span style={{ color: "#ffb703" }}>
                                {formatPrice(product.profit_value)}
                            </span>
                        </span>
                    </div>
                )}

                <div
                    style={{ position: "relative", cursor: "pointer" }}
                    onClick={handleViewDetail}
                >
                    {activeImage ? (
                        <img
                            src={activeImage}
                            alt={product.name}
                            className="card-img-top p-2"
                            style={{
                                height: "200px",
                                objectFit: "contain",
                                backgroundColor: "#141722",
                                borderBottom: "1px solid #1c1f2b",
                            }}
                        />
                    ) : (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                height: "200px",
                                borderBottom: "1px solid #1c1f2b",
                                backgroundColor: "#141722",
                            }}
                        >
                            <small className="text-muted">No Image Available</small>
                        </div>
                    )}

                    {product.product_from && (
                        <span
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "#ffb703",
                                color: "#000",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                            }}
                        >
                            {product.product_from.charAt(0).toUpperCase() +
                                product.product_from.slice(1)}
                        </span>
                    )}
                </div>

                {combinedImages.length > 1 && (
                    <div className="d-flex justify-content-center gap-1 py-2 px-1 flex-wrap">
                        {combinedImages.map((img, idx) => (
                            <img
                                key={img || idx}
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                onClick={() => setActiveImage(img)}
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    objectFit: "cover",
                                    cursor: "pointer",
                                    border:
                                        img === activeImage
                                            ? "2px solid #ffb703"
                                            : "1px solid #555",
                                    borderRadius: "3px",
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="card-body d-flex flex-column">
                    <h6
                        className="card-title text-truncate mb-1"
                        style={{ color: "#fff", cursor: "pointer" }}
                        onClick={handleViewDetail}
                        title={product.name}
                    >
                        {product.name}
                    </h6>

                    <RatingStars productId={productId} />

                    <p className="card-text mb-1">
                        <small style={{ color: "#9ca3af" }}>
                            Category: {product.category_id?.name || "Uncategorized"}
                        </small>
                    </p>

                    <div className="mb-1">
                        {hasDiscount ? (
                            <>
                                <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                                    {formatPrice(sellingPrice)}
                                </span>
                                <br />
                                <span
                                    className="text-decoration-line-through"
                                    style={{ color: "#6b7280", fontSize: "0.85rem" }}
                                >
                                    {formatPrice(markedPrice)}
                                </span>
                                <span
                                    className="ms-2"
                                    style={{
                                        backgroundColor: "#ef4444",
                                        color: "#fff",
                                        padding: "2px 5px",
                                        borderRadius: "3px",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {Number(product.discount_percentage)}% OFF
                                </span>
                            </>
                        ) : (
                            <span style={{ fontWeight: "bold", color: "#fff" }}>
                                {formatPrice(displayPrice)}
                            </span>
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <small
                            style={{
                                color: Number(product.stock_quantity) > 0 ? "#22c55e" : "#ef4444",
                                fontWeight: "bold",
                            }}
                        >
                            {Number(product.stock_quantity) > 0
                                ? `${product.stock_quantity} in stock`
                                : "Out of stock"}
                        </small>

                        <small style={{ color: "#9ca3af" }}>
                            {product.weight ? `${product.weight}g` : ""}
                        </small>
                    </div>

                    {adminOnly && (
                        <div className="mb-2">
                            <span
                                className={`badge me-1 ${product.is_active ? "bg-success" : "bg-secondary"
                                    }`}
                            >
                                {product.is_active ? "Active" : "Inactive"}
                            </span>

                            {product.is_liquor && (
                                <span className="badge bg-danger me-1">Liquor</span>
                            )}

                            <span
                                className={`badge ${product.is_in_stock ? "bg-primary" : "bg-warning text-dark"
                                    }`}
                            >
                                {product.is_in_stock ? "Available" : "Unavailable"}
                            </span>
                        </div>
                    )}

                    <div
                        className="card-footer mt-auto text-center"
                        style={{ background: "transparent", borderTop: "1px solid #1c1f2b" }}
                    >
                        {adminOnly ? (
                            <button
                                className="btn btn-outline-light btn-sm w-100"
                                onClick={handleViewDetail}
                            >
                                View Details
                            </button>
                        ) : showBuyNow ? (
                            <CartButton
                                productId={productId}
                                disabled={!product.is_active || !product.is_in_stock}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherProductCard;