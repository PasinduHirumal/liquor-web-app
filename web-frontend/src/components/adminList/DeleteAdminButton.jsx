import React, { useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../common/ConfirmDialog';

const DeleteAdminButton = ({ adminId, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        const confirmed = await ConfirmDialog({
            title: 'Confirm Deletion',
            html: 'This admin will be permanently removed. You cannot undo this action!',
        });

        if (!confirmed) return;

        setIsLoading(true);

        try {
            await axiosInstance.delete(`/admin/delete/${adminId}`);
            toast.success('Admin deleted successfully');
            onSuccess(adminId);
        } catch (error) {
            console.error('Error deleting admin:', error);
            toast.error(error?.response?.data?.message || 'Failed to delete admin');
        } finally {
            setIsLoading(false);
        }
    };

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

export default DeleteAdminButton;
