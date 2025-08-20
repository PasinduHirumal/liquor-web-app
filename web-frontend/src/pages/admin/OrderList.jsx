import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Table, message, Tag, Button, Tooltip, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import useAdminAuthStore from "../../stores/adminAuthStore";

const ORDER_STATUS = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED"
};

function OrderList() {
    const { user, isAuthenticated } = useAdminAuthStore();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(null);
    const [driverAcceptedFilter, setDriverAcceptedFilter] = useState(null);
    const navigate = useNavigate();

    const formatDate = (timestamp) => {
        if (!timestamp || !timestamp._seconds) return "N/A";
        return new Date(timestamp._seconds * 1000).toLocaleString();
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!isAuthenticated) return;

            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (statusFilter) params.append("status", statusFilter.toLowerCase());
                if (driverAcceptedFilter !== null) {
                    params.append("is_driver_accepted", driverAcceptedFilter);
                }

                // Add warehouse filter for non-super admins
                if (user?.role !== 'super_admin' && user?.where_house) {
                    params.append("where_house_id", user.where_house);
                }

                const url = `/orders/getAllOrders${params.toString() ? `?${params}` : ""}`;

                const response = await axiosInstance.get(url);
                if (response.data?.success) {
                    setOrders(response.data.data);

                    let filtered = response.data.data;

                    setFilteredOrders(filtered);
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
    }, [statusFilter, driverAcceptedFilter, isAuthenticated, user]);

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value || null);
    };

    const handleDriverAcceptedFilterChange = (value) => {
        setDriverAcceptedFilter(value || null);
    };

    const getStatusTag = (status) => {
        const colorMap = {
            PENDING: "orange",
            PROCESSING: "blue",
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
            width: 150,
        },
        {
            title: "Warehouse",
            dataIndex: "warehouse_id",
            key: "warehouse_id",
            render: (id) => id?.name || "N/A",
            width: 150,
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

    return (
        <div className="bg-white p-5">
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                gap: "16px",
                flexWrap: "wrap",
            }}>
                <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                    Order List
                    {user?.role !== 'super_admin' && user?.where_house && (
                        <span style={{ fontSize: "14px", marginLeft: "10px", color: "#666" }}>
                            (Warehouse: {user.where_house})
                        </span>
                    )}
                </h1>
                <div style={{ display: "flex", gap: "12px" }}>
                    <Select
                        placeholder="Filter by status"
                        style={{ width: 200 }}
                        onChange={handleStatusFilterChange}
                        allowClear
                        value={statusFilter}
                    >
                        {Object.values(ORDER_STATUS).map((status) => (
                            <Select.Option key={status} value={status}>
                                {status.replace(/_/g, " ")}
                            </Select.Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Filter by driver acceptance"
                        style={{ width: 200 }}
                        onChange={handleDriverAcceptedFilterChange}
                        allowClear
                        value={driverAcceptedFilter}
                    >
                        <Select.Option value="true">Accepted</Select.Option>
                        <Select.Option value="false">Not Accepted</Select.Option>
                    </Select>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="order_id"
                bordered
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: "max-content" }}
            />
        </div>
    );
}

export default OrderList;
