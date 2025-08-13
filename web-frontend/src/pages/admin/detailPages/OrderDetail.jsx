import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card, Container, Row, Col, Badge, Image, Table, Alert } from "react-bootstrap";
import "../../../styles/OrderDetail.css";
import AssignDriverModal from "../../../components/admin/forms/AssignDriverModal";
import EditStatusModal from "../../../components/admin/forms/EditStatusModal";

function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [driverDuties, setDriverDuties] = useState([]);
    const [dutiesError, setDutiesError] = useState("");

    const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
    const [showEditStatusModal, setShowEditStatusModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderRes, dutiesRes] = await Promise.all([
                    axiosInstance.get(`/orders/getOrderById/${id}`),
                    axiosInstance.get(`/driverDuties/getAllForOrder/${id}`)
                ]);

                const orderData = Array.isArray(orderRes.data.data) ? orderRes.data.data[0] : orderRes.data.data;
                setOrder(orderData);

                setDriverDuties(dutiesRes.data?.data || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err?.response?.data?.message || "Failed to fetch order");
                setDutiesError("Failed to fetch driver duties");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const formatDate = (value) => {
        if (!value) return "N/A";

        // Handle Firebase Timestamp
        if (value._seconds) {
            return new Date(value._seconds * 1000).toLocaleString();
        }

        // Handle Firestore Timestamp with toDate()
        if (value.toDate) {
            return value.toDate().toLocaleString();
        }

        // Handle ISO strings or JS Date-compatible strings
        try {
            return new Date(value).toLocaleString();
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            return "Invalid date";
        }
    };

    const renderBadge = (value) => {
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
            refunded: "info",
        };
        variant = map[val] || "secondary";
        return (
            <span className="order-detail-badge ms-2">
                <Badge bg={variant} className="text-capitalize">{value}</Badge>
            </span>
        );
    };

    if (loading) {
        return (
            <div
                className="px-4 py-4"
                style={{
                    backgroundColor: "#fff",
                    minHeight: "100vh"
                }}
            >
                <Skeleton count={10} />
            </div>
        );
    }

    if (error) return <Alert variant="danger">Error: {error}</Alert>;
    if (!order) return <Alert variant="warning">No order found.</Alert>;

    return (
        <div className="order-detail-container px-4 py-4 bg-white">
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
                <Col xs={12} md={6}>
                    <Card className="order-detail-card h-100">
                        <Card.Header as="h5">Order Summary</Card.Header>
                        <Card.Body className="order-detail-section">
                            <p><strong>Order Date:</strong> <span className="text-muted">{formatDate(order.order_date)}</span></p>
                            <p><strong>Status:</strong> {renderBadge(order.status)}</p>
                            <p><strong>Payment Method:</strong> <span className="text-muted">{order.payment_method || "N/A"}</span></p>
                            <p><strong>Payment Status:</strong> {renderBadge(order.payment_status)}</p>
                            <p><strong>Driver Accepted:</strong> {order.is_driver_accepted ? "Yes" : "No"}</p>
                            <p><strong>Driver Accepted:</strong> {order.where_house_id?.name || "N/A"}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Price Details */}
                <Col xs={12} md={6}>
                    <Card className="order-detail-card h-100">
                        <Card.Header as="h5">Price Details</Card.Header>
                        <Card.Body className="order-detail-section">
                            <div className="order-detail-price-line"><span>Subtotal:</span><span>Rs: {order.subtotal?.toFixed(2)}</span></div>
                            <div className="order-detail-price-line"><span>Delivery Fee:</span><span>Rs: {order.delivery_fee?.toFixed(2)}</span></div>
                            <div className="order-detail-price-line"><span>Tax Amount:</span><span>Rs: {order.tax_amount?.toFixed(2)}</span></div>
                            <hr />
                            <div className="order-detail-price-line fw-bold"><span>Total:</span><span>Rs: {order.total_amount?.toFixed(2)}</span></div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Driver Duties Section */}
                <Col md={12}>
                    <Card className="order-detail-card">
                        <Card.Header>Driver Duties</Card.Header>
                        <Card.Body>
                            {dutiesError ? (
                                <Alert variant="danger">{dutiesError}</Alert>
                            ) : driverDuties.length === 0 ? (
                                <p>No driver duties found for this order.</p>
                            ) : (
                                <Table bordered responsive>
                                    <thead>
                                        <tr>
                                            <th>Driver</th>
                                            <th>Driver Email</th>
                                            <th>Accepted</th>
                                            <th>Completed</th>
                                            <th>Reassigned</th>
                                            <th>Created</th>
                                            <th>Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {driverDuties.map((duty, idx) => (
                                            <tr key={idx}>
                                                <td>{duty.driver_id?.username || "Unknown"}</td>
                                                <td>{duty.driver_id?.email || "Unknown"}</td>
                                                <td>{duty.is_driver_accepted ? "Yes" : "No"}</td>
                                                <td>{duty.is_completed ? "Yes" : "No"}</td>
                                                <td>{duty.is_re_assigning_driver ? "Yes" : "No"}</td>
                                                <td>{formatDate(duty.created_at)}</td>
                                                <td>{formatDate(duty.updated_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Order Items */}
                <Col md={12}>
                    <Card className="order-detail-card">
                        <Card.Header>Order Items</Card.Header>
                        <Card.Body>
                            {order.items?.length > 0 ? (
                                <div className="table-responsive">
                                    <Table striped bordered>
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
                                                    <td><Image src={item.product_image} width="50" rounded /></td>
                                                    <td>{item.quantity}</td>
                                                    <td>Rs: {item.unit_price?.toFixed(2)}</td>
                                                    <td>Rs: {item.total_price?.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            ) : <p>No items found.</p>}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Customer Info */}
                <Col xs={12} md={6}>
                    <Card className="order-detail-card h-100">
                        <Card.Header>Customer Information</Card.Header>
                        <Card.Body>
                            <p><strong>Name:</strong> {order.user_id?.username || "N/A"}</p>
                            <p><strong>Email:</strong> {order.user_id?.email || "N/A"}</p>
                            <p><strong>User ID:</strong> {order.user_id?.id || "N/A"}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Driver Info */}
                <Col xs={12} md={6}>
                    <Card className="order-detail-card h-100">
                        <Card.Header>Driver Information</Card.Header>
                        <Card.Body>
                            <p><strong>Name:</strong> {order.assigned_driver_id?.username || "N/A"}</p>
                            <p><strong>Email:</strong> {order.assigned_driver_id?.email || "N/A"}</p>
                            <p><strong>Driver ID:</strong> {order.assigned_driver_id?.id || "N/A"}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Delivery Info */}
                <Col xs={12} md={6}>
                    <Card className="order-detail-card h-100">
                        <Card.Header>Delivery Information</Card.Header>
                        <Card.Body>
                            <p><strong>Address:</strong></p>
                            <p className="order-detail-address">{order.delivery_address_id?.streetAddress || order.delivery_address_id?.savedAddress || "N/A"}</p>
                            <p><strong>Distance:</strong> {order.distance?.toFixed(2)} km</p>
                            <p><strong>Estimated:</strong> {formatDate(order.estimated_delivery)}</p>
                            <p><strong>Delivered At:</strong> {formatDate(order.delivered_at)}</p>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Notes & Timestamps */}
                <Col xs={12} md={6}>
                    <Card className="order-detail-card h-100">
                        <Card.Header>Additional Info</Card.Header>
                        <Card.Body>
                            <p className="order-detail-notes"><strong>Notes:</strong> {order.notes || "No notes available"}</p>
                            <p><strong>Created At:</strong> {formatDate(order.created_at)}</p>
                            <p><strong>Updated At:</strong> {formatDate(order.updated_at)}</p>
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
        </div>
    );
}

export default OrderDetail;
