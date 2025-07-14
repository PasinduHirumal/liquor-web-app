// src/components/userList/DeleteUserButton.jsx
import React from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';
import ConfirmDialog from '../../common/ConfirmDialog';
import useAuthStore from '../../stores/adminAuthStore';

const DeleteUserButton = ({ userId, onSuccess }) => {
    const currentUser = useAuthStore((state) => state.user);

    const handleDelete = async () => {
        const confirmed = await ConfirmDialog({
            title: 'Delete User?',
            html: 'This action cannot be undone.',
            icon: 'warning',
        });

        if (!confirmed) return;

        try {
            const response = await axiosInstance.delete(`/users/delete/${userId}`);
            toast.success('User deleted successfully');
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Delete error:", err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (currentUser.role !== 'super_admin') return null;

    return (
        <button className="btn btn-sm btn-danger" onClick={handleDelete}>
            Delete
        </button>
    );
};

export default DeleteUserButton;
