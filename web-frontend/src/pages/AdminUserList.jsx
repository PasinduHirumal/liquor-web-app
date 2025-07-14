import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import DeleteAdminButton from '../components/DeleteAdminButton';

// Possible roles from backend/adminRoles.js
const ROLES = ['pending', 'admin', 'super_admin'];

const AdminUserList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  // Track edits: { [adminId]: { role, isActive } }
  const [edits, setEdits] = useState({});

  // Filters: only one allowed at a time according to backend
  const [filter, setFilter] = useState({
    isAdminAccepted: '', // '' means no filter, else 'true' or 'false'
    isActive: '',
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      // Build query params based on filter state
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

  // Handle filter change: clear other filter to ensure only one at a time
  const handleFilterChange = (field, value) => {
    setFilter((prev) => {
      if (value === '') {
        // Clear this filter only
        return { ...prev, [field]: '' };
      }
      // Set selected filter, clear the other
      if (field === 'isAdminAccepted') {
        return { isAdminAccepted: value, isActive: '' };
      } else {
        return { isAdminAccepted: '', isActive: value };
      }
    });
  };

  // When field changes, store in edits
  const handleFieldChange = (adminId, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [adminId]: {
        ...prev[adminId],
        [field]: value,
      },
    }));
  };

  // Update admin via PATCH call
  const handleUpdate = async (adminId) => {
    if (!edits[adminId]) return;

    try {
      const updatedData = edits[adminId];
      const response = await axiosInstance.patch(`/admin/update/${adminId}`, updatedData);
      toast.success('Admin updated successfully');

      // Update admins list locally
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === adminId ? { ...admin, ...response.data.data } : admin
        )
      );

      // Clear edits for this admin
      setEdits((prev) => {
        const copy = { ...prev };
        delete copy[adminId];
        return copy;
      });
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to update admin');
    }
  };

  const handleDeleteSuccess = (deletedId) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== deletedId));
    // Also clear any pending edits for that admin
    setEdits((prev) => {
      const copy = { ...prev };
      delete copy[deletedId];
      return copy;
    });
  };

  useEffect(() => {
    fetchAdmins();
  }, [filter]); // refetch when filter changes

  return (
    <div className="container-fluid px-4 py-3">
      <h3 className="mb-4 text-center">Admin User List</h3>

      {/* Filters */}
      <div className="mb-3 d-flex justify-content-center gap-4 flex-wrap">
        <div>
          <label htmlFor="filterAdminAccepted" className="form-label me-2">
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
          <label htmlFor="filterIsActive" className="form-label me-2">
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
          className="btn btn-sm btn-secondary"
          onClick={() => setFilter({ isAdminAccepted: '', isActive: '' })}
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : admins.length === 0 ? (
        <p>No admin users found.</p>
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
              {admins.map((admin, index) => {
                const adminEdits = edits[admin.id] || {};
                // Compute if there's any change in editable fields
                const hasChanges =
                  (adminEdits.role && adminEdits.role !== admin.role) ||
                  (typeof adminEdits.isActive === 'boolean' && adminEdits.isActive !== admin.isActive);

                return (
                  <tr key={admin.id}>
                    <th scope="row">{index + 1}</th>
                    <td className="text-start">{admin.email}</td>
                    <td className="text-start">
                      {admin.firstName} {admin.lastName}
                    </td>
                    <td>{admin.phone}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={adminEdits.role ?? admin.role}
                        onChange={(e) => handleFieldChange(admin.id, 'role', e.target.value)}
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={adminEdits.isActive ?? admin.isActive}
                        onChange={(e) => handleFieldChange(admin.id, 'isActive', e.target.checked)}
                      />
                    </td>
                    <td>{admin.isAccountVerified ? 'Yes' : 'No'}</td>
                    <td>{admin.isAdminAccepted ? 'Yes' : 'No'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        disabled={!hasChanges}
                        onClick={() => handleUpdate(admin.id)}
                        title={hasChanges ? 'Update admin' : 'No changes to update'}
                      >
                        Update
                      </button>
                      <DeleteAdminButton adminId={admin.id} onSuccess={handleDeleteSuccess} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
