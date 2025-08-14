import React, { useState } from 'react';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../../lib/axios';
import toast from 'react-hot-toast';
import ConfirmDeleteDialog from '../../../common/ConfirmDeleteDialog';

const DeleteDriverButton = ({ driverId, onDeleted }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        const confirmed = await ConfirmDeleteDialog({
            title: 'Delete Driver?',
            html: 'This action cannot be undone.',
            icon: 'warning'
        });

        if (!confirmed) return;

        setLoading(true);
        try {
            await axiosInstance.delete(`/drivers/delete/${driverId}`, { withCredentials: true });
            toast.success('Driver deleted successfully');
            if (onDeleted) onDeleted();
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to delete driver');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            icon={<DeleteOutlined style={{ fontSize: '18px' }} />}
            type="text"
            danger
            onClick={handleDelete}
            loading={loading}
        />
    );
};

export default DeleteDriverButton;
