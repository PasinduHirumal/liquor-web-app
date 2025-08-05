import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import {
    Table, Card, Row, Col, Typography,
    Button, Space, Tag
} from "antd";
import {
    EditOutlined, ReloadOutlined, PlusOutlined
} from '@ant-design/icons';
import toast from "react-hot-toast";
import EditSystemModal from "../../components/admin/forms/EditSystemModal";
import CreateSystemModal from "../../components/admin/forms/CreateSystemModal";

const { Title, Text } = Typography;

const SystemDetail = () => {
    const [companyDetails, setCompanyDetails] = useState([]); // ← treat as array
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchCompanyDetails = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/system/details");
            setCompanyDetails(res.data.data); // ← array of warehouses
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch system details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyDetails();
    }, []);

    const columns = [
        {
            title: 'Warehouse Code',
            dataIndex: 'where_house_code',
            key: 'where_house_code',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Warehouse Name',
            dataIndex: 'where_house_name',
            key: 'where_house_name',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Warehouse Location',
            dataIndex: 'where_house_location',
            key: 'where_house_location',
            render: (location) =>
                location ? (
                    <Space direction="vertical" size={0}>
                        <Text>Lat: {location.lat ?? 'N/A'}</Text>
                        <Text>Lng: {location.lng ?? 'N/A'}</Text>
                    </Space>
                ) : 'N/A',
        },
        {
            title: 'Delivery Charge (per 1KM)',
            dataIndex: 'delivery_charge_for_1KM',
            key: 'delivery_charge_for_1KM',
            render: (value) => value ?? 'N/A',
        },
        {
            title: 'Service Charge',
            dataIndex: 'service_charge',
            key: 'service_charge',
            render: (value) => value ?? 'N/A',
        },
        {
            title: 'System Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setEditingId(record.id); // ← use the row's ID
                        setShowEditModal(true);
                    }}
                />
            ),
        }
    ];

    return (
        <div className="container-fluid mt-3">
            <Card
                title={
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4} style={{ margin: 0 }}>System Configuration</Title>
                            <Text type="secondary">All warehouse system settings</Text>
                        </Col>
                        <Col>
                            <Space>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setShowCreateModal(true)}
                                >
                                    Create New
                                </Button>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={fetchCompanyDetails}
                                    loading={loading}
                                >
                                    Refresh
                                </Button>
                            </Space>
                        </Col>
                    </Row>
                }
            >
                <Table
                    columns={columns}
                    dataSource={companyDetails}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    bordered
                    size="middle"
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    style={{ marginTop: 16 }}
                />
            </Card>

            <EditSystemModal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                companyDetailId={editingId}
                onUpdateSuccess={(updatedData) => {
                    setCompanyDetails(prev =>
                        prev.map(item => item.id === updatedData.id ? updatedData : item)
                    );
                    setShowEditModal(false);
                }}
            />

            <CreateSystemModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onCreateSuccess={(newData) => {
                    setCompanyDetails(prev => [...prev, newData]);
                    setShowCreateModal(false);
                    toast.success("System configuration created successfully");
                }}
            />
        </div>
    );
};

export default SystemDetail;
