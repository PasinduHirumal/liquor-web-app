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
            <h2>Order Detail - #{order.order_id}</h2>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> {order.total_amount}</p>
            <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>

            {order.user && (
                <div>
                    <h4>User Info:</h4>
                    <p><strong>Name:</strong> {order.user.name}</p>
                    <p><strong>Email:</strong> {order.user.email}</p>
                </div>
            )}

            {order.driver && (
                <div>
                    <h4>Assigned Driver:</h4>
                    <p><strong>Name:</strong> {order.driver.name}</p>
                    <p><strong>Phone:</strong> {order.driver.phone}</p>
                </div>
            )}

            {order.address && (
                <div>
                    <h4>Delivery Address:</h4>
                    <p>{order.address.street}, {order.address.city}, {order.address.zip}</p>
                </div>
            )}
        </div>
    );
}

export default OrderDetail;
