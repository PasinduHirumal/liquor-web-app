import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
import AdminUserRowEditable from '../../components/admin/AdminUserRowEditable';
import { Select, Button, Space, Spin, Typography, Table, Tag } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const AdminUserList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ isAdminAccepted: '', isActive: '' });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.isAdminAccepted !== '') params.isAdminAccepted = filter.isAdminAccepted;
      else if (filter.isActive !== '') params.isActive = filter.isActive;

      const response = await axiosInstance.get('/admin/getAll', { params });
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilter((prev) =>
      field === 'isAdminAccepted'
        ? { isAdminAccepted: value, isActive: '' }
        : { isAdminAccepted: '', isActive: value }
    );
  };

  const handleDeleteSuccess = (deletedId) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== deletedId));
  };

  const handleUpdateLocal = (updatedAdmin) => {
    setAdmins((prev) =>
      prev.map((admin) => (admin.id === updatedAdmin.id ? { ...admin, ...updatedAdmin } : admin))
    );
  };

  useEffect(() => {
    fetchAdmins();
  }, [filter]);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 40,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
      width: 300,
    },
    {
      title: 'Full Name',
      render: (_, record) => `${record.firstName || ''} ${record.lastName || ''}`,
      width: 150,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: 130,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (_, admin) => (
        <AdminUserRowEditable
          admin={admin}
          onDeleteSuccess={handleDeleteSuccess}
          onUpdateLocal={handleUpdateLocal}
          part="role"
        />
      ),
      width: 140,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      render: (_, admin) => (
        <AdminUserRowEditable
          admin={admin}
          onDeleteSuccess={handleDeleteSuccess}
          onUpdateLocal={handleUpdateLocal}
          part="isActive"
        />
      ),
      width: 100,
    },
    {
      title: 'Verified',
      dataIndex: 'isAccountVerified',
      render: (val) => <Tag color={val ? 'green' : 'red'}>{val ? 'Yes' : 'No'}</Tag>,
      width: 80,
    },
    {
      title: 'Admin Accepted',
      dataIndex: 'isAdminAccepted',
      render: (_, admin) => (
        <AdminUserRowEditable
          admin={admin}
          onDeleteSuccess={handleDeleteSuccess}
          onUpdateLocal={handleUpdateLocal}
          part="isAdminAccepted"
        />
      ),
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, admin) => (
        <AdminUserRowEditable
          admin={admin}
          onDeleteSuccess={handleDeleteSuccess}
          onUpdateLocal={handleUpdateLocal}
          part="actions"
        />
      ),
      width: 100,
    },
  ];

  return (
    <div className="container-fluid mt-3">
      <Title level={3} className="text-center">Admin User List</Title>

      {/* Filters */}
      <Space wrap size="large" className="mb-4 d-flex justify-content-center">
        <Select
          placeholder="Filter by Admin Accepted"
          style={{ width: 220 }}
          value={filter.isAdminAccepted || undefined}
          onChange={(value) => handleFilterChange('isAdminAccepted', value)}
          allowClear
        >
          <Option value="true">Accepted</Option>
          <Option value="false">Not Accepted</Option>
        </Select>

        <Select
          placeholder="Filter by Active Status"
          style={{ width: 220 }}
          value={filter.isActive || undefined}
          onChange={(value) => handleFilterChange('isActive', value)}
          allowClear
        >
          <Option value="true">Active</Option>
          <Option value="false">Inactive</Option>
        </Select>

        {(filter.isAdminAccepted || filter.isActive) && (
          <Button onClick={() => setFilter({ isAdminAccepted: '', isActive: '' })}>
            Clear Filters
          </Button>
        )}
      </Space>

      {/* Table */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spin size="large" />
        </div>
      ) : admins.length === 0 ? (
        <p className="text-center fs-5 text-muted my-5">No admin users found.</p>
      ) : (
        <Table
          rowKey="id"
          dataSource={admins}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 400 }}
          bordered
          className="shadow-sm"
        />
      )}
    </div>
  );
};

export default AdminUserList;
