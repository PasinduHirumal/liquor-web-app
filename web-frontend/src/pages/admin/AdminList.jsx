import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
import AdminUserRowEditable from '../../components/admin/AdminUserRowEditable';

const AdminUserList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    isAdminAccepted: '',
    isActive: '',
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.isAdminAccepted !== '') {
        params.isAdminAccepted = filter.isAdminAccepted;
      } else if (filter.isActive !== '') {
        params.isActive = filter.isActive;
      }

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
    setFilter((prev) => {
      if (value === '') {
        return { ...prev, [field]: '' };
      }
      if (field === 'isAdminAccepted') {
        return { isAdminAccepted: value, isActive: '' };
      } else {
        return { isAdminAccepted: '', isActive: value };
      }
    });
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

  return (
    <div className="container-fluid mt-5 px-4 py-4">
      <h3 className="mb-4 text-center">Admin User List</h3>

      {/* Filters */}
      <div className="mb-4 d-flex justify-content-center gap-4 flex-wrap">
        <div>
          <label htmlFor="filterAdminAccepted" className="form-label me-2 fw-semibold">
            Filter by Admin Accepted:
          </label>
          <select
            id="filterAdminAccepted"
            className="form-select form-select-sm d-inline-block w-auto"
            value={filter.isAdminAccepted}
            onChange={(e) => handleFilterChange('isAdminAccepted', e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Accepted</option>
            <option value="false">Not Accepted</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterIsActive" className="form-label me-2 fw-semibold">
            Filter by Active Status:
          </label>
          <select
            id="filterIsActive"
            className="form-select form-select-sm d-inline-block w-auto"
            value={filter.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <button
          className="btn btn-sm btn-secondary align-self-end"
          onClick={() => setFilter({ isAdminAccepted: '', isActive: '' })}
          title="Clear filters"
        >
          Clear Filters
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status" aria-label="Loading">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : admins.length === 0 ? (
        <p className="text-center fs-5 text-muted my-5">No admin users found.</p>
      ) : (
        <div
          className="table-responsive shadow-sm rounded border border-secondary"
          style={{ maxHeight: '460px', overflowY: 'auto' }}
        >
          <table className="table table-hover table-bordered align-middle mb-0">
            <thead className="table-dark text-center sticky-top">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Is Active</th>
                <th>Verified</th>
                <th>Admin Accepted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {admins.map((admin, index) => (
                <AdminUserRowEditable
                  key={admin.id}
                  admin={{ ...admin, index: index + 1 }}
                  onDeleteSuccess={handleDeleteSuccess}
                  onUpdateLocal={handleUpdateLocal}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
