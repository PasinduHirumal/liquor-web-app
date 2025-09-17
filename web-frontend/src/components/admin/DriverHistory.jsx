import React, { useEffect, useState } from "react";
import { Table, Typography, Spin, Tag, Card } from "antd";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const { Title } = Typography;

const DriverHistory = ({ driverId }) => {
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!driverId) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/drivers/orders_history/${driverId}`);
                if (res.data.success) {
                    setOrders(res.data.data);
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message || "Failed to fetch driver history");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Server error");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [driverId]);

    const columns = [
        {
            title: "Order Number",
            dataIndex: "order_number",
            key: "order_number",
            width: 150,
            fixed: "left",
        },
        {
            title: "Customer",
            dataIndex: "customer",
            key: "customer",
            width: 200,
        },
        {
            title: "From",
            dataIndex: "from",
            key: "from",
            width: 200,
        },
        {
            title: "Delivery Address",
            dataIndex: "delivery_address",
            key: "delivery_address",
            width: 250,
        },
        {
            title: "Total Amount",
            dataIndex: "total_amount",
            key: "total_amount",
            width: 150,
            render: (val) => `Rs. ${val.toFixed(2)}`,
        },
        {
            title: "Driver Earning",
            dataIndex: "driver_earning",
            key: "driver_earning",
            width: 150,
            render: (val) => `Rs. ${val}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status) => (
                <Tag color={status === "delivered" ? "green" : "orange"}>{status}</Tag>
            ),
        },
        {
            title: "Delivered At",
            dataIndex: "delivered_at",
            key: "delivered_at",
            width: 180,
            render: (val) => new Date(val).toLocaleString(),
        },
    ];

    return (
        <Card className="shadow-md rounded-lg">
            <Title level={4}>Driver Order History</Title>
            {loading ? (
                <Spin size="large" />
            ) : (
                <Table
                    dataSource={orders}
                    columns={columns}
                    rowKey="order_id"
                    scroll={{ x: 1200 }}
                    pagination={{ pageSize: 10 }}
                    expandable={{
                        expandedRowRender: (record) => (
                            <div>
                                <strong>Items:</strong>
                                <ul className="list-disc pl-6">
                                    {record.items.map((item, idx) => (
                                        <li key={idx}>
                                            {item.product_name} - {item.quantity} × Rs. {item.unit_price} = Rs. {item.total_price}
                                        </li>
                                    ))}
                                </ul>
                                {record.intermediates?.length > 0 && (
                                    <p>
                                        <strong>Intermediates:</strong> {record.intermediates.join(", ")}
                                    </p>
                                )}
                                <p><strong>Payment:</strong> {record.payment_method} ({record.payment_status})</p>
                                <p><strong>Notes:</strong> {record.notes || "N/A"}</p>
                            </div>
                        ),
                    }}
                />

            )}
        </Card>
    );
};

export default DriverHistory;
