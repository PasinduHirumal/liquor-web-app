import React from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const DeleteAdminButton = ({ adminId, onSuccess }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this admin?');
    if (!confirmDelete) return;

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
