import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import {
    Table, Card, Row, Col, Typography,
    Button, Space, Tag, Modal, Descriptions, Popconfirm
} from "antd";
import {
    EditOutlined, ReloadOutlined, PlusOutlined,
    UserOutlined, CarOutlined, DeleteOutlined
} from '@ant-design/icons';
import toast from "react-hot-toast";
import EditSystemModal from "../../components/admin/forms/EditSystemModal";
import CreateSystemModal from "../../components/admin/forms/CreateSystemModal";

const { Title, Text } = Typography;

const SystemDetail = () => {
    const [companyDetails, setCompanyDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Staff modal states
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffModalType, setStaffModalType] = useState(''); // 'admins' or 'drivers'

    const fetchCompanyDetails = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/system/details");
            setCompanyDetails(res.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to fetch system details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyDetails();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/system/delete/${id}`);
            setCompanyDetails(prev => prev.filter(item => item.id !== id));
            toast.success("Warehouse deleted successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete warehouse");
        }
    };

    const handleViewStaff = (staff, type, warehouseName) => {
        setSelectedStaff({ ...staff, warehouseName });
        setStaffModalType(type);
        setShowStaffModal(true);
    };

    const staffColumns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'ID', dataIndex: 'id', key: 'id' },
    ];

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
            title: 'Warehouse Address',
            dataIndex: 'address',
            key: 'address',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Staff Members',
            dataIndex: 'staff',
            key: 'staff',
            render: (staff, record) =>
                staff ? (
                    <Space direction="vertical" size="small">
                        <Space size="small">
                            <Text>Admins: {staff.admin_count ?? 0}</Text>
                            <Button
                                type="link"
                                size="small"
                                icon={<UserOutlined />}
                                onClick={() => handleViewStaff(staff, 'admins', record.where_house_name)}
                                disabled={!staff.admin_count}
                            >
                                View
                            </Button>
                        </Space>
                        <Space size="small">
                            <Text>Drivers: {staff.drivers_count ?? 0}</Text>
                            <Button
                                type="link"
                                size="small"
                                icon={<CarOutlined />}
                                onClick={() => handleViewStaff(staff, 'drivers', record.where_house_name)}
                                disabled={!staff.drivers_count}
                            >
                                View
                            </Button>
                        </Space>
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
            title: 'Service Charge (%)',
            dataIndex: 'service_charge',
            key: 'service_charge',
            render: (value) =>
                value !== null && value !== undefined ? `${value}%` : 'N/A',
        },
        {
            title: 'System Status',
            dataIndex: 'isActive',
            key: 'isActive',
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false }
            ],
            onFilter: (value, record) => record.isActive === value,
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            title: 'Liquor Status',
            dataIndex: 'isLiquorActive',
            key: 'isLiquorActive',
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false }
            ],
            onFilter: (value, record) => record.isLiquorActive === value,
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
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingId(record.id);
                            setShowEditModal(true);
                        }}
                    />
                    <Popconfirm
                        title="Are you sure you want to delete this warehouse?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <div className="container-fluid pt-3 bg-white">
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

            {/* Staff Modal */}
            <Modal
                title={
                    <Space>
                        {staffModalType === 'admins' ? <UserOutlined /> : <CarOutlined />}
                        {staffModalType === 'admins' ? 'Admins' : 'Drivers'} - {selectedStaff?.warehouseName}
                    </Space>
                }
                open={showStaffModal}
                onCancel={() => setShowStaffModal(false)}
                footer={[
                    <Button key="close" onClick={() => setShowStaffModal(false)}>
                        Close
                    </Button>
                ]}
                width={800}
            >
                {selectedStaff && (
                    <div>
                        <Descriptions
                            bordered
                            size="small"
                            style={{ marginBottom: 16 }}
                            column={2}
                        >
                            <Descriptions.Item label="Total Count">
                                {staffModalType === 'admins' ? selectedStaff.admin_count : selectedStaff.drivers_count}
                            </Descriptions.Item>
                            <Descriptions.Item label="Warehouse">
                                {selectedStaff.warehouseName}
                            </Descriptions.Item>
                        </Descriptions>

                        <Table
                            columns={staffColumns}
                            dataSource={staffModalType === 'admins' ? selectedStaff.admins : selectedStaff.drivers}
                            pagination={false}
                            size="small"
                            rowKey="id"
                            locale={{
                                emptyText: `No ${staffModalType} found`
                            }}
                        />
                    </div>
                )}
            </Modal>

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
