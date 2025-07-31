import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Table, Spin, message, Tag, Button, Tooltip, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";

const ORDER_STATUS = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED"
};

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(null);
    const navigate = useNavigate();

    const formatDate = (timestamp) => {
        if (!timestamp || !timestamp._seconds) return "N/A";
        return new Date(timestamp._seconds * 1000).toLocaleString();
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const url = statusFilter
                    ? `/orders/getAllOrders?status=${statusFilter.toLowerCase()}`
                    : "/orders/getAllOrders";

                const response = await axiosInstance.get(url);
                if (response.data?.success) {
                    setOrders(response.data.data);
                    setFilteredOrders(response.data.data);
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
    }, [statusFilter]);

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
    };

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
            width: 120,
        },
        {
            title: "Date",
            dataIndex: "order_date",
            key: "order_date",
            render: (date) => formatDate(date),
            width: 180,
        },
        {
            title: "Customer",
            dataIndex: "user_id",
            key: "user_id",
            render: (user) => user?.username || "N/A",
            width: 180,
        },
        {
            title: "Total",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (amount) => `Rs. ${Number(amount).toFixed(2)}`,
            width: 120,
        },
        {
            title: "Driver Accepted",
            dataIndex: "is_driver_accepted",
            key: "is_driver_accepted",
            render: (accepted) => (
                <Tag color={accepted ? "green" : "red"}>
                    {accepted ? "Accepted" : "Not Accepted"}
                </Tag>
            ),
            width: 140,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: getStatusTag,
            width: 100,
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
            width: 100,
        },
        {
            title: "Action",
            key: "action",
            width: 50,
            render: (_, record) => (
                <Tooltip title="View Order Details">
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<ArrowRightOutlined />}
                        onClick={() => navigate(`/order-list/${record.order_id}`)}
                    />
                </Tooltip>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                    Order List
                </h1>
                <Select
                    placeholder="Filter by status"
                    style={{ width: 200 }}
                    onChange={handleStatusFilterChange}
                    allowClear
                >
                    <Select.Option value={ORDER_STATUS.PENDING}>Pending</Select.Option>
                    <Select.Option value={ORDER_STATUS.CONFIRMED}>Confirmed</Select.Option>
                    <Select.Option value={ORDER_STATUS.OUT_FOR_DELIVERY}>Out for Delivery</Select.Option>
                    <Select.Option value={ORDER_STATUS.DELIVERED}>Delivered</Select.Option>
                    <Select.Option value={ORDER_STATUS.CANCELLED}>Cancelled</Select.Option>
                </Select>
            </div>
            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="order_id"
                bordered
                pagination={{ pageSize: 10 }}
                scroll={{ x: "max-content" }}
            />
        </div>
    );
}

export default OrderList;