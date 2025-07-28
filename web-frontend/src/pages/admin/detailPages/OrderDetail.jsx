import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
    if (error) return <div className="text-danger">Error: {error}</div>;
    if (!order) return <div>No order found.</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>Order Detail - {order.order_id || order._id}</h1>

            <h3>Order Detail</h3>
            <p><strong>Order Number:</strong> {order.order_number || "N/A"}</p>
            <p><strong>Order Date:</strong> {order.order_date ? new Date(order.order_date).toLocaleString() : "N/A"}</p>

            <p><strong>User ID:</strong> {order.user?.id || order.user?._id || "N/A"}</p>

            <p><strong>Items:</strong></p>
            {order.items && order.items.length > 0 ? (
                <ul>
                    {order.items.map((item, idx) => (
                        <li key={idx}>
                            {item.product_name || item.name || "Unnamed Item"} - Quantity: {item.quantity || item.qty || 1}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items found</p>
            )}

            <h3>Delivery Detail</h3>
            <p><strong>Delivery Address Id:</strong> {order.delivery_address?.id || order.delivery_address?._id || "N/A"}</p>
            <p><strong>Delivery Address:</strong> {order.delivery_address?.full_address || order.delivery_address?.address || "N/A"}</p>
            <p><strong>Distance:</strong> {order.distance || "N/A"}</p>
            <p><strong>Estimated Delivery:</strong> {order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleString() : "N/A"}</p>
            <p><strong>Delivered At:</strong> {order.delivered_at ? new Date(order.delivered_at).toLocaleString() : "N/A"}</p>

            <h3>Price Details</h3>
            <p><strong>Delivery Fee:</strong> {order.delivery_fee != null ? order.delivery_fee : "N/A"}</p>
            <p><strong>Subtotal:</strong> {order.subtotal != null ? order.subtotal : "N/A"}</p>
            <p><strong>TAX Amount:</strong> {order.tax_amount != null ? order.tax_amount : "N/A"}</p>
            <p><strong>Total:</strong> {order.total_amount != null ? order.total_amount : "N/A"}</p>

            <h3>Payment Type</h3>
            <p><strong>Payment Method:</strong> {order.payment_method || "N/A"}</p>
            <p><strong>Payment Status:</strong> {order.payment_status || "N/A"}</p>

            <h3>Status</h3>
            <p><strong>Note:</strong> {order.note || "N/A"}</p>
            <p><strong>Status:</strong> {order.status || "N/A"}</p>
            <p><strong>Assigned Driver ID:</strong> {order.assigned_driver_id || order.assigned_driver?._id || "N/A"}</p>

            <p><strong>Created At:</strong> {order.created_at ? new Date(order.created_at).toLocaleString() : order.order_date ? new Date(order.order_date).toLocaleString() : "N/A"}</p>

            {order.user && (
                <div>
                    <h4>User Info:</h4>
                    <p><strong>Name:</strong> {order.user.name || order.user.full_name || "N/A"}</p>
                    <p><strong>Email:</strong> {order.user.email || "N/A"}</p>
                    {order.user.phone && <p><strong>Phone:</strong> {order.user.phone}</p>}
                </div>
            )}

            {order.assigned_driver && (
                <div>
                    <h4>Assigned Driver Info:</h4>
                    <p><strong>Name:</strong> {order.assigned_driver.name || "N/A"}</p>
                    <p><strong>Email:</strong> {order.assigned_driver.email || "N/A"}</p>
                    <p><strong>Phone:</strong> {order.assigned_driver.phone || "N/A"}</p>
                </div>
            )}
        </div>
    );
}

export default OrderDetail;
