import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Table, Tag, Space, Spin, Alert, Typography } from 'antd';
import { axiosInstance } from '../../lib/axios';
import UserFilter from '../../components/admin/UserFilter';
import DeleteUserButton from '../../components/admin/buttons/DeleteUserButton';

const { Title, Text } = Typography;

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [filterInfo, setFilterInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState({ isActive: '', isAccountCompleted: '' });

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (filter.isActive !== '') params.isActive = filter.isActive;
            if (filter.isAccountCompleted !== '') params.isAccountCompleted = filter.isAccountCompleted;

            const response = await axiosInstance.get('/users/getAll', { params });

            setUsers(response.data.data || []);
            setFilterInfo(response.data.filtered || null);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to load users');
            toast.error(err.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (value !== '') {
            setFilter({
                [name]: value,
                ...(name === 'isActive' ? { isAccountCompleted: '' } : { isActive: '' }),
            });
        } else {
            setFilter({ isActive: '', isAccountCompleted: '' });
        }
    };

    const clearFilters = () => setFilter({ isActive: '', isAccountCompleted: '' });

    const handleUserDeleted = (deletedUserId) => {
        setUsers((prevUsers) =>
            prevUsers.filter((u) => (u.id || u._id || u.user_id) !== deletedUserId)
        );
    };

    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => index + 1,
            width: 40,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.firstName || ''} {record.lastName || ''}</Text>
                    {record.nic_number && <Text>{record.nic_number}</Text>}
                    {record.dateOfBirth && (
                        <Text>{new Date(record.dateOfBirth).toLocaleDateString()}</Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.email}</Text>
                    {record.phone && <Text>{record.phone}</Text>}
                </Space>
            ),
            width: 300,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => <Tag color="blue">{role || '-'}</Tag>,
            width: 70,
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) =>
                isActive ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
            width: 80,
        },
        {
            title: 'Account Completed',
            dataIndex: 'isAccountCompleted',
            key: 'isAccountCompleted',
            render: (isCompleted) =>
                isCompleted ? <Tag color="green">Yes</Tag> : <Tag color="volcano">No</Tag>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                const userId = record.user_id || record.id || record._id;
                return (
                    <Space>
                        <DeleteUserButton userId={userId} onSuccess={() => handleUserDeleted(userId)} />
                    </Space>
                );
            },
            width: 100,
        },
    ];

    return (
        <div className="d-flex justify-content-center mt-3">
            <div className="container" style={{ maxWidth: 1000 }}>
                <div className="mb-4 text-center">
                    <Title level={2}>User List</Title>
                </div>

                <UserFilter
                    filter={filter}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                />

                {loading ? (
                    <div className="text-center my-4">
                        <Spin tip="Loading users..." size="large" />
                    </div>
                ) : error ? (
                    <Alert message="Error" description={error} type="error" showIcon className="my-4" />
                ) : (
                    <>
                        {filterInfo && (
                            <Text type="secondary" className="d-block text-center mb-3">
                                Filtered by: <strong>{filterInfo}</strong>
                            </Text>
                        )}
                        <Table
                            rowKey={(record) => record.user_id || record.id || record._id}
                            columns={columns}
                            dataSource={users}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 'max-content' }}
                            bordered
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default UserList;
