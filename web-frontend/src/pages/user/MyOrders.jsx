import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const money = (value) => `Rs: ${Number(value || 0).toFixed(2)}`;

export default function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/orders/my");

            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
            toast.error(error.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: "warning", text: "Pending" },
            processing: { color: "info", text: "Processing" },
            out_for_delivery: { color: "primary", text: "Out for Delivery" },
            delivered: { color: "success", text: "Delivered" },
            cancelled: { color: "danger", text: "Cancelled" }
        };

        const config = statusConfig[status] || { color: "secondary", text: status };

        return (
            <span className={`badge bg-${config.color} px-3 py-2`}>
                {config.text}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: "warning", text: "Pending" },
            paid: { color: "success", text: "Paid" },
            failed: { color: "danger", text: "Failed" },
            refunded: { color: "info", text: "Refunded" }
        };

        const config = statusConfig[status] || { color: "secondary", text: status };

        return (
            <span className={`badge bg-${config.color} px-3 py-2`}>
                {config.text}
            </span>
        );
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-secondary">Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container py-5">
                <div className="text-center py-5">
                    <div className="mb-4">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H21V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V6Z" stroke="#6c757d" strokeWidth="1.5" fill="none" />
                            <path d="M8 6V4C8 2.9 8.9 2 10 2H14C15.1 2 16 2.9 16 4V6" stroke="#6c757d" strokeWidth="1.5" fill="none" />
                            <path d="M12 12V16" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="12" cy="18" r="1" fill="#6c757d" />
                        </svg>
                    </div>
                    <h3 className="mb-3">No Orders Yet</h3>
                    <p className="text-muted mb-4">You haven't placed any orders yet. Start shopping now!</p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => navigate("/products")}
                    >
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4" style={{ minHeight: "100vh" }}>
            <div className="container">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="display-5 mb-0">My Orders</h1>
                        <p className="text-muted mt-2">Track and manage your orders</p>
                    </div>
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate("/products")}
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Orders List */}
                <div className="row">
                    <div className="col-12">
                        {orders.map((order, index) => (
                            <div key={order.order_id} className="card mb-4 shadow-sm border-0">
                                <div className="card-header bg-white py-3">
                                    <div className="row align-items-center">
                                        <div className="col-md-3">
                                            <small className="text-muted">Order Number</small>
                                            <h6 className="mb-0 fw-bold">{order.order_number}</h6>
                                        </div>
                                        <div className="col-md-3">
                                            <small className="text-muted">Order Date</small>
                                            <p className="mb-0">{formatDate(order.order_date)}</p>
                                        </div>
                                        <div className="col-md-3">
                                            <small className="text-muted">Total Amount</small>
                                            <h6 className="mb-0 text-primary fw-bold">{money(order.total_amount)}</h6>
                                        </div>
                                        <div className="col-md-3 text-md-end">
                                            <div className="mb-2">
                                                {getStatusBadge(order.status)}
                                                {' '}
                                                {getPaymentStatusBadge(order.payment_status)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    {/* Items Preview */}
                                    <div className="mb-3">
                                        <small className="text-muted">Items ({order.items.length})</small>
                                        <div className="row mt-2">
                                            {order.items.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="col-md-4 mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={item.product_image || "/placeholder.png"}
                                                            alt={item.product_name}
                                                            className="rounded me-2"
                                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                        />
                                                        <div className="flex-grow-1">
                                                            <p className="mb-0 small fw-bold">{item.product_name}</p>
                                                            <small className="text-muted">
                                                                Qty: {item.quantity} × {money(item.unit_price)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="col-md-4">
                                                    <p className="text-muted small mb-0">
                                                        +{order.items.length - 3} more items
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delivery Info */}
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <small className="text-muted">Delivery Address</small>
                                            <p className="mb-0 small">
                                                {order.delivery_address_id?.streetAddress || "Address not available"}
                                                <br />
                                                {order.delivery_address_id?.savedAddress}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <small className="text-muted">Estimated Delivery</small>
                                            <p className="mb-0 small">
                                                {order.estimated_delivery ? formatDate(order.estimated_delivery) : "Not scheduled yet"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => viewOrderDetails(order)}
                                        >
                                            View Details
                                        </button>
                                        {/*
                                        {order.status === "pending" && (
                                            <button className="btn btn-outline-danger btn-sm">
                                                Cancel Order
                                            </button>
                                        )}
                                        {order.status === "delivered" && (
                                            <button className="btn btn-outline-success btn-sm">
                                                Write Review
                                            </button>
                                        )}
                                        */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
                <div
                    className="modal fade show d-block py-5"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    onClick={closeModal}
                >
                    <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Order Details - {selectedOrder.order_number}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {/* Order Status */}
                                <div className="mb-4">
                                    <h6>Order Status</h6>
                                    <div className="d-flex gap-2">
                                        {getStatusBadge(selectedOrder.status)}
                                        {getPaymentStatusBadge(selectedOrder.payment_status)}
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="mb-4">
                                    <h6>Items</h6>
                                    <div className="table-responsive">
                                        <table className="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Quantity</th>
                                                    <th>Unit Price</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedOrder.items.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    src={item.product_image || "/placeholder.png"}
                                                                    alt={item.product_name}
                                                                    className="rounded me-2"
                                                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                                />
                                                                <div>
                                                                    <p className="mb-0 fw-bold">{item.product_name}</p>
                                                                    <small className="text-muted">ID: {item.product_id}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{item.quantity}</td>
                                                        <td>{money(item.unit_price)}</td>
                                                        <td>{money(item.total_price)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="mb-4">
                                    <h6>Price Breakdown</h6>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <table className="table table-sm table-borderless">
                                                <tbody>
                                                    <tr>
                                                        <td>Subtotal:</td>
                                                        <td className="text-end">{money(selectedOrder.subtotal)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Service Charge (10%):</td>
                                                        <td className="text-end">{money(selectedOrder.service_charge)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tax Amount:</td>
                                                        <td className="text-end">{money(selectedOrder.tax_amount)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Delivery Fee:</td>
                                                        <td className="text-end">{money(selectedOrder.delivery_fee)}</td>
                                                    </tr>
                                                    <tr className="fw-bold">
                                                        <td>Total Amount:</td>
                                                        <td className="text-end text-primary">{money(selectedOrder.total_amount)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card bg-light">
                                                <div className="card-body">
                                                    <h6 className="mb-3">Delivery Information</h6>
                                                    <p className="mb-1 small">
                                                        <strong>Address:</strong> {selectedOrder.delivery_address_id?.streetAddress}
                                                    </p>
                                                    <p className="mb-1 small">
                                                        <strong>Distance:</strong> {selectedOrder.distance} km
                                                    </p>
                                                    <p className="mb-1 small">
                                                        <strong>Estimated Delivery:</strong> {selectedOrder.estimated_delivery ? formatDate(selectedOrder.estimated_delivery) : "N/A"}
                                                    </p>
                                                    {selectedOrder.notes && (
                                                        <p className="mb-0 small">
                                                            <strong>Notes:</strong> {selectedOrder.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Warehouse Info */}
                                <div>
                                    <h6>Warehouse</h6>
                                    <p className="mb-0 small">
                                        {selectedOrder.warehouse_id?.name} ({selectedOrder.warehouse_id?.code})
                                    </p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Close
                                </button>
                                {/*
                                {selectedOrder.status === "pending" && (
                                    <button type="button" className="btn btn-danger">
                                        Cancel Order
                                    </button>
                                )}
                                {selectedOrder.status === "delivered" && (
                                    <button type="button" className="btn btn-primary">
                                        Write a Review
                                    </button>
                                )}
                                */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}