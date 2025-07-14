import React from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const DeleteAdminButton = ({ adminId, onSuccess }) => {
  const MySwal = withReactContent(Swal);

  const handleDelete = async () => {
    const result = await MySwal.fire({
      title: '<strong>Confirm Deletion</strong>',
      html: '<small>This admin will be permanently removed. You cannot undo this action!</small>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal2-small-popup',
        title: 'swal2-title-sm',
        htmlContainer: 'swal2-html-sm',
        confirmButton: 'swal2-confirm-sm',
        cancelButton: 'swal2-cancel-sm',
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

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
