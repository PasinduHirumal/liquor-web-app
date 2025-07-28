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
            <h1>Order Detail - {order.order_id}</h1>

            <h3>order Detail</h3>
            <p><strong>Order Number:</strong> {order.order_number}</p>
            <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
            <p><strong>User ID:</strong> </p>
            <p><strong>Items:</strong> </p>

            <h3>Delevery Detail</h3>
            <p><strong>Delivery Address Id:</strong> </p>
            <p><strong>Distance:</strong> {order.distance}</p>
            <p><strong>Estimated Delivery:</strong></p>
            <p><strong>Delivered At:</strong> {new Date(order.delivered_at).toLocaleString()}</p>

            <h3>Price Details</h3>
            <p><strong>Delivery Fee:</strong> {order.delivery_fee}</p>
            <p><strong>Subtotal:</strong> {order.subtotal}</p>
            <p><strong>TAX Amount:</strong> {order.tax_amount}</p>
            <p><strong>Total:</strong> {order.total_amount}</p>

            <h3>Payment Type</h3>
            <p><strong>Payment Method:</strong> {order.payment_method}</p>
            <p><strong>Payment Status:</strong> {order.payment_status}</p>

            <h3>Status</h3>
            <p><strong>Note:</strong></p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Assigned Driver ID:</strong> {order.assigned_driver_id}</p>

            <p><strong>Created At:</strong> {new Date(order.order_date).toLocaleString()}</p>

            {order.user && (
                <div>
                    <h4>User Info:</h4>
                    <p><strong>Name:</strong> {order.user.name}</p>
                    <p><strong>Email:</strong> {order.user.email}</p>
                </div>
            )}

        </div>
    );
}

export default OrderDetail;
