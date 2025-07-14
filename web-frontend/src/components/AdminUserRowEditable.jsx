import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import DeleteAdminButton from './DeleteAdminButton';

const ROLES = ['pending', 'admin', 'super_admin'];

const AdminUserRowEditable = ({ admin, onDeleteSuccess, onUpdateLocal }) => {
    
    const [role, setRole] = useState(admin.role);
    const [isActive, setIsActive] = useState(admin.isActive);
    const [saving, setSaving] = useState(false);

    // Debounce update to avoid flooding backend on every keystroke/change
    useEffect(() => {
        const timer = setTimeout(() => {
            if (role !== admin.role || isActive !== admin.isActive) {
                handleUpdate();
            }
        }, 800);

        return () => clearTimeout(timer);
    }, [role, isActive]);

    const handleUpdate = async () => {
        setSaving(true);
        try {
            const updatedData = { role, isActive };
            const response = await axiosInstance.patch(`/admin/update/${admin.id}`, updatedData);
            toast.success('Admin updated successfully');

            onUpdateLocal(response.data.data);
        } catch (error) {
            console.error('Update failed:', error);
            toast.error(error?.response?.data?.message || 'Failed to update admin');
            // Reset local state on error to current admin values
            setRole(admin.role);
            setIsActive(admin.isActive);
        } finally {
            setSaving(false);
        }
    };

    return (
        <tr>
            <th scope="row">{admin.index}</th>
            <td className="text-start">{admin.email}</td>
            <td className="text-start">
                {admin.firstName} {admin.lastName}
            </td>
            <td>{admin.phone}</td>
            <td>
                <select
                    className="form-select form-select-sm"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={saving}
                >
                    {ROLES.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
            </td>
            <td>
                <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    disabled={saving}
                />
            </td>
            <td>{admin.isAccountVerified ? 'Yes' : 'No'}</td>
            <td>{admin.isAdminAccepted ? 'Yes' : 'No'}</td>
            <td>
                {/* Delete button */}
                <DeleteAdminButton adminId={admin.id} onSuccess={onDeleteSuccess} />
            </td>
        </tr>
    );
};

export default AdminUserRowEditable;
