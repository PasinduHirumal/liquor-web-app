import React, { useEffect, useState } from 'react';
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
        <div className="d-flex justify-content-center mt-5 pt-4">
            <div className="container">
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">User List</h2>

                        {loading ? (
                            <div className="text-center my-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2">Loading users...</p>
                            </div>
                        ) : (
                            <>
                                {filterInfo && (
                                    <p className="text-center text-muted mb-3">
                                        Filtered by: <strong>{filterInfo}</strong>
                                    </p>
                                )}
                                {users.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover text-center align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Role</th>
                                                    <th scope="col">Active</th>
                                                    <th scope="col">Account Completed</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user, index) => (
                                                    <tr key={user.id || index}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{user.firstName} {user.lastName}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.role}</td>
                                                        <td>{user.isActive ? '✅' : '❌'}</td>
                                                        <td>{user.isAccountCompleted ? '✅' : '❌'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center my-4">No users found.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserList;
