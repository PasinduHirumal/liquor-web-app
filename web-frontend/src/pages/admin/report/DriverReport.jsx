import React, { useState, useEffect } from "react";
import {
    Card, Table, Spin, Alert, Statistic, Row, Col, Typography,
    Divider, Tag, Button, Space, Tooltip, Modal, Select, Badge, Avatar, List
} from "antd";
import {
    UserOutlined, PhoneOutlined, MailOutlined, IdcardOutlined, CarOutlined,
    EyeOutlined, ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
    FilePdfOutlined, DollarOutlined, WalletOutlined, ArrowDownOutlined
} from "@ant-design/icons";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";

const { Title, Text } = Typography;
const { Option } = Select;

const DriverReport = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [filterStatus, setFilterStatus] = useState("all");
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosInstance.get("/reports/drivers");
            setReportData(response.data);
        } catch (err) {
            console.error("Error fetching driver report:", err);
            const errorMessage = err.response?.data?.message || "Failed to fetch driver report";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // ✅ PDF download
    const downloadPDF = async () => {
        try {
            setDownloading(true);
            const response = await axiosInstance.get("/reports/drivers", {
                params: { format: "pdf" },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "drivers_report.pdf");
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

    const showDriverDetails = (driver) => {
        setSelectedDriver(driver);
        setModalVisible(true);
    };

    const getStatusTag = (driver) => {
        if (!driver.isActive) {
            return <Tag color="red">Inactive</Tag>;
        }
        if (driver.backgroundCheckStatus !== "approved") {
            return <Tag color="orange">Pending Approval</Tag>;
        }
        if (!driver.isDocumentVerified) {
            return <Tag color="orange">Documents Pending</Tag>;
        }
        return <Tag color="green">Active</Tag>;
    };

    const getDeliveryStatusColor = (count) => {
        if (count === 0) return "#ccc";
        if (count <= 5) return "#52c41a";
        if (count <= 10) return "#faad14";
        return "#f5222d";
    };

    const filteredDrivers = reportData?.data
        ? filterStatus === "all"
            ? reportData.data
            : filterStatus === "active"
                ? reportData.data.filter(driver => driver.isActive)
                : reportData.data.filter(driver => !driver.isActive)
        : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px] bg-white">
                <Spin size="large" tip="Loading driver report..." />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                action={<Button size="small" onClick={fetchReport}>Try Again</Button>}
            />
        );
    }

    if (!reportData) {
        return (
            <Alert
                message="No report data available"
                description="Try checking your connection or contact support."
                type="info"
                showIcon
            />
        );
    }

    // Table Columns
    const columns = [
        {
            title: "Driver",
            dataIndex: "full_name",
            key: "driver",
            width: 200,
            render: (text, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div>{text}</div>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                            {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "Contact",
            dataIndex: "phone",
            key: "phone",
            width: 140,
            render: (phone) => <Space><PhoneOutlined />{phone}</Space>,
        },
        {
            title: "Warehouse",
            dataIndex: "warehouse_id",
            key: "warehouse",
            width: 180,
            render: (warehouse) => (
                <Tooltip title={warehouse?.name}>
                    <Text ellipsis>{warehouse?.name}</Text>
                </Tooltip>
            ),
        },
        {
            title: "Status",
            key: "status",
            width: 120,
            render: (_, record) => getStatusTag(record),
        },
        {
            title: "Total Deliveries",
            dataIndex: "totalDeliveries",
            key: "totalDeliveries",
            width: 120,
            render: (count) => (
                <Badge count={count} showZero style={{ backgroundColor: getDeliveryStatusColor(count) }} />
            ),
            sorter: (a, b) => a.totalDeliveries - b.totalDeliveries,
        },
        {
            title: "Completed",
            dataIndex: "completedDeliveries",
            key: "completed",
            width: 110,
            render: (count) => <Tag color="green" icon={<CheckCircleOutlined />}>{count}</Tag>,
            sorter: (a, b) => a.completedDeliveries - b.completedDeliveries,
        },
        {
            title: "Ongoing",
            dataIndex: "onGoingDeliveries",
            key: "ongoing",
            width: 100,
            render: (count) => <Tag color="blue" icon={<ClockCircleOutlined />}>{count}</Tag>,
            sorter: (a, b) => a.onGoingDeliveries - b.onGoingDeliveries,
        },
        {
            title: "Cancelled",
            dataIndex: "cancelledDeliveries",
            key: "cancelled",
            width: 110,
            render: (count) => <Tag color="red" icon={<CloseCircleOutlined />}>{count}</Tag>,
            sorter: (a, b) => a.cancelledDeliveries - b.cancelledDeliveries,
        },
        {
            title: "Earnings",
            dataIndex: "totalEarnings",
            key: "earnings",
            width: 120,
            render: (amount) => <Text strong>${amount?.toFixed(2) || 0}</Text>,
            sorter: (a, b) => a.totalEarnings - b.totalEarnings,
        },
        {
            title: "Balance",
            dataIndex: "currentBalance",
            key: "balance",
            width: 120,
            render: (amount) => <Text>${amount?.toFixed(2) || 0}</Text>,
            sorter: (a, b) => a.currentBalance - b.currentBalance,
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            render: (_, record) => (
                <Button type="link" icon={<EyeOutlined />} onClick={() => showDriverDetails(record)}>
                    View
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                <Col>
                    <Title level={2} style={{ color: "#fff", marginBottom: 0 }}>
                        <CarOutlined /> Driver Report
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={fetchReport}
                        style={{ marginRight: 8 }}  >
                        Refresh
                    </Button>
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

            {/* Filter Section */}
            <Card style={{ marginBottom: 20 }}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Text strong>Filter Drivers:</Text>
                            <Select
                                value={filterStatus}
                                onChange={setFilterStatus}
                                style={{ width: 120, marginLeft: 10 }}
                            >
                                <Option value="all">All Drivers</Option>
                                <Option value="active">Active Only</Option>
                                <Option value="inactive">Inactive Only</Option>
                            </Select>
                        </Col>
                    </Row>
                </Space>
            </Card>

            {/* Summary Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable style={{ borderRadius: 8 }}>
                        <Statistic
                            title="Total Drivers"
                            value={reportData.count}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable style={{ borderRadius: 8 }}>
                        <Statistic
                            title="Active Drivers"
                            value={reportData.data.filter(d => d.isActive).length}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable style={{ borderRadius: 8 }}>
                        <Statistic
                            title="Total Earnings"
                            value={reportData.data.reduce((sum, d) => sum + (d.totalEarnings || 0), 0)}
                            prefix={<DollarOutlined />}
                            precision={2}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable style={{ borderRadius: 8 }}>
                        <Statistic
                            title="Total Withdraws"
                            value={reportData.data.reduce((sum, d) => sum + (d.totalWithdraws || 0), 0)}
                            prefix={<ArrowDownOutlined />}
                            precision={2}
                            valueStyle={{ color: "#f5222d" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card hoverable style={{ borderRadius: 8 }}>
                        <Statistic
                            title="Current Balance"
                            value={reportData.data.reduce((sum, d) => sum + (d.currentBalance || 0), 0)}
                            prefix={<WalletOutlined />}
                            precision={2}
                            valueStyle={{ color: "#52c41a" }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Drivers Table */}
            <Card title={`Drivers (${filteredDrivers.length})`}>
                <Table
                    columns={columns}
                    dataSource={filteredDrivers}
                    rowKey="driver_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} drivers`
                    }}
                    scroll={{ x: "max-content" }}
                    loading={loading}
                />
            </Card>

            {/* Driver Details Modal */}
            <Modal
                title={`Driver Details: ${selectedDriver?.full_name}`}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={700}
                style={{ top: 70 }}
            >
                {selectedDriver && (
                    <div>
                        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                            <Col span={24}>
                                <Space size="large">
                                    <Avatar size={64} icon={<UserOutlined />} />
                                    <div>
                                        <Title level={4}>{selectedDriver.full_name}</Title>
                                        <Space>
                                            {getStatusTag(selectedDriver)}
                                            {selectedDriver.isDocumentVerified && (
                                                <Tag color="green" icon={<CheckCircleOutlined />}>
                                                    Documents Verified
                                                </Tag>
                                            )}
                                        </Space>
                                    </div>
                                </Space>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card title="Contact Information" size="small">
                                    <List size="small">
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<MailOutlined />}
                                                title="Email"
                                                description={selectedDriver.email}
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<PhoneOutlined />}
                                                title="Phone"
                                                description={selectedDriver.phone}
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<IdcardOutlined />}
                                                title="NIC Number"
                                                description={selectedDriver.nic_number}
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<CarOutlined />}
                                                title="License Number"
                                                description={selectedDriver.license_number}
                                            />
                                        </List.Item>
                                    </List>
                                </Card>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card title="Warehouse Assignment" size="small">
                                    <List size="small">
                                        <List.Item>
                                            <List.Item.Meta
                                                title="Warehouse"
                                                description={selectedDriver.warehouse_id?.name}
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <List.Item.Meta
                                                title="Code"
                                                description={selectedDriver.warehouse_id?.code}
                                            />
                                        </List.Item>
                                        <List.Item>
                                            <List.Item.Meta
                                                title="Location"
                                                description={`Lat: ${selectedDriver.warehouse_id?.location?.lat}, Lng: ${selectedDriver.warehouse_id?.location?.lng}`}
                                            />
                                        </List.Item>
                                    </List>
                                </Card>
                            </Col>
                        </Row>

                        <Divider />

                        <Card title="Delivery Performance" size="small" style={{ marginBottom: 20 }}>
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={6}>
                                    <Statistic title="Total Deliveries" value={selectedDriver.totalDeliveries} prefix={<CarOutlined />} />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Statistic title="Completed" value={selectedDriver.completedDeliveries} valueStyle={{ color: "#52c41a" }} />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Statistic title="Ongoing" value={selectedDriver.onGoingDeliveries} valueStyle={{ color: "#1890ff" }} />
                                </Col>
                                <Col xs={24} sm={12} md={6}>
                                    <Statistic title="Cancelled" value={selectedDriver.cancelledDeliveries} valueStyle={{ color: "#f5222d" }} />
                                </Col>
                            </Row>
                        </Card>

                        <Card title="Financial Summary" size="small">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={8}>
                                    <Statistic title="Total Earnings" value={selectedDriver.totalEarnings} prefix={<DollarOutlined />} precision={2} />
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Statistic title="Total Withdraws" value={selectedDriver.totalWithdraws} prefix={<ArrowDownOutlined />} precision={2} />
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Statistic title="Current Balance" value={selectedDriver.currentBalance} prefix={<WalletOutlined />} precision={2} />
                                </Col>
                            </Row>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DriverReport;
