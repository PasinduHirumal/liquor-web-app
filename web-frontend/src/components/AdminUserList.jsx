import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../lib/axios';

const AdminUserList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = async () => {
    try {
      const response = await axiosInstance.get('/admin/getAll', {
        withCredentials: true
      });
      setAdmins(response.data.admins || []);
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
    <>
      <div className="container mt-4">
        <h3>Admin Users</h3>
        {loading ? (
          <p>Loading...</p>
        ) : admins.length === 0 ? (
          <p>No admin users found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped mt-3">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Is Active</th>
                  <th>Verified</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin, index) => (
                  <tr key={admin._id}>
                    <td>{index + 1}</td>
                    <td>{admin.email}</td>
                    <td>{admin.firstName}</td>
                    <td>{admin.lastName}</td>
                    <td>{admin.phone}</td>
                    <td>{admin.role}</td>
                    <td>{admin.isActive ? 'Yes' : 'No'}</td>
                    <td>{admin.isAccountVerified ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUserList;
