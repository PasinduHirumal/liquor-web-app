import React, { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../lib/axios';
import { Table, Button, message, Space, Tag, Switch, Popconfirm, Card, Row, Col, Typography, Select, Badge } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    FilterOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const DriverList = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [filters, setFilters] = useState({
        isActive: undefined,
        isAvailable: undefined,
        isDocumentVerified: undefined
    });

    const fetchDrivers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: pagination.current,
                pageSize: pagination.pageSize,
                ...filters
            };

            const response = await axiosInstance.get('/drivers/allDrivers', { params });

            setDrivers(response.data.data || []);
            setPagination(prev => ({
                ...prev,
                total: response.data.count || 0,
            }));
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to load drivers');
            message.error(err.response?.data?.message || 'Failed to load drivers');
        } finally {
            setLoading(false);
        }
    }, [pagination.current, pagination.pageSize, filters]);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const handleTableChange = (pagination, filters) => {
        setPagination(pagination);
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            isActive: undefined,
            isAvailable: undefined,
            isDocumentVerified: undefined
        });
    };

    const handleStatusChange = async (id, statusType, value) => {
        try {
            await axiosInstance.patch(`/drivers/update/${id}`, { [statusType]: value });
            message.success('Driver status updated');
            fetchDrivers();
        } catch (error) {
            message.error('Failed to update status');
            console.error('Update status error:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/drivers/delete/${id}`);
            message.success('Driver deleted successfully');
            fetchDrivers();
        } catch (error) {
            message.error('Failed to delete driver');
            console.error('Delete driver error:', error);
        }
    };

    const columns = [
        {
            title: 'Driver',
            dataIndex: 'firstName',
            key: 'driver',
            render: (text, record) => (
                <Space>
                    <Text strong>{record.firstName} {record.lastName}</Text>
                    {record.isOnline && <Badge status="success" text="Online" />}
                </Space>
            ),
            sorter: true,
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
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false },
            ],
            onFilter: (value, record) => record.isActive === value,
        },
        {
            title: 'Documents',
            key: 'documents',
            render: (_, record) => (
                <Tag color={record.isDocumentVerified ? 'green' : 'orange'}>
                    {record.isDocumentVerified ? 'Verified' : 'Pending'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => console.log('View', record._id)}
                        type="text"
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => console.log('Edit', record._id)}
                        type="text"
                    />
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
                                onClick={() => console.log('Add new driver')}
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
                            <Option value={true}>Active</Option>
                            <Option value={false}>Inactive</Option>
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
                            <Option value={true}>Available</Option>
                            <Option value={false}>Unavailable</Option>
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Space>
                            <Button
                                icon={<FilterOutlined />}
                                onClick={fetchDrivers}
                            >
                                Apply Filters
                            </Button>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={clearFilters}
                            >
                                Reset
                            </Button>
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
        </div>
    );
};

export default DriverList;