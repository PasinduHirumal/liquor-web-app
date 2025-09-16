import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../../lib/axios';
import ConfirmDeleteDialog from '../../../common/ConfirmDeleteDialog';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const DeleteAdminButton = ({ adminId, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        const confirmed = await ConfirmDeleteDialog({
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
        <Button
            danger
            size="small"
            className='border-0 shadow-none'
            icon={<DeleteOutlined />}
            loading={isLoading}
            onClick={handleDelete}
        />
    );
};

export default DeleteAdminButton;
