import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card, Container, Row, Col, Badge } from "react-bootstrap";
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
                setOrder(res.data.data);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError(err.response?.data?.message || "Failed to fetch order");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id]);

    if (loading) return <Skeleton count={8} />;
    if (error) return <div className="alert alert-danger">Error: {error}</div>;
    if (!order) return <div className="alert alert-warning">No order found.</div>;

    const renderStatusBadge = () => {
        if (!order.status) return null;
        
        let variant = "secondary";
        switch (order.status.toLowerCase()) {
            case "completed":
                variant = "success";
                break;
            case "pending":
                variant = "warning";
                break;
            case "cancelled":
                variant = "danger";
                break;
            case "processing":
                variant = "info";
                break;
            case "shipped":
                variant = "primary";
                break;
        }
        
        return <Badge bg={variant} className="text-capitalize">{order.status}</Badge>;
    };

    const renderPaymentStatusBadge = () => {
        if (!order.payment_status) return null;
        
        let variant = "secondary";
        switch (order.payment_status.toLowerCase()) {
            case "paid":
                variant = "success";
                break;
            case "pending":
                variant = "warning";
                break;
            case "failed":
                variant = "danger";
                break;
            case "refunded":
                variant = "info";
                break;
        }
        
        return <Badge bg={variant} className="text-capitalize">{order.payment_status}</Badge>;
    };

    return (
        <Container className="order-detail-container py-4">
            <h1 className="mb-4">
                Order Details <small className="text-muted">#{order.order_number || order.order_id || order._id}</small>
            </h1>
            
            <Row className="g-4">
                {/* Order Summary Card */}
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Header className="bg-primary text-white">
                            <Card.Title>Order Summary</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col sm={6}>
                                    <p><strong>Order Date:</strong></p>
                                    <p><strong>Status:</strong></p>
                                    <p><strong>Payment Method:</strong></p>
                                    <p><strong>Payment Status:</strong></p>
                                </Col>
                                <Col sm={6}>
                                    <p>{order.order_date ? new Date(order.order_date).toLocaleString() : "N/A"}</p>
                                    <p>{renderStatusBadge()}</p>
                                    <p>{order.payment_method || "N/A"}</p>
                                    <p>{renderPaymentStatusBadge()}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Price Details Card */}
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Header className="bg-primary text-white">
                            <Card.Title>Price Details</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="price-details">
                                <div className="d-flex justify-content-between">
                                    <span>Subtotal:</span>
                                    <span>{order.subtotal != null ? `$${order.subtotal.toFixed(2)}` : "N/A"}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Delivery Fee:</span>
                                    <span>{order.delivery_fee != null ? `$${order.delivery_fee.toFixed(2)}` : "N/A"}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Tax Amount:</span>
                                    <span>{order.tax_amount != null ? `$${order.tax_amount.toFixed(2)}` : "N/A"}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Total:</span>
                                    <span>{order.total_amount != null ? `$${order.total_amount.toFixed(2)}` : "N/A"}</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Order Items Card */}
                <Col md={12}>
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <Card.Title>Order Items</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {order.items && order.items.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>{item.product_name || item.name || "Unnamed Item"}</td>
                                                    <td>{item.quantity || item.qty || 1}</td>
                                                    <td>{item.price ? `$${item.price.toFixed(2)}` : "N/A"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-muted">No items found</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Delivery Information Card */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <Card.Title>Delivery Information</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Delivery Address:</strong></p>
                            <p className="mb-3">{order.delivery_address?.full_address || order.delivery_address?.address || "N/A"}</p>
                            
                            <Row>
                                <Col sm={6}>
                                    <p><strong>Distance:</strong></p>
                                    <p><strong>Estimated Delivery:</strong></p>
                                    <p><strong>Delivered At:</strong></p>
                                </Col>
                                <Col sm={6}>
                                    <p>{order.distance ? `${order.distance} km` : "N/A"}</p>
                                    <p>{order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleString() : "N/A"}</p>
                                    <p>{order.delivered_at ? new Date(order.delivered_at).toLocaleString() : "Not delivered yet"}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Customer Information Card */}
                <Col md={6}>
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <Card.Title>Customer Information</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {order.user ? (
                                <>
                                    <p><strong>Name:</strong> {order.user.name || order.user.full_name || "N/A"}</p>
                                    <p><strong>Email:</strong> {order.user.email || "N/A"}</p>
                                    <p><strong>Phone:</strong> {order.user.phone || "N/A"}</p>
                                    <p><strong>Customer ID:</strong> {order.user.id || order.user._id || "N/A"}</p>
                                </>
                            ) : (
                                <p className="text-muted">No customer information available</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Driver Information Card */}
                {order.assigned_driver && (
                    <Col md={6}>
                        <Card>
                            <Card.Header className="bg-primary text-white">
                                <Card.Title>Driver Information</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <p><strong>Name:</strong> {order.assigned_driver.name || "N/A"}</p>
                                <p><strong>Email:</strong> {order.assigned_driver.email || "N/A"}</p>
                                <p><strong>Phone:</strong> {order.assigned_driver.phone || "N/A"}</p>
                                <p><strong>Driver ID:</strong> {order.assigned_driver.id || order.assigned_driver._id || "N/A"}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

                {/* Additional Information Card */}
                <Col md={order.assigned_driver ? 6 : 12}>
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <Card.Title>Additional Information</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Note:</strong></p>
                            <p className="mb-3">{order.note || "No notes available"}</p>
                            <p><strong>Created At:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : order.order_date ? new Date(order.order_date).toLocaleString() : "N/A"}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default OrderDetail;