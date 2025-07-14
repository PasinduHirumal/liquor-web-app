import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import UserFilter from '../components/userList/UserFilter';
import DeleteUserButton from '../components/userList/DeleteUserButton';

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

    return (
        <div className="d-flex justify-content-center mt-5 pt-4">
            <div className="container" style={{ maxWidth: 900 }}>
                <div className="card border-0">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">User List</h2>

                        <UserFilter
                            filter={filter}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                        />

                        {loading && (
                            <div className="text-center my-4" role="status" aria-live="polite">
                                <div className="spinner-border text-primary" />
                                <p className="mt-2">Loading users...</p>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="alert alert-danger text-center" role="alert">
                                {error}
                            </div>
                        )}

                        {!loading && !error && (
                            <>
                                {filterInfo && (
                                    <p className="text-center text-muted mb-3">
                                        Filtered by: <strong>{filterInfo}</strong>
                                    </p>
                                )}

                                {users.length > 0 ? (
                                    <div className="table-responsive border rounded-3" style={{ maxHeight: '360px', overflowY: 'auto' }}>
                                        <table className="table table-bordered table-hover text-center align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Role</th>
                                                    <th scope="col">Active</th>
                                                    <th scope="col">Account Completed</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user, index) => {
                                                    const key = user.id || user._id || index;
                                                    return (
                                                        <tr key={key}>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>{user.firstName || ''} {user.lastName || ''}</td>
                                                            <td>{user.email || '-'}</td>
                                                            <td>{user.role || '-'}</td>
                                                            <td>{user.isActive ? '✅' : '❌'}</td>
                                                            <td>{user.isAccountCompleted ? '✅' : '❌'}</td>
                                                            <td>
                                                                <DeleteUserButton
                                                                    userId={user.user_id || user.user_id}
                                                                    onSuccess={fetchUsers}
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
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
