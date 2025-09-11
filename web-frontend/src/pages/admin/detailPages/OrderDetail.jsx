import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
    Card,
    Row,
    Col,
    Table,
    Alert,
    Tag,
    Image,
    Button,
    Typography,
} from "antd";
import {
    UserOutlined,
    CarOutlined,
    DollarOutlined,
    InfoCircleOutlined,
    ShoppingCartOutlined,
    EnvironmentOutlined,
    FileTextOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import AssignDriverModal from "../../../components/admin/forms/AssignDriverModal";
import EditStatusModal from "../../../components/admin/forms/EditStatusModal";

const { Title, Text } = Typography;

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
                    axiosInstance.get(`/driverDuties/getAllForOrder/${id}`),
                ]);

                const orderData = Array.isArray(orderRes.data.data)
                    ? orderRes.data.data[0]
                    : orderRes.data.data;
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

        if (value._seconds) {
            return new Date(value._seconds * 1000).toLocaleString();
        }

        if (value.toDate) {
            return value.toDate().toLocaleString();
        }

        try {
            return new Date(value).toLocaleString();
        } catch {
            return "Invalid date";
        }
    };

    const renderBadge = (value) => {
        if (!value) return null;
        const map = {
            delivered: "green",
            pending: "orange",
            cancelled: "red",
            processing: "blue",
            out_for_delivery: "geekblue",
            paid: "green",
            failed: "red",
            refunded: "cyan",
        };
        return <Tag color={map[value.toLowerCase()] || "default"}>{value}</Tag>;
    };

    if (loading) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <Skeleton count={12} />
            </div>
        );
    }

    if (error) return <Alert type="error" message={`Error: ${error}`} />;
    if (!order) return <Alert type="warning" message="No order found." />;

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <Row className="items-center justify-between mb-6">
                <Col>
                    <Title level={3} className="!mb-0">
                        Order Details{" "}
                        <Text type="secondary">#{order.order_number || order.order_id}</Text>
                    </Title>
                </Col>
                <Col className="flex justify-end gap-2">
                    <Button
                        type="primary"
                        onClick={() => setShowAssignDriverModal(true)}
                        icon={<CarOutlined />}
                    >
                        Assign Driver
                    </Button>
                    <Button
                        type="default"
                        onClick={() => setShowEditStatusModal(true)}
                        icon={<InfoCircleOutlined />}
                    >
                        Edit Status
                    </Button>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Order Summary */}
                <Col xs={24} md={12}>
                    <Card
                        title={<span className="text-white font-bold">Order Summary</span>}
                        bordered
                        className="rounded-xl shadow"
                        headStyle={{ backgroundColor: '#3B82F6' }}
                        extra={<InfoCircleOutlined className="text-white text-xl" />}
                    >
                        <p>
                            <strong>Order Date:</strong> {formatDate(order.order_date)}
                        </p>
                        <p>
                            <strong>Status:</strong> {renderBadge(order.status)}
                        </p>
                        <p>
                            <strong>Payment Method:</strong>{" "}
                            {order.payment_method || "N/A"}
                        </p>
                        <p>
                            <strong>Payment Status:</strong> {renderBadge(order.payment_status)}
                        </p>
                        <p>
                            <strong>Driver Accepted:</strong>{" "}
                            <Tag color={order.is_driver_accepted ? "green" : "red"}>
                                {order.is_driver_accepted ? "Yes" : "No"}
                            </Tag>
                        </p>
                        <p>
                            <strong>Warehouse:</strong>{" "}
                            {order.where_house_id?.name || "N/A"}
                        </p>
                    </Card>
                </Col>

                {/* Price Details */}
                <Col xs={24} md={12}>
                    <Card
                        title={<span className="text-white font-bold">Price Details</span>}
                        bordered
                        className="rounded-xl shadow"
                        headStyle={{ backgroundColor: '#3B82F6' }}
                        extra={<DollarOutlined className="text-white text-xl" />}
                    >
                        <div className="flex justify-between py-1">
                            <span>Subtotal:</span>
                            <span>Rs: {order.subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span>Delivery Fee:</span>
                            <span>Rs: {order.delivery_fee?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span>Tax Amount:</span>
                            <span>Rs: {order.tax_amount?.toFixed(2)}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between font-bold py-1">
                            <span>Total:</span>
                            <span>Rs: {order.total_amount?.toFixed(2)}</span>
                        </div>
                    </Card>
                </Col>

                {/* Driver Duties */}
                <Col span={24}>
                    <Card
                        title={<span className="text-white font-bold">Driver Deties</span>}
                        bordered
                        className="rounded-xl shadow"
                        headStyle={{ backgroundColor: '#3B82F6' }}
                        extra={<CarOutlined className="text-white text-xl" />}
                    >
                        {dutiesError ? (
                            <Alert type="error" message={dutiesError} />
                        ) : driverDuties.length === 0 ? (
                            <Text>No driver duties found for this order.</Text>
                        ) : (
                            <Table
                                bordered
                                rowKey={(record, idx) => idx}
                                dataSource={driverDuties}
                                pagination={false}
                                scroll={{ x: 900 }}
                                columns={[
                                    {
                                        title: "Driver",
                                        dataIndex: ["driver_id", "username"],
                                        render: (val) => val || "Unknown",
                                        width: 150,
                                    },
                                    {
                                        title: "Driver Email",
                                        dataIndex: ["driver_id", "email"],
                                        render: (val) => val || "Unknown",
                                        width: 200,
                                    },
                                    {
                                        title: "Accepted",
                                        dataIndex: "is_driver_accepted",
                                        render: (val) => (val ? "Yes" : "No"),
                                        width: 100,
                                    },
                                    {
                                        title: "Completed",
                                        dataIndex: "is_completed",
                                        render: (val) => (val ? "Yes" : "No"),
                                        width: 100,
                                    },
                                    {
                                        title: "Reassigned",
                                        dataIndex: "is_re_assigning_driver",
                                        render: (val) => (val ? "Yes" : "No"),
                                        width: 120,
                                    },
                                    {
                                        title: "Created",
                                        dataIndex: "created_at",
                                        render: (val) => formatDate(val),
                                        width: 180,
                                    }
                                ]}
                            />
                        )}
                    </Card>
                </Col>

                {/* Order Items */}
                <Col span={24}>
                    <Card
                        title={<span className="text-white font-bold">Order Items</span>}
                        bordered
                        className="rounded-xl shadow"
                        headStyle={{ backgroundColor: '#3B82F6' }}
                        extra={<ShoppingCartOutlined className="text-white text-xl" />}
                    >
                        {order.items?.length > 0 ? (
                            <Table
                                rowKey={(record, idx) => idx}
                                dataSource={order.items}
                                pagination={false}
                                scroll={{ x: 800 }}
                                columns={[
                                    { title: "Product", dataIndex: "product_name", width: 100 },
                                    {
                                        title: "Image",
                                        dataIndex: "product_image",
                                        render: (src) => <Image src={src} width={50} className="rounded" />,
                                        width: 60,
                                    },
                                    { title: "Qty", dataIndex: "quantity", width: 50 },
                                    {
                                        title: "Unit Price",
                                        dataIndex: "unit_price",
                                        render: (val) => `Rs: ${val?.toFixed(2)}`,
                                        width: 70,
                                    },
                                    {
                                        title: "Total",
                                        dataIndex: "total_price",
                                        render: (val) => `Rs: ${val?.toFixed(2)}`,
                                        width: 70,
                                    },
                                ]}
                            />
                        ) : (
                            <Text>No items found.</Text>
                        )}
                    </Card>
                </Col>

                {/* Customer Info */}
                <Col xs={24} md={12}>
                    <Card
                        title={<span className="text-white font-bold">Customer Information</span>}
                        bordered
                        className="rounded-xl shadow"
                        headStyle={{ backgroundColor: '#3B82F6' }}
                        extra={<UserOutlined className="text-white text-xl" />}
                    >
                        <p><strong>Name:</strong> {order.user_id?.username || "N/A"}</p>
                        <p><strong>Email:</strong> {order.user_id?.email || "N/A"}</p>
                        <p><strong>User ID:</strong> {order.user_id?.id || "N/A"}</p>
                    </Card>
                </Col>

                {/* Driver Info */}
                <Col xs={24} md={12}>
                    <Card
                        title={<span className="text-white font-bold">Driver Information</span>}
                        bordered
                        className="rounded-xl shadow"
                        headStyle={{ backgroundColor: '#3B82F6' }}
                        extra={<TeamOutlined className="text-white text-xl" />}
                    >
                        <p><strong>Name:</strong> {order.assigned_driver_id?.username || "N/A"}</p>
                        <p><strong>Email:</strong> {order.assigned_driver_id?.email || "N/A"}</p>
                        <p><strong>Driver ID:</strong> {order.assigned_driver_id?.id || "N/A"}</p>
                    </Card>
                </Col>

                {/* Delivery Info */}
                <Col xs={24} md={12}>
                    <Card
                        title={<span className="text-white font-bold">Delivery Information</span>}
                        bordered
                        className="rounded-xl shadow"
                        headStyle={{ backgroundColor: '#3B82F6' }}
                        extra={<EnvironmentOutlined className="text-white text-xl" />}
                    >
                        <p><strong>Address:</strong></p>
                        <p className="bg-gray-100 border-l-4 border-blue-500 p-3 rounded">
                            {order.delivery_address_id?.streetAddress ||
                                order.delivery_address_id?.savedAddress ||
                                "N/A"}
                        </p>
                        <p><strong>Distance:</strong> {order.distance?.toFixed(2)} km</p>
                        <p><strong>Estimated:</strong> {formatDate(order.estimated_delivery)}</p>
                        <p><strong>Delivered At:</strong> {formatDate(order.delivered_at)}</p>
                    </Card>
                </Col>

                {/* Notes & Timestamps */}
                <Col xs={24} md={12}>
                    <Card
                        title={<span className="text-white font-bold">Additional Information</span>}
                        bordered
                        className="rounded-xl shadow"
                        headStyle={{ backgroundColor: '#3B82F6' }}
                        extra={<FileTextOutlined className="text-white text-xl" />}
                    >
                        <p className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                            <strong>Notes:</strong> {order.notes || "No notes available"}
                        </p>
                        <p><strong>Created At:</strong> {formatDate(order.created_at)}</p>
                        <p><strong>Updated At:</strong> {formatDate(order.updated_at)}</p>
                    </Card>
                </Col>
            </Row>

            {/* Modals */}
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
