import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Table, Spin, message, Tag, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get("/orders/getAllOrders");
                if (response.data?.success) {
                    setOrders(response.data.data);
                } else {
                    message.error("Failed to load orders");
                }
            } catch (err) {
                console.error(err);
                message.error("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusTag = (status) => {
        const colorMap = {
            PENDING: "orange",
            CONFIRMED: "blue",
            OUT_FOR_DELIVERY: "geekblue",
            DELIVERED: "green",
            CANCELLED: "red",
        };
        return <Tag color={colorMap[status] || "default"}>{status.replace(/_/g, " ")}</Tag>;
    };

    const columns = [
        {
            title: "Order #",
            dataIndex: "order_number",
            key: "order_number",
        },
        {
            title: "Date",
            dataIndex: "order_date",
            key: "order_date",
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: "Customer",
            dataIndex: "user_id",
            key: "user_id",
            render: (user) => user?.name || "N/A",
        },
        {
            title: "Total",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (amount) => `Rs. ${Number(amount).toFixed(2)}`,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: getStatusTag,
        },
        {
            title: "Payment",
            dataIndex: "payment_status",
            key: "payment_status",
            render: (status) => (
                <Tag color={status === "paid" ? "green" : "red"}>
                    {status?.toUpperCase() || "UNKNOWN"}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    type="primary"
                    shape="circle"
                    icon={<ArrowRightOutlined />}
                    onClick={() => navigate(`/order-list/${record.order_id}`)}
                />
            ),
        },
    ];

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
                Order List
            </h1>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="order_id"
                bordered
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}

export default OrderList;
