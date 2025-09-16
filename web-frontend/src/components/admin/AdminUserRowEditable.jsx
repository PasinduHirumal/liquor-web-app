import React, { useEffect, useState } from "react";
import { Select, Switch } from "antd";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import DeleteAdminButton from "./buttons/DeleteAdminButton";

const ROLES = ["pending", "admin", "super_admin"];

const AdminUserRowEditable = ({ admin, onDeleteSuccess, onUpdateLocal, part }) => {
    const [role, setRole] = useState(admin.role);
    const [isActive, setIsActive] = useState(admin.isActive);
    const [isAdminAccepted, setIsAdminAccepted] = useState(admin.isAdminAccepted);
    const [whereHouseId, setWhereHouseId] = useState(admin.where_house_id?.id || "");
    const [warehouses, setWarehouses] = useState([]);
    const [saving, setSaving] = useState(false);

    const fetchWarehouses = async () => {
        try {
            const res = await axiosInstance.get("/system/details");
            setWarehouses(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch warehouses:", error);
            toast.error("Failed to load warehouse list");
        }
    };

    useEffect(() => {
        if (part === "where_house_id") {
            fetchWarehouses();
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            let shouldUpdate = false;

            switch (part) {
                case "role":
                    shouldUpdate = role !== admin.role;
                    break;
                case "isActive":
                    shouldUpdate = isActive !== admin.isActive;
                    break;
                case "isAdminAccepted":
                    shouldUpdate = isAdminAccepted !== admin.isAdminAccepted;
                    break;
                case "where_house_id":
                    shouldUpdate = whereHouseId !== admin.where_house_id?.id;
                    break;
                default:
                    break;
            }

            if (shouldUpdate) {
                handleUpdate();
            }
        }, 700);

        return () => clearTimeout(timer);
    }, [role, isActive, isAdminAccepted, whereHouseId]);

    const handleUpdate = async () => {
        setSaving(true);
        try {
            let updatedData = {};

            switch (part) {
                case "role":
                    updatedData = { role };
                    break;
                case "isActive":
                    updatedData = { isActive };
                    break;
                case "isAdminAccepted":
                    updatedData = { isAdminAccepted };
                    break;
                case "where_house_id":
                    updatedData = { where_house_id: whereHouseId };
                    break;
                default:
                    return;
            }

            const res = await axiosInstance.patch(`/admin/update/${admin.id}`, updatedData);
            toast.success("Admin updated successfully");
            onUpdateLocal(res.data.data);
        } catch (error) {
            console.error("Update failed:", error);

            const backendData = error?.response?.data;

            if (backendData?.errors?.length) {
                backendData.errors.forEach((err) => {
                    toast.error(`${err.field}: ${err.message}`);
                });
            } else if (backendData?.message) {
                toast.error(backendData.message);
            } else {
                toast.error("Failed to update admin");
            }

            // Revert state on failure
            setRole(admin.role);
            setIsActive(admin.isActive);
            setIsAdminAccepted(admin.isAdminAccepted);
            setWhereHouseId(admin.where_house_id?.id || "");
        } finally {
            setSaving(false);
        }
    };

    if (part === "role") {
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

    if (part === "isActive") {
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

    if (part === "isAdminAccepted") {
        return (
            <Switch
                checked={isAdminAccepted}
                onChange={setIsAdminAccepted}
                loading={saving}
                checkedChildren="Yes"
                unCheckedChildren="No"
            />
        );
    }

    if (part === "where_house_id") {
        return (
            <Select
                value={whereHouseId}
                onChange={setWhereHouseId}
                size="small"
                style={{ width: 160 }}
                loading={warehouses.length === 0}
            >
                {warehouses.map((wh) => (
                    <Select.Option key={wh.id} value={wh.id}>
                        {wh.where_house_name}
                    </Select.Option>
                ))}
            </Select>
        );
    }

    if (part === "actions") {
        return (
            <div className="d-flex justify-content-center">
                <DeleteAdminButton adminId={admin.id} onSuccess={onDeleteSuccess} />
            </div>
        );
    }

    return null;
};

export default AdminUserRowEditable;
