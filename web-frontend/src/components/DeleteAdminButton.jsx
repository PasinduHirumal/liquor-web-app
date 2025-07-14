import React from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import ConfirmDialog from '../common/ConfirmDialog';

const DeleteAdminButton = ({ adminId, onSuccess }) => {
    const handleDelete = async () => {
        const confirmed = await ConfirmDialog({
            title: 'Confirm Deletion',
            html: 'This admin will be permanently removed. You cannot undo this action!',
        });

        if (!confirmed) return;

        try {
            await axiosInstance.delete(`/admin/delete/${adminId}`);
            toast.success('Admin deleted successfully');
            onSuccess(adminId);
        } catch (error) {
            console.error('Error deleting admin:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete admin');
        }
    };

    return (
        <button className="btn btn-sm btn-danger" onClick={handleDelete}>
            Delete
        </button>
    );
};

export default DeleteAdminButton;
