import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const AdminUserList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const response = await axiosInstance.get('/admin/getAll');
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch admin users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="container-fluid px-4 py-3">
      <h3 className="mb-4 text-center">Admin User List</h3>

      {loading ? (
        <p>Loading...</p>
      ) : admins.length === 0 ? (
        <p>No admin users found.</p>
      ) : (
        <div className="table-responsive shadow-sm rounded border border-secondary" style={{ maxHeight: '460px', overflowY: 'auto' }}>
          <table className="table table-hover table-bordered align-middle mb-0">
            <thead className="table-dark text-center sticky-top">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Email</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Role</th>
                <th scope="col">Is Active</th>
                <th scope="col">Verified</th>
                <th scope="col">Admin Accepted</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {admins.map((admin, index) => (
                <tr key={admin.id}>
                  <th scope="row">{index + 1}</th>
                  <td className="text-start">{admin.email}</td>
                  <td>{admin.firstName}</td>
                  <td>{admin.lastName}</td>
                  <td>{admin.phone}</td>
                  <td className="text-capitalize">{admin.role}</td>
                  <td>{admin.isActive ? 'Yes' : 'No'}</td>
                  <td>{admin.isAccountVerified ? 'Yes' : 'No'}</td>
                  <td>{admin.isAdminAccepted ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserList;
