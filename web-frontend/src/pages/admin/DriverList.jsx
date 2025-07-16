import React, { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../lib/axios';
import CreateDriverForm from '../../components/admin/CreateDriverForm';
import toast from 'react-hot-toast';
import { buildDriverQueryParams } from '../../components/admin/driverFilterParams';

import {
    Table, Button, Space, Tag, Switch, Popconfirm,
    Card, Row, Col, Typography, Select, Badge
} from 'antd';
import {
    EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, FilterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const DriverList = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({
        isActive: undefined,
        isAvailable: undefined,
        isDocumentVerified: undefined,
    });

    const fetchDrivers = useCallback(async () => {
        setLoading(true);
        try {
            const params = buildDriverQueryParams(filters);
            const response = await axiosInstance.get('/drivers/allDrivers', { params });

            setDrivers(response.data.data || []);
            setPagination(prev => ({
                ...prev,
                total: response.data.count || 0,
            }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load drivers');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const handleTableChange = (pagination) => setPagination(pagination);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            isActive: undefined,
            isAvailable: undefined,
            isDocumentVerified: undefined,
        });
    };

    const handleStatusChange = async (id, statusType, value) => {
        try {
            await axiosInstance.patch(`/drivers/update/${id}`, { [statusType]: value });
            toast.success('Driver status updated');
            fetchDrivers();
        } catch {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/drivers/delete/${id}`);
            toast.success('Driver deleted successfully');
            fetchDrivers();
        } catch {
            toast.error('Failed to delete driver');
        }
    };

    const columns = [
        {
            title: 'Driver',
            dataIndex: 'firstName',
            key: 'driver',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.firstName} {record.lastName}</Text>
                    {record.isOnline && <Badge status="success" text="Online" />}
                    {record.nic_number && <Text>{record.nic_number}</Text>}
                    {record.dateOfBirth && (
                        <Text>{new Date(record.dateOfBirth).toLocaleDateString()}</Text>
                    )}
                </Space>
            ),
            width: 200,
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text>{record.email}</Text>
                    <Text type="secondary">{record.phone}</Text>
                </Space>
            ),
            width: 250,
        },
        {
            title: 'Vehicle',
            key: 'vehicle',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    {record.vehicleType && <Text>{record.vehicleType}</Text>}
                    {record.vehicleNumber && <Text type="secondary">{record.vehicleNumber}</Text>}
                </Space>
            ),
            width: 150,
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <Space size="middle">
                    <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        checked={record.isActive}
                        onChange={(checked) => handleStatusChange(record._id, 'isActive', checked)}
                    />
                    <Tag color={record.isAvailable ? 'green' : 'red'}>
                        {record.isAvailable ? 'Available' : 'Busy'}
                    </Tag>
                </Space>
            ),
            width: 150,
        },
        {
            title: 'Documents',
            key: 'documents',
            render: (_, record) => (
                <Tag color={record.isDocumentVerified ? 'green' : 'orange'}>
                    {record.isDocumentVerified ? 'Verified' : 'Pending'}
                </Tag>
            ),
            width: 120,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} type="text" />
                    <Popconfirm
                        title="Are you sure to delete this driver?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} type="text" danger />
                    </Popconfirm>
                </Space>
            ),
            width: 100,
        },
    ];

    return (
        <div className="container-fluid mt-5 pt-4">
            <Card
                title={
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4} style={{ margin: 0 }}>Driver Management</Title>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalVisible(true)}
                            >
                                Add Driver
                            </Button>
                        </Col>
                    </Row>
                }
                bordered={false}
            >
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col span={8}>
                        <Select
                            placeholder="Active Status"
                            style={{ width: '100%' }}
                            allowClear
                            value={filters.isActive}
                            onChange={(value) => handleFilterChange('isActive', value)}
                        >
                            <Option value="true">Active</Option>
                            <Option value="false">Inactive</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Select
                            placeholder="Availability"
                            style={{ width: '100%' }}
                            allowClear
                            value={filters.isAvailable}
                            onChange={(value) => handleFilterChange('isAvailable', value)}
                        >
                            <Option value="true">Available</Option>
                            <Option value="false">Unavailable</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Space>
                            <Button icon={<FilterOutlined />} onClick={fetchDrivers}>Apply Filters</Button>
                            <Button icon={<ReloadOutlined />} onClick={clearFilters}>Reset</Button>
                        </Space>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    rowKey="_id"
                    dataSource={drivers}
                    pagination={pagination}
                    loading={loading}
                    onChange={handleTableChange}
                    scroll={{ x: true }}
                    bordered
                />
            </Card>

            <CreateDriverForm
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSuccess={fetchDrivers}
            />
        </div>
    );
};

export default DriverList;
