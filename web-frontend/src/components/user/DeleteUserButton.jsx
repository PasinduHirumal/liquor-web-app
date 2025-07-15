import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';
import ConfirmDialog from '../../common/ConfirmDialog';
import useAuthStore from '../../stores/adminAuthStore';

const DeleteUserButton = ({ userId, onSuccess }) => {
    const currentUser = useAuthStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        const confirmed = await ConfirmDialog({
            title: 'Delete User?',
            html: 'This action cannot be undone.',
            icon: 'warning',
        });

        if (!confirmed) return;

        setIsLoading(true);
        try {
            await axiosInstance.delete(`/users/delete/${userId}`);
            toast.success('User deleted successfully');
            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Delete error:", err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setIsLoading(false);
        }
    };

    if (currentUser.role !== 'super_admin') return null;

    return (
        <button
            className="btn btn-sm btn-danger d-flex justify-content-center align-items-center"
            onClick={handleDelete}
            disabled={isLoading}
            style={{ width: '70px', height: '32px' }}
        >
            {isLoading ? (
                <span
                    className="spinner-border spinner-border-sm text-light"
                    role="status"
                    aria-hidden="true"
                ></span>
            ) : (
                'Delete'
            )}
        </button>
    );
};

export default DeleteUserButton;
