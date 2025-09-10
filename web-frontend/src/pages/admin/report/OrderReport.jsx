import React, { useState, useEffect } from "react";
import {
    Card, Table, Spin, Alert, Statistic, Row, Col, Typography,
    Tag, Button, Modal, Tabs, Badge
} from "antd";
import {
    ShoppingOutlined, EyeOutlined, ShopOutlined,
    HomeOutlined, CheckCircleOutlined, CloseCircleOutlined,
    FilePdfOutlined, ReloadOutlined
} from "@ant-design/icons";
import { toast } from "react-hot-toast"
import { axiosInstance } from "../../../lib/axios";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const OrderReport = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [selectedSupermarket, setSelectedSupermarket] = useState(null);
    const [warehouseModalVisible, setWarehouseModalVisible] = useState(false);
    const [supermarketModalVisible, setSupermarketModalVisible] = useState(false);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get("/reports/orders", {
                params: {
                    // status: "out_for_delivery",
                },
            });

            const payload = response.data?.data || response.data;
            setReportData(payload);
        } catch (err) {
            console.error("Error fetching order report:", err);
            setError(err.response?.data?.message || "Failed to fetch order report");
        } finally {
            setLoading(false);
        }
    };

    // download PDF
    const downloadPDF = async () => {
        try {
            setDownloading(true);
            const response = await axiosInstance.get("/reports/orders", {
                params: {
                    // status: "out_for_delivery",
                    format: "pdf",
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "orders_report.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("PDF downloaded successfully");
        } catch (err) {
            console.error("Error downloading PDF:", err);
            toast.error("Failed to download PDF");
        } finally {
            setDownloading(false);
        }
    };

    const showWarehouseDetails = (warehouse) => {
        setSelectedWarehouse(warehouse);
        setWarehouseModalVisible(true);
    };

    const showSupermarketDetails = (supermarket) => {
        setSelectedSupermarket(supermarket);
        setSupermarketModalVisible(true);
    };

    // Warehouse Table Columns
    const warehouseColumns = [
        {
            title: "Warehouse Code",
            dataIndex: "where_house_code",
            key: "where_house_code",
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => showWarehouseDetails(record)}
                    icon={<EyeOutlined />}
                >
                    {text}
                </Button>
            ),
        },
        {
            title: "Warehouse Name",
            dataIndex: "where_house_name",
            key: "where_house_name",
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            ellipsis: true,
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <span>
                    <Tag color={record.isActive ? "green" : "red"} icon={record.isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                        {record.isActive ? "Active" : "Inactive"}
                    </Tag>
                    <Tag color={record.isLiquorActive ? "blue" : "default"}>
                        Liquor {record.isLiquorActive ? "Active" : "Inactive"}
                    </Tag>
                </span>
            ),
        },
        {
            title: "Order Count",
            dataIndex: "order_count",
            key: "order_count",
            render: (count) => (
                <Badge
                    count={count}
                    showZero
                    style={{ backgroundColor: count > 0 ? '#52c41a' : '#ccc' }}
                />
            ),
        },
    ];

    // Supermarket Table Columns
    const supermarketColumns = [
        {
            title: "Supermarket Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => showSupermarketDetails(record)}
                    icon={<EyeOutlined />}
                >
                    {text}
                </Button>
            ),
        },
        {
            title: "Address",
            dataIndex: "streetAddress",
            key: "streetAddress",
            ellipsis: true,
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive) => (
                <Tag color={isActive ? "green" : "red"} icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                    {isActive ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Orders Count",
            dataIndex: "orders_count",
            key: "orders_count",
            render: (count) => (
                <Badge
                    count={count}
                    showZero
                    style={{ backgroundColor: count > 0 ? '#52c41a' : '#ccc' }}
                />
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px] bg-white">
                <Spin size="large" tip="Loading driver report..." />
            </div>
        );
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    if (!reportData) {
        return <Alert message="No report data available." type="info" showIcon />;
    }

    const { warehouse_report, supermarket_report } = reportData;

    return (
        <div style={{ padding: "20px" }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                <Col>
                    <Title level={2} style={{ color: "#fff", marginBottom: 0 }}>
                        <ShoppingOutlined /> Order Report
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={fetchReport}
                        style={{ marginRight: 8 }}
                    >
                        Refresh
                    </Button>
                    {/* ✅ Added Download PDF button */}
                    <Button
                        type="default"
                        icon={<FilePdfOutlined />}
                        loading={downloading}
                        onClick={downloadPDF}
                    >
                        Download PDF
                    </Button>
                </Col>
            </Row>

            {/* Summary Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable style={{ borderRadius: 8, textAlign: "center" }}>
                        <Statistic
                            title="Total Warehouses"
                            value={warehouse_report?.count || 0}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable style={{ borderRadius: 8, textAlign: "center" }}>
                        <Statistic
                            title="Total Supermarkets"
                            value={supermarket_report?.count || 0}
                            prefix={<ShopOutlined />}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Reports Tabs */}
            <Tabs
                defaultActiveKey="warehouses"
                renderTabBar={(props, DefaultTabBar) => (
                    <DefaultTabBar {...props}>
                        {(node) => {
                            const isActive = props.activeKey === node.key;
                            return React.cloneElement(node, {
                                style: {
                                    color: isActive ? "" : "#ffffffff",
                                    borderRadius: "6px",
                                    transition: "all 0.3s ease",
                                },
                            });
                        }}
                    </DefaultTabBar>
                )}
            >
                <TabPane tab="Warehouses Report" key="warehouses">
                    <Card title={`Warehouses (${warehouse_report?.count || 0})`}>
                        <Table
                            columns={warehouseColumns}
                            dataSource={warehouse_report?.data || []}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            scroll={{ x: "max-content" }}
                        />
                    </Card>
                </TabPane>

                <TabPane tab="Supermarkets Report" key="supermarkets">
                    <Card title={`Supermarkets (${supermarket_report?.count || 0})`}>
                        <Table
                            columns={supermarketColumns}
                            dataSource={supermarket_report?.data || []}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            scroll={{ x: "max-content" }}
                        />
                    </Card>
                </TabPane>
            </Tabs>


            {/* Warehouse Details Modal */}
            <Modal
                title={`Warehouse Details: ${selectedWarehouse?.where_house_name || ""}`}
                open={warehouseModalVisible}
                onCancel={() => setWarehouseModalVisible(false)}
                footer={null}
                width="70%"
            >
                {selectedWarehouse && (
                    <div>
                        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                            <Col xs={24} md={12}>
                                <Text strong>Warehouse Code: </Text>
                                {selectedWarehouse.where_house_code}
                            </Col>
                            <Col xs={24} md={12}>
                                <Text strong>Name: </Text>
                                {selectedWarehouse.where_house_name}
                            </Col>
                            <Col xs={24}>
                                <Text strong>Address: </Text>
                                {selectedWarehouse.address}
                            </Col>
                            <Col xs={24} md={12}>
                                <Text strong>Status: </Text>
                                <Tag color={selectedWarehouse.isActive ? "green" : "red"}>
                                    {selectedWarehouse.isActive ? "Active" : "Inactive"}
                                </Tag>
                            </Col>
                            <Col xs={24} md={12}>
                                <Text strong>Liquor Sales: </Text>
                                <Tag color={selectedWarehouse.isLiquorActive ? "blue" : "default"}>
                                    {selectedWarehouse.isLiquorActive ? "Active" : "Inactive"}
                                </Tag>
                            </Col>
                            <Col xs={24}>
                                <Text strong>Order Count: </Text>
                                <Badge
                                    count={selectedWarehouse.order_count}
                                    showZero
                                    style={{
                                        backgroundColor: selectedWarehouse.order_count > 0 ? '#52c41a' : '#ccc',
                                        fontSize: '16px'
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>

            {/* Supermarket Details Modal */}
            <Modal
                title={`Supermarket Details: ${selectedSupermarket?.name || ""}`}
                open={supermarketModalVisible}
                onCancel={() => setSupermarketModalVisible(false)}
                footer={null}
                width="70%"
            >
                {selectedSupermarket && (
                    <div>
                        <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
                            <Col xs={24}>
                                <Text strong>Name: </Text>
                                {selectedSupermarket.name}
                            </Col>
                            <Col xs={24}>
                                <Text strong>Address: </Text>
                                {selectedSupermarket.streetAddress}
                            </Col>
                            <Col xs={24} md={12}>
                                <Text strong>Status: </Text>
                                <Tag color={selectedSupermarket.isActive ? "green" : "red"}>
                                    {selectedSupermarket.isActive ? "Active" : "Inactive"}
                                </Tag>
                            </Col>
                            <Col xs={24} md={12}>
                                <Text strong>Orders Count: </Text>
                                <Badge
                                    count={selectedSupermarket.orders_count}
                                    showZero
                                    style={{
                                        backgroundColor: selectedSupermarket.orders_count > 0 ? '#52c41a' : '#ccc',
                                        fontSize: '16px'
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderReport;
