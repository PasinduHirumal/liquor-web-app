import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card, Container, Row, Col, Badge, Image } from "react-bootstrap";
import "../../../styles/OrderDetail.css";
import AssignDriverModal from "../../../components/admin/forms/AssignDriverModal";
import EditStatusModal from "../../../components/admin/forms/EditStatusModal";

function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
    const [showEditStatusModal, setShowEditStatusModal] = useState(false);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const res = await axiosInstance.get(`/orders/getOrderById/${id}`);
                const data = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
                setOrder(data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError(err.response?.data?.message || "Failed to fetch order");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id]);

    const formatDate = (timestamp) => {
        if (!timestamp || !timestamp._seconds) return "N/A";
        return new Date(timestamp._seconds * 1000).toLocaleString();
    };

    if (loading) return <Skeleton count={8} />;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!order) return <div className="alert alert-warning">No order found.</div>;

    const renderBadge = (value, type = "status") => {
        if (!value) return null;
        let variant = "secondary";
        const val = value.toLowerCase();
        const map = {
            delivered: "success",
            pending: "warning",
            cancelled: "danger",
            processing: "info",
            out_for_delivery: "primary",
            paid: "success",
            failed: "danger",
            refunded: "info"
        };
        variant = map[val] || "secondary";
        return (
            <span className="order-detail-badge ms-2">
                <Badge bg={variant} className="text-capitalize">{value}</Badge>
            </span>
        );
    };

    return (
        <Container className="order-detail-container py-4">
            <Row className="justify-content-between align-items-center mb-4">
                <Col>
                    <h1>
                        Order Details <small className="text-muted">#{order.order_number || order.order_id}</small>
                    </h1>
                </Col>
                <Col className="text-end">
                    <button className="btn btn-outline-primary me-2" onClick={() => setShowAssignDriverModal(true)}>
                        Assign Driver
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => setShowEditStatusModal(true)}>
                        Edit Status
                    </button>
                </Col>
            </Row>


            <Row className="g-4">
                {/* Order Summary */}
                <Col xs={12} md={6} className="mb-4">
                    <Card className="order-detail-card h-100">
                        <Card.Header>Order Summary</Card.Header>
                        <Card.Body className="order-detail-section">
                            <Row>
                                <Col xs={12} className="mb-3">
                                    <p className="mb-2">
                                        <strong>Order Date:</strong><br />
                                        <span className="text-muted">{formatDate(order.order_date)}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Status:</strong>
                                        {renderBadge(order.status)}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Payment Method:</strong><br />
                                        <span className="text-muted">{order.payment_method || "N/A"}</span>
                                    </p>
                                    <p className="mb-0">
                                        <strong>Payment Status:</strong>
                                        {renderBadge(order.payment_status, "payment")}
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Price Details */}
                <Col md={6}>
                    <Card className="order-detail-card h-100">
                        <Card.Header>Price Details</Card.Header>
                        <Card.Body className="order-detail-section">
                            <div className="order-detail-price-line">
                                <span>Subtotal:</span><span>${order.subtotal?.toFixed(2)}</span>
                            </div>
                            <div className="order-detail-price-line">
                                <span>Delivery Fee:</span><span>${order.delivery_fee?.toFixed(2)}</span>
                            </div>
                            <div className="order-detail-price-line">
                                <span>Tax Amount:</span><span>${order.tax_amount?.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="order-detail-price-line fw-bold">
                                <span>Total:</span><span>${order.total_amount?.toFixed(2)}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Items */}
                <Col md={12}>
                    <Card className="order-detail-card">
                        <Card.Header>Order Items</Card.Header>
                        <Card.Body className="order-detail-section">
                            {order.items?.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table order-detail-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Image</th>
                                                <th>Qty</th>
                                                <th>Unit Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item, i) => (
                                                <tr key={i}>
                                                    <td>{item.product_name}</td>
                                                    <td>
                                                        <Image src={item.product_image} width="50" rounded />
                                                    </td>
                                                    <td>{item.quantity}</td>
                                                    <td>${item.unit_price?.toFixed(2)}</td>
                                                    <td>${item.total_price?.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p>No items found.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Customer Info */}
                <Col md={6}>
                    <Card className="order-detail-card">
                        <Card.Header>Customer Information</Card.Header>
                        <Card.Body className="order-detail-section">
                            <p><strong>Name:</strong> {order.user_id?.username || "N/A"}</p>
                            <p><strong>Email:</strong> {order.user_id?.email || "N/A"}</p>
                            <p><strong>User ID:</strong> {order.user_id?.id || "N/A"}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Driver Info */}
                <Col md={6}>
                    <Card className="order-detail-card">
                        <Card.Header>Driver Information</Card.Header>
                        <Card.Body className="order-detail-section">
                            <p><strong>Name:</strong> {order.assigned_driver_id?.username || "N/A"}</p>
                            <p><strong>Email:</strong> {order.assigned_driver_id?.email || "N/A"}</p>
                            <p><strong>Driver ID:</strong> {order.assigned_driver_id?.id || "N/A"}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Delivery Information */}
                <Col md={6}>
                    <Card className="order-detail-card">
                        <Card.Header>Delivery Information</Card.Header>
                        <Card.Body className="order-detail-section">
                            <p><strong>Address:</strong></p>
                            <p className="order-detail-address">
                                {order.delivery_address_id?.streetAddress || order.delivery_address_id?.savedAddress || "N/A"}
                            </p>
                            <Row>
                                <Col sm={6}>
                                    <p><strong>Distance:</strong> {order.distance?.toFixed(2)} km</p>
                                    <p><strong>Estimated:</strong> {formatDate(order.estimated_delivery)}</p>
                                </Col>
                                <Col sm={6}>
                                    <p><strong>Delivered At:</strong> {formatDate(order.delivered_at)}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Notes + Timestamps */}
                <Col md={6}>
                    <Card className="order-detail-card">
                        <Card.Header>Additional Info</Card.Header>
                        <Card.Body className="order-detail-section">
                            <p><strong>Notes:</strong></p>
                            <p className="order-detail-notes">{order.notes || "No notes available"}</p>
                            <p><strong>Created At:</strong> {formatDate(order.created_at)}</p>
                            <p><strong>Updated At:</strong> {formatDate(order.updated_at)}</p>
                            <p><strong>Driver Accepted:</strong> {order.is_driver_accepted ? "Yes" : "No"}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <AssignDriverModal
                show={showAssignDriverModal}
                handleClose={() => setShowAssignDriverModal(false)}
                orderId={order.order_id}
            />

            <EditStatusModal
                show={showEditStatusModal}
                handleClose={() => setShowEditStatusModal(false)}
                orderId={order.order_id}
            />

        </Container>
    );
}

export default OrderDetail;
