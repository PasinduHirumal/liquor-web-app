import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import {
    Table, Card, Row, Col, Typography,
    Button, Space, Tag
} from "antd";
import {
    EditOutlined, ReloadOutlined
} from '@ant-design/icons';
import toast from "react-hot-toast";
import EditSystemModal from "../../components/admin/forms/EditSystemModal";

const { Title, Text } = Typography;

const SystemDetail = () => {
    const [companyDetail, setCompanyDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchCompanyDetail = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/system/details");
            // Your backend returns one company detail object (earliest created)
            setCompanyDetail(res.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch system details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyDetail();
    }, []);

    const columns = [
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
            render: () => (
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => {
                        if (companyDetail?.id) {
                            setEditingId(companyDetail.id);
                            setShowModal(true);
                        } else {
                            toast.error("No company detail to edit");
                        }
                    }}
                />
            ),
        }
    ];

    const dataSource = companyDetail ? [companyDetail] : [];

    return (
        <div className="container-fluid mt-3">
            <Card
                title={
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4} style={{ margin: 0 }}>System Configuration</Title>
                            <Text type="secondary">Current system settings</Text>
                        </Col>
                        <Col>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={fetchCompanyDetail}
                                loading={loading}
                            >
                                Refresh
                            </Button>
                        </Col>
                    </Row>
                }
            >
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    pagination={false}
                    bordered
                    size="middle"
                    rowKey={() => 'system-settings'}
                    style={{ marginTop: 16 }}
                    scroll={{ x: 'max-content' }}
                />
            </Card>

            <EditSystemModal
                show={showModal}
                onHide={() => setShowModal(false)}
                companyDetailId={editingId}
                onUpdateSuccess={(updatedData) => {
                    setCompanyDetail(updatedData);
                    setShowModal(false);
                }}
            />
        </div>
    );
};

export default SystemDetail;
