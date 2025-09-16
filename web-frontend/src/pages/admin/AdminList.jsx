import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
import AdminUserRowEditable from '../../components/admin/AdminUserRowEditable';
import { Select, Button, Space, Spin, Typography, Table, Tag } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const AdminUserList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState([]);
  const [filter, setFilter] = useState({
    isAdminAccepted: '',
    isActive: '',
    where_house_id: ''
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.isAdminAccepted !== '') params.isAdminAccepted = filter.isAdminAccepted;
      if (filter.isActive !== '') params.isActive = filter.isActive;
      if (filter.where_house_id !== '') params.where_house_id = filter.where_house_id;

      const response = await axiosInstance.get('/admin/getAll', { params });
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch admin users');
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axiosInstance.get('/system/details');
      setWarehouses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      toast.error('Failed to fetch warehouses');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilter(prev => ({
      ...prev,
      [field]: value
    }));
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
    fetchWarehouses();
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
      render: (text) => <span className="font-medium">{text}</span>,
      width: 260,
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
      title: 'Warehouse',
      dataIndex: 'where_house_id',
      render: (_, admin) => (
        <AdminUserRowEditable
          admin={admin}
          onDeleteSuccess={handleDeleteSuccess}
          onUpdateLocal={handleUpdateLocal}
          part="where_house_id"
        />
      ),
      width: 200,
      filters: warehouses.map(wh => ({
        text: wh.where_house_name,
        value: wh.id,
      })),
      onFilter: (value, record) => record.where_house_id === value,
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
      width: 150,
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
      render: (val) => (
        <Tag color={val ? 'green' : 'red'}>
          {val ? 'Yes' : 'No'}
        </Tag>
      ),
      width: 85,
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
    <div className="w-full p-4 bg-white shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Left side - Title */}
          <Title
            level={3}
            className="!mb-0 text-gray-800 font-semibold text-xl md:text-2xl"
          >
            Admin User List
          </Title>

          {/* Right side - Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <Select
              placeholder="Filter by Active Status"
              style={{ width: 200 }}
              value={filter.isActive || undefined}
              onChange={(value) => handleFilterChange('isActive', value)}
              allowClear
            >
              <Option value="true">Active</Option>
              <Option value="false">Inactive</Option>
            </Select>

            <Select
              placeholder="Filter by Admin Accepted"
              style={{ width: 200 }}
              value={filter.isAdminAccepted || undefined}
              onChange={(value) => handleFilterChange('isAdminAccepted', value)}
              allowClear
            >
              <Option value="true">Accepted</Option>
              <Option value="false">Not Accepted</Option>
            </Select>

            {(filter.isAdminAccepted || filter.isActive) && (
              <Button onClick={() => setFilter({ isAdminAccepted: '', isActive: '' })}>
                Clear Filters
              </Button>
            )}

            <Button
              icon={<ReloadOutlined />}
              onClick={fetchAdmins}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center my-10">
          <Spin size="large" />
        </div>
      ) : admins.length === 0 ? (
        <p className="text-center text-lg text-gray-500 my-10">No admin users found.</p>
      ) : (
        <Table
          rowKey="id"
          dataSource={admins}
          columns={columns}
          pagination={{ pageSize: 10 }}
          scroll={{ y: 400 }}
          bordered
          className="shadow-sm rounded-md"
        />
      )}
    </div>
  );
};

export default AdminUserList;
