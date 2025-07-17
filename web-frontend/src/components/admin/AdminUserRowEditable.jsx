import React, { useEffect, useState } from 'react';
import { Select, Switch } from 'antd';
import toast from 'react-hot-toast';
import { axiosInstance } from '../../lib/axios';
import DeleteAdminButton from "./buttons/DeleteAdminButton";

const ROLES = ['pending', 'admin', 'super_admin'];

const AdminUserRowEditable = ({ admin, onDeleteSuccess, onUpdateLocal, part }) => {
    const [role, setRole] = useState(admin.role);
    const [isActive, setIsActive] = useState(admin.isActive);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (role !== admin.role || isActive !== admin.isActive) {
                handleUpdate();
            }
        }, 700);
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
            setRole(admin.role);
            setIsActive(admin.isActive);
        } finally {
            setSaving(false);
        }
    };

    if (part === 'role') {
        return (
            <Select
                value={role}
                onChange={setRole}
                size="small"
                disabled={saving}
                style={{ width: 120 }}
            >
                {ROLES.map((r) => (
                    <Select.Option key={r} value={r}>
                        {r}
                    </Select.Option>
                ))}
            </Select>
        );
    }

    if (part === 'isActive') {
        return (
            <Switch
                checked={isActive}
                onChange={setIsActive}
                loading={saving}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
            />
        );
    }

    if (part === 'actions') {
        return (
            <div className="d-flex justify-content-center">
                <DeleteAdminButton adminId={admin.id} onSuccess={onDeleteSuccess} />
            </div>
        );
    }

    return null;
};

export default AdminUserRowEditable;
