import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filterInfo, setFilterInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/getAll');
      setUsers(response.data.data);
      setFilterInfo(response.data.filtered);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">User List</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          {filterInfo && (
            <p className="mb-2 text-sm text-gray-500">Filtered by: {filterInfo}</p>
          )}
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">#</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Role</th>
                    <th className="py-2 px-4 border">Active</th>
                    <th className="py-2 px-4 border">Account Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id || index} className="text-center">
                      <td className="py-2 px-4 border">{index + 1}</td>
                      <td className="py-2 px-4 border">{user.firstName} {user.lastName}</td>
                      <td className="py-2 px-4 border">{user.email}</td>
                      <td className="py-2 px-4 border">{user.role}</td>
                      <td className="py-2 px-4 border">{user.isActive ? '✅' : '❌'}</td>
                      <td className="py-2 px-4 border">{user.isAccountCompleted ? '✅' : '❌'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No users found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default UserList;
