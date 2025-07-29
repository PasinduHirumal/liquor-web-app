import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card, Container, Row, Col, Badge, Image } from "react-bootstrap";
import "../../../styles/OrderDetail.css";

function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        return <Badge bg={variant} className="text-capitalize">{value}</Badge>;
    };

    return (
        <Container className="order-detail-container py-4">
            <h1 className="mb-4">
                Order Details <small className="text-muted">#{order.order_number || order.order_id}</small>
            </h1>

            <Row className="g-4">
                {/* Order Summary */}
                <Col xs={12} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Order Summary</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12} className="mb-3">
                                    <p className="mb-2">
                                        <strong>Order Date:</strong>
                                        <br />
                                        <span className="text-muted">{formatDate(order.order_date)}</span>
                                    </p>
                                    <p className="mb-2">
                                        <strong>Status:</strong>
                                        {renderBadge(order.status)}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Payment Method:</strong>
                                        <br />
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
                    <Card className="h-100">
                        <Card.Header className="bg-primary text-white">Price Details</Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between"><span>Subtotal:</span><span>${order.subtotal?.toFixed(2)}</span></div>
                            <div className="d-flex justify-content-between"><span>Delivery Fee:</span><span>${order.delivery_fee?.toFixed(2)}</span></div>
                            <div className="d-flex justify-content-between"><span>Tax Amount:</span><span>${order.tax_amount?.toFixed(2)}</span></div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold"><span>Total:</span><span>${order.total_amount?.toFixed(2)}</span></div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Items */}
                <Col md={12}>
                    <Card>
                        <Card.Header className="bg-primary text-white">Order Items</Card.Header>
                        <Card.Body>
                            {order.items?.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table">
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

                {/* Delivery Information */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-primary text-white">Delivery Information</Card.Header>
                        <Card.Body>
                            <p><strong>Address:</strong></p>
                            <p>{order.delivery_address_id?.streetAddress || order.delivery_address_id?.savedAddress || "N/A"}</p>
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

                {/* Customer Info */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-primary text-white">Customer Information</Card.Header>
                        <Card.Body>
                            <p><strong>Name:</strong> {order.user_id?.username || "N/A"}</p>
                            <p><strong>Email:</strong> {order.user_id?.email || "N/A"}</p>
                            <p><strong>User ID:</strong> {order.user_id?.id || "N/A"}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Driver Info */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-primary text-white">Driver Information</Card.Header>
                        <Card.Body>
                            <p><strong>Name:</strong> {order.assigned_driver_id?.username || "N/A"}</p>
                            <p><strong>Email:</strong> {order.assigned_driver_id?.email || "N/A"}</p>
                            <p><strong>Driver ID:</strong> {order.assigned_driver_id?.id || "N/A"}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Notes + Timestamps */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-primary text-white">Additional Info</Card.Header>
                        <Card.Body>
                            <p><strong>Notes:</strong> {order.notes || "No notes available"}</p>
                            <p><strong>Created At:</strong> {formatDate(order.created_at)}</p>
                            <p><strong>Updated At:</strong> {formatDate(order.updated_at)}</p>
                            <p><strong>Driver Accepted:</strong> {order.is_driver_accepted ? "Yes" : "No"}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default OrderDetail;