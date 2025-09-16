import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FaUserCircle, FaEnvelope, FaPhone, FaBirthdayCake, FaWarehouse } from "react-icons/fa";
import { Spin, Alert, Button, Card, Tag, Typography, Skeleton } from "antd";

const { Title, Text } = Typography;

const AdminProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAdminDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axiosInstance.get(`/admin/getById/${id}`);
            if (!data?.data) throw new Error("Admin data not found");
            setAdmin(data.data);
        } catch (error) {
            console.error("Error fetching admin:", error);
            setError(error?.response?.data?.message || "Failed to fetch admin details");
            toast.error(error?.response?.data?.message || "Failed to fetch admin details");
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
            case "super_admin": return "error";
            case "admin": return "blue";
            case "pending": return "warning";
            default: return "default";
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
                    action={<Button size="small" onClick={fetchAdminDetails}>Retry</Button>}
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
        <div className="mx-auto py-6 px-4 bg-gray-50 min-h-[80vh]">
            <Card className="shadow-lg rounded-2xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center gap-6 p-6 border-b bg-white rounded-t-2xl">
                    <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 text-white">
                        <FaUserCircle size={80} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center md:gap-4 justify-center md:justify-start">
                            <Title level={3} className="mb-2">{admin.firstName} {admin.lastName}</Title>
                            <Tag color={getRoleColor(admin.role)} className="uppercase">{admin.role?.replace(/_/g, " ")}</Tag>
                            {admin.isActive === false && <Tag color="default">Inactive</Tag>}
                        </div>
                        <Button
                            type="primary"
                            danger
                            className="mt-4 md:mt-0"
                            onClick={() => navigate(`/reset-password/${admin.id}`)}
                        >
                            Reset Password
                        </Button>
                    </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                    {/* Personal Info */}
                    <Card size="small" title="Personal Information" className="shadow-sm rounded-xl">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 justify-between">
                                <Text strong><FaUserCircle /> Admin ID:</Text>
                                <Text code>{admin.id}</Text>
                            </div>
                            <div className="flex items-center gap-2 justify-between">
                                <Text strong><FaEnvelope /> Email:</Text>
                                <Text>{admin.email || "N/A"}</Text>
                            </div>
                            <div className="flex items-center gap-2 justify-between">
                                <Text strong><FaPhone /> Phone:</Text>
                                <Text>{admin.phone || "N/A"}</Text>
                            </div>
                            <div className="flex items-center gap-2 justify-between">
                                <Text strong><FaBirthdayCake /> Date of Birth:</Text>
                                <Text>{formatDate(admin.dateOfBirth)}</Text>
                            </div>
                        </div>
                    </Card>

                    {/* Account Info */}
                    <Card size="small" title="Account Information" className="shadow-sm rounded-xl">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Text strong>Status:</Text>
                                {admin.isActive ? <Tag color="success">Active</Tag> : <Tag color="default">Inactive</Tag>}
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Admin Approval:</Text>
                                {admin.isAdminAccepted ? <Tag color="success">Approved</Tag> : <Tag color="warning">Pending</Tag>}
                            </div>
                            <div className="flex justify-between">
                                <Text strong>Email Verified:</Text>
                                {admin.isAccountVerified ? <Tag color="success">Verified</Tag> : <Tag color="warning">Unverified</Tag>}
                            </div>
                            <div className="flex justify-between items-center">
                                <Text strong><FaWarehouse /> Warehouse:</Text>
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
