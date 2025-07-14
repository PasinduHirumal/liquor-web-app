import React from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';

const DeleteUserButton = ({ userId, onSuccess }) => {
    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            await axiosInstance.delete(`/users/delete/${userId}`);
            toast.success('User deleted successfully');
            onSuccess();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        }
    };

    return (
        <button className="btn btn-sm btn-danger" onClick={handleDelete}>
            Delete
        </button>
    );
};

export default DeleteUserButton;
