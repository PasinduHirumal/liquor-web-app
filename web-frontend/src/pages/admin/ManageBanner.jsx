import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import CreateBannerModal from "../../components/admin/forms/CreateBannerModal";
import EditBannerModal from "../../components/admin/forms/EditBannerModal";
import DeleteBannerButton from "../../components/admin/buttons/DeleteBannerButton";
import {
    Button,
    Select,
    Card,
    Spin,
    Typography,
    Row,
    Col,
    Tag,
    Empty,
    message,
} from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

function ManageBanner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editBanner, setEditBanner] = useState(null);

    // Filters
    const [isActiveFilter, setIsActiveFilter] = useState("");
    const [isLiquorFilter, setIsLiquorFilter] = useState("");

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const params = {};
            if (isActiveFilter !== "") params.isActive = isActiveFilter;
            if (isLiquorFilter !== "") params.isLiquor = isLiquorFilter;

            const response = await axiosInstance.get("/banners/getAll", { params });
            setBanners(response.data.data || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch banners");
            message.error("Failed to fetch banners");
            console.error("Error fetching banners:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, [isActiveFilter, isLiquorFilter]);

    return (
        <div className="bg-white p-6 rounded-0 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <Title level={3} className="!mb-0">Manage Banners</Title>
                <Button
                    type="primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create Banner
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <Select
                    value={isActiveFilter}
                    onChange={(value) => setIsActiveFilter(value)}
                    placeholder="Filter by Status"
                    className="w-40"
                    allowClear
                >
                    <Option value="true">Active</Option>
                    <Option value="false">Inactive</Option>
                </Select>

                <Select
                    value={isLiquorFilter}
                    onChange={(value) => setIsLiquorFilter(value)}
                    placeholder="Filter by Type"
                    className="w-40"
                    allowClear
                >
                    <Option value="true">Liquor</Option>
                    <Option value="false">Regular</Option>
                </Select>

                <Button
                    onClick={() => {
                        setIsActiveFilter("");
                        setIsLiquorFilter("");
                    }}
                >
                    Reset Filters
                </Button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Text type="danger">Error: {error}</Text>
            ) : banners.length === 0 ? (
                <Empty description="No banners found" />
            ) : (
                <div>
                    <Title level={4}>Banner List ({banners.length})</Title>
                    <Row gutter={[16, 16]} className="mt-4">
                        {banners.map((banner) => (
                            <Col key={banner.banner_id} xs={24} sm={12} lg={8}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={banner.title}
                                            src={banner.image}
                                            className="h-48 w-full object-cover rounded-t-lg"
                                        />
                                    }
                                >
                                    <Card.Meta
                                        title={banner.title}
                                        description={banner.description}
                                    />

                                    <div className="flex justify-between mt-3">
                                        <Tag color={banner.isActive ? "green" : "red"}>
                                            {banner.isActive ? "Active" : "Inactive"}
                                        </Tag>
                                        <Tag color={banner.isLiquor ? "blue" : "default"}>
                                            {banner.isLiquor ? "Liquor" : "Regular"}
                                        </Tag>
                                    </div>

                                    {/* Buttons aligned right with gap */}
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button
                                            type="primary"
                                            onClick={() => setEditBanner(banner)}
                                        >
                                            Edit
                                        </Button>
                                        <DeleteBannerButton
                                            bannerId={banner.banner_id}
                                            onDeleted={fetchBanners}
                                        />
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}

            {/* Modals */}
            {showCreateModal && (
                <CreateBannerModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={fetchBanners}
                />
            )}

            {editBanner && (
                <EditBannerModal
                    banner={editBanner}
                    onClose={() => setEditBanner(null)}
                    onUpdated={fetchBanners}
                />
            )}
        </div>
    );
}

export default ManageBanner;
