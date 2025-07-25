import React, { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../lib/axios';
import CreateDriverForm from '../../components/admin/forms/CreateDriverForm';
import toast from 'react-hot-toast';
import DeleteDriverButton from '../../components/admin/buttons/DeleteDriverButton';
import {
    Table, Button, Space, Tag, Switch,
    Card, Row, Col, Typography, Select, Badge, Input
} from 'antd';
import {
    EditOutlined, PlusOutlined, ReloadOutlined, FilterOutlined, SearchOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const DriverList = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100']
    });

    const [filters, setFilters] = useState({
        isActive: undefined,
        isAvailable: undefined,
        isOnline: undefined,
        isDocumentVerified: undefined,
        search: '',
    });

    const fetchDrivers = useCallback(async () => {
        setLoading(true);
        try {
            // Convert filters to query parameters
            const params = {
                isActive: filters.isActive,
                isAvailable: filters.isAvailable,
                isOnline: filters.isOnline,
                isDocumentVerified: filters.isDocumentVerified,
                search: filters.search,
                page: pagination.current,
                limit: pagination.pageSize
            };

            // Remove undefined parameters
            Object.keys(params).forEach(key => {
                if (params[key] === undefined || params[key] === '') {
                    delete params[key];
                }
            });

            const response = await axiosInstance.get('/drivers/allDrivers', { params });

            setDrivers(response.data.data || []);
            setPagination(prev => ({
                ...prev,
                total: response.data.count || 0,
            }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load drivers');
            console.error('Error fetching drivers:', err);
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.current, pagination.pageSize]);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    const handleFilterChange = (name, value) => {
        setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page when filters change
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        setPagination(prev => ({ ...prev, current: 1 }));
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const clearFilters = () => {
        setPagination(prev => ({ ...prev, current: 1 }));
        setFilters({
            isActive: undefined,
            isAvailable: undefined,
            isOnline: undefined,
            isDocumentVerified: undefined,
            search: '',
        });
    };

    const handleStatusChange = async (id, statusType, value) => {
        try {
            await axiosInstance.patch(`/drivers/update/${id}`, { [statusType]: value });
            toast.success('Driver status updated successfully');
            fetchDrivers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
            console.error('Error updating driver status:', err);
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
                    {record.isOnline ? (
                        <Badge status="success" text="Online" />
                    ) : (
                        <Badge status="default" text="Offline" />
                    )}
                    {record.nic_number && <Text type="secondary">NIC: {record.nic_number}</Text>}
                    {record.dateOfBirth && (
                        <Text type="secondary">DOB: {new Date(record.dateOfBirth).toLocaleDateString()}</Text>
                    )}
                </Space>
            ),
            width: 200,
            fixed: 'left',
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text>{record.email}</Text>
                    <Text>{record.phone}</Text>
                    <Text type="secondary">{record.city}</Text>
                </Space>
            ),
            width: 250,
        },
        {
            title: 'Vehicle',
            key: 'vehicle',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    {record.vehicleType && <Text strong>{record.vehicleType}</Text>}
                    {record.vehicleModel && <Text>{record.vehicleModel}</Text>}
                    {record.vehicleNumber && (
                        <Tag color="blue">{record.vehicleNumber}</Tag>
                    )}
                </Space>
            ),
            width: 200,
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <Space direction="vertical" size="small">
                    <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        checked={record.isActive}
                        onChange={(checked) => handleStatusChange(record.id, 'isActive', checked)}
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
                <Space direction="vertical">
                    <Tag color={record.isDocumentVerified ? 'green' : 'orange'}>
                        {record.isDocumentVerified ? 'Verified' : 'Pending'}
                    </Tag>
                    {record.backgroundCheckStatus && (
                        <Tag color={
                            record.backgroundCheckStatus === 'approved' ? 'green' :
                                record.backgroundCheckStatus === 'pending' ? 'orange' : 'red'
                        }>
                            {record.backgroundCheckStatus}
                        </Tag>
                    )}
                </Space>
            ),
            width: 150,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <DeleteDriverButton
                        driverId={record.id}
                        onDeleted={fetchDrivers}
                    />
                    <Button
                        icon={<EditOutlined />}
                        type="text"
                        onClick={() => console.log('Edit', record.id)}
                    />
                </Space>
            ),
            width: 120,
            fixed: 'right',
        },
    ];

    return (
        <div className="container-fluid mt-3">
            <Card
                title={
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Title level={4} style={{ margin: 0 }}>Driver Management</Title>
                            <Text type="secondary">Total: {pagination.total} drivers</Text>
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
            >
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                    <Col span={6}>
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
                    <Col span={6}>
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
                    <Col span={6}>
                        <Select
                            placeholder="Online Status"
                            style={{ width: '100%' }}
                            allowClear
                            value={filters.isOnline}
                            onChange={(value) => handleFilterChange('isOnline', value)}
                        >
                            <Option value="true">Online</Option>
                            <Option value="false">Offline</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Document Status"
                            style={{ width: '100%' }}
                            allowClear
                            value={filters.isDocumentVerified}
                            onChange={(value) => handleFilterChange('isDocumentVerified', value)}
                        >
                            <Option value="true">Verified</Option>
                            <Option value="false">Not Verified</Option>
                        </Select>
                    </Col>
                </Row>

                <Row justify="end" style={{ marginBottom: 16 }}>
                    <Col>
                        <Space>
                            <Button
                                type="primary"
                                icon={<FilterOutlined />}
                                onClick={fetchDrivers}
                            >
                                Apply Filters
                            </Button>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={clearFilters}
                            >
                                Reset All
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    rowKey="id"
                    dataSource={drivers}
                    pagination={pagination}
                    loading={loading}
                    onChange={handleTableChange}
                    scroll={{ x: 1300 }}
                    bordered
                    size="middle"
                    style={{ marginTop: 16 }}
                />
            </Card>

            <CreateDriverForm
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSuccess={() => {
                    fetchDrivers();
                    setIsModalVisible(false);
                }}
            />
        </div>
    );
};

export default DriverList;