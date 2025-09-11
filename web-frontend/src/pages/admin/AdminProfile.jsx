import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FaUserCircle } from "react-icons/fa";
import {
    Spin,
    Alert,
    Button,
    Card,
    Tag,
    Typography,
} from "antd";

const { Title, Text } = Typography;

const AdminProfile = () => {
    const { id } = useParams();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAdminDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axiosInstance.get(`/admin/getById/${id}`);

            if (!data?.data) {
                throw new Error("Admin data not found in response");
            }
            setAdmin(data.data);
        } catch (error) {
            console.error("Error fetching admin:", error);
            setError(
                error?.response?.data?.message || "Failed to fetch admin details"
            );
            toast.error(
                error?.response?.data?.message || "Failed to fetch admin details"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminDetails();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "MMMM dd, yyyy");
        } catch {
            return "Invalid date";
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "super_admin":
                return "error";
            case "admin":
                return "blue";
            case "pending":
                return "warning";
            default:
                return "default";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] bg-white">
                <Spin tip="Loading admin details..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto py-10 bg-white">
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={fetchAdminDetails}>
                            Retry
                        </Button>
                    }
                />
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="container mx-auto py-10 bg-white">
                <Alert message="Admin not found" type="warning" showIcon />
            </div>
        );
    }

    return (
        <div className="mx-auto py-6 px-4 bg-white">
            <Card className="shadow-md rounded-2xl">
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 border-b">
                    <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gray-100">
                        <FaUserCircle size={80} className="text-blue-600" />
                    </div>
                    <div className="text-center md:text-left">
                        <Title level={3} className="mb-2">
                            {admin.firstName} {admin.lastName}
                        </Title>
                        <Tag color={getRoleColor(admin.role)}>
                            {admin.role?.replace(/_/g, " ").toUpperCase()}
                        </Tag>
                        {admin.isActive === false && <Tag color="default">INACTIVE</Tag>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                    <Card size="small" title="Personal Information">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Text strong>Admin ID:</Text>
                                <Text code>{admin.id}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Email:</Text>
                                <Text>{admin.email || "N/A"}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Phone:</Text>
                                <Text>{admin.phone || "N/A"}</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Date of Birth:</Text>
                                <Text>{formatDate(admin.dateOfBirth)}</Text>
                            </div>
                        </div>
                    </Card>

                    <Card size="small" title="Account Information">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Text strong>Status:</Text>
                                {admin.isActive ? (
                                    <Tag color="success">Active</Tag>
                                ) : (
                                    <Tag color="default">Inactive</Tag>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Admin Approval:</Text>
                                {admin.isAdminAccepted ? (
                                    <Tag color="success">Approved</Tag>
                                ) : (
                                    <Tag color="warning">Pending</Tag>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Email Verified:</Text>
                                {admin.isAccountVerified ? (
                                    <Tag color="success">Verified</Tag>
                                ) : (
                                    <Tag color="warning">Unverified</Tag>
                                )}
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Warehouse:</Text>
                                <Text>{admin.where_house_id?.name || "N/A"}</Text>
                            </div>
                        </div>
                    </Card>
                </div>
            </Card>
        </div>
    );
};

export default AdminProfile;