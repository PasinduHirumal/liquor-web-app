import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const money = (value) => `Rs: ${Number(value || 0).toFixed(2)}`;

export default function CheckoutSummary() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
    const [notes, setNotes] = useState("");

    const checkoutData = location.state?.orderData;
    const addressId = location.state?.addressId;

    if (!checkoutData) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning text-center">
                    <h4>No checkout data found</h4>
                    <p>Please return to cart and try again.</p>
                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => navigate("/cart")}
                    >
                        Back to Cart
                    </button>
                </div>
            </div>
        );
    }

    const {
        finance,
        distance,
        estimated_delivery,
        warehouse,
        items,
        summary
    } = checkoutData;

    const handleCreateOrder = async () => {
    if (!addressId) {
        toast.error("Address not found. Please go back and select an address.");
        return;
    }

    try {
        setLoading(true);

        // Include notes and payment method
        const payload = {
            payment_method: paymentMethod,
            notes: notes.trim(),
            address_id: addressId  // send address_id in body
        };

        const response = await axiosInstance.post(`/orders/create`, payload);

        if (response.data.success) {
            toast.success("Order created successfully!");
            navigate("/user"); // Redirect after order creation
        } else {
            toast.error(response.data.message || "Failed to create order");
        }
    } catch (error) {
        console.error("Create order error:", error);

        if (error.response?.data?.errors) {
            error.response.data.errors.forEach(err => toast.error(err.message));
        } else {
            toast.error(error.response?.data?.message || "Failed to create order. Please try again.");
        }
    } finally {
        setLoading(false);
    }
};

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: "#0b0d17", minHeight: "100vh" }}>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0" style={{ color: "#fff" }}>Order Summary</h2>
                        <button
                            className="btn btn-outline-light"
                            onClick={() => navigate("/cart")}
                        >
                            Back
                        </button>
                    </div>

                    <div className="row g-4">
                        {/* Left Column - Order Items */}
                        <div className="col-lg-7">
                            <div className="card border-secondary shadow-sm" style={{ backgroundColor: "#141722", color: "#fff" }}>
                                <div className="card-header bg-transparent border-secondary">
                                    <h5 className="mb-0">Order Items ({summary.total_items} items)</h5>
                                </div>
                                <div className="card-body p-0">
                                    {items.map((item, index) => (
                                        <div
                                            key={item.product_id}
                                            className={`p-3 ${index !== items.length - 1 ? "border-bottom" : ""}`}
                                            style={{ borderColor: "#1c1f2b" }}
                                        >
                                            <div className="row align-items-center">
                                                <div className="col-3 col-md-2">
                                                    <img
                                                        src={item.product_image || "/placeholder.png"}
                                                        alt={item.product_name}
                                                        className="img-fluid rounded"
                                                        style={{
                                                            maxHeight: "80px",
                                                            objectFit: "contain",
                                                            background: "#0b0d17",
                                                            padding: "4px"
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-6 col-md-7">
                                                    <h6 className="mb-1">{item.product_name}</h6>
                                                    <small className="text-secondary">
                                                        Quantity: {item.quantity}
                                                    </small>
                                                </div>
                                                <div className="col-3 col-md-3 text-end">
                                                    <strong>{money(item.total_price)}</strong>
                                                    <br />
                                                    <small className="text-secondary">
                                                        {money(item.unit_price)} each
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Notes */}
                            <div className="card border-secondary shadow-sm mt-3" style={{ backgroundColor: "#141722", color: "#fff" }}>
                                <div className="card-header bg-transparent border-secondary">
                                    <h5 className="mb-0">Order Notes (Optional)</h5>
                                </div>
                                <div className="card-body">
                                    <textarea
                                        className="form-control bg-dark text-light border-secondary"
                                        rows="3"
                                        placeholder="Any special instructions for delivery? (e.g., gate code, call before arrival, etc.)"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="col-lg-5">
                            {/* Delivery Information */}
                            <div className="card border-secondary shadow-sm mb-3" style={{ backgroundColor: "#141722", color: "#fff" }}>
                                <div className="card-header bg-transparent border-secondary">
                                    <h5 className="mb-0">Delivery Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <small className="text-secondary">Estimated Delivery Time</small>
                                        <p className="mb-0 fw-bold text-warning">
                                            {formatDate(estimated_delivery)}
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-secondary">Distance & Duration</small>
                                        <p className="mb-0">
                                            <span className="fw-bold">{distance.totalDistanceKm.toFixed(2)} km</span>
                                            <span className="mx-2">•</span>
                                            <span>{distance.totalDurationText}</span>
                                        </p>
                                    </div>

                                    <div>
                                        <small className="text-secondary">Warehouse</small>
                                        <p className="mb-0">{warehouse.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="card border-secondary shadow-sm mb-3" style={{ backgroundColor: "#141722", color: "#fff" }}>
                                <div className="card-header bg-transparent border-secondary">
                                    <h5 className="mb-0">Price Breakdown</h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Subtotal</span>
                                        <span>{money(finance.subtotal)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Service Charge (10%)</span>
                                        <span>{money(finance.service_charge)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Tax Amount</span>
                                        <span>{money(finance.tax_amount)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Delivery Fee</span>
                                        <span>{money(finance.delivery_fee)}</span>
                                    </div>
                                    <hr style={{ borderColor: "#1c1f2b" }} />
                                    <div className="d-flex justify-content-between mb-0">
                                        <strong>Total Amount</strong>
                                        <strong className="text-warning">{money(finance.total_amount)}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="card border-secondary shadow-sm mb-3" style={{ backgroundColor: "#141722", color: "#fff" }}>
                                <div className="card-header bg-transparent border-secondary">
                                    <h5 className="mb-0">Payment Method</h5>
                                </div>
                                <div className="card-body">
                                    <div className="form-check mb-2">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="cash_on_delivery"
                                            name="payment_method"
                                            value="cash_on_delivery"
                                            checked={paymentMethod === "cash_on_delivery"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            disabled={loading}
                                        />
                                        <label className="form-check-label" htmlFor="cash_on_delivery">
                                            <div className="d-flex align-items-center">
                                                <span className="me-2">💰</span>
                                                <div>
                                                    <strong>Cash on Delivery</strong>
                                                    <br />
                                                    <small className="text-secondary">
                                                        Pay with cash when your order arrives
                                                    </small>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* 
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="card_payment"
                                            name="payment_method"
                                            value="card_payment"
                                            checked={paymentMethod === "card_payment"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            disabled={true}
                                        />
                                        <label className="form-check-label" htmlFor="card_payment">
                                            <div className="d-flex align-items-center">
                                                <span className="me-2">💳</span>
                                                <div>
                                                    <strong>Card Payment</strong>
                                                    <br />
                                                    <small className="text-secondary text-muted">
                                                        Coming soon
                                                    </small>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                        */}
                                </div>
                            </div>

                            {/* Create Order Button */}
                            <button
                                className="btn btn-warning w-100 py-2"
                                onClick={handleCreateOrder}
                                disabled={loading}
                                style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Creating Order...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </button>

                            <p className="text-secondary text-center mt-3 small">
                                By placing your order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}