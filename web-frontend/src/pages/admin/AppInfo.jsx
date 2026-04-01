import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import {
    Table, Tabs, Typography, Spin, Alert, Card, Switch, Tag, Button, InputNumber,
} from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { FaCarSide } from "react-icons/fa";
import { MdSmartphone } from "react-icons/md";
import toast from "react-hot-toast";

// Components
import AppInfoEditModal from "../../components/admin/forms/AppInfoEditModal";
import SuperMarketMigrate from "../../components/admin/buttons/migrate/SuperMarketMigrate";
import LiquorMigrate from "../../components/admin/buttons/migrate/LiquorMigrate";
import GroceryMigrate from "../../components/admin/buttons/migrate/GroceryMigrate";

const { Title } = Typography;
const { TabPane } = Tabs;

function AppInfo() {
    const [mainAppData, setMainAppData] = useState(null);
    const [allAppData, setAllAppData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    // Commission Rate
    const [commissionRate, setCommissionRate] = useState(null);
    const [commissionLoading, setCommissionLoading] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [mainRes, allRes] = await Promise.all([
                    axiosInstance.get("/appInfo/getMainAppInfo"),
                    axiosInstance.get("/appInfo/getAll"),
                ]);
                setMainAppData(mainRes.data.data || null);
                setAllAppData(allRes.data.data || []);
                setCommissionRate(mainRes.data.data?.commissionRate_drivers || 0);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch app info");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleToggle = async (record, field) => {
        try {
            setUpdatingId(record.id);
            const newValue = !record[field];
            const res = await axiosInstance.patch("/appInfo/update/toggle", {
                [field]: newValue,
            });

            toast.success(res.data.message || "Updated successfully");

            const updateState = (data) =>
                data.map((item) =>
                    item.id === record.id ? { ...item, [field]: newValue } : item
                );

            setMainAppData((prev) =>
                prev?.id === record.id ? { ...prev, [field]: newValue } : prev
            );
            setAllAppData((prev) => updateState(prev));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleEdit = (record) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleCommissionUpdate = async () => {
        if (commissionRate == null) return;
        try {
            setCommissionLoading(true);
            const res = await axiosInstance.patch("/appInfo/update/commissionRate", {
                commissionRate_drivers: commissionRate,
            });

            toast.success(res.data.message || "Commission updated");

            // Update state with backend response
            setMainAppData(res.data.data.appInfo);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update commission");
        } finally {
            setCommissionLoading(false);
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 180,
        },
        {
            title: "Reg Number",
            dataIndex: "reg_number",
            key: "reg_number",
            width: 150,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 120,
            ellipsis: true
        },
        {
            title: "App Version",
            dataIndex: "app_version",
            key: "app_version",
            width: 120
        },
        {
            title: "Liquor Show",
            dataIndex: "is_liquor_show",
            key: "is_liquor_show",
            width: 150,
            render: (value, record) => (
                <div className="flex items-center gap-2">
                    <Switch
                        checked={value}
                        className="mx-2"
                        loading={updatingId === record.id}
                        onChange={() => handleToggle(record, "is_liquor_show")}
                    />
                    <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>
                </div>
            ),
        },
        {
            title: "Commission Rate (Drivers)",
            dataIndex: "commissionRate_drivers",
            key: "commissionRate_drivers",
            width: 200,
            render: (value) => <Tag color="blue">{value}%</Tag>,
        },
        {
            title: "Action",
            key: "action",
            width: 100,
            render: (_, record) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                    className="p-0"
                >
                    <span className="hidden md:inline">Edit</span>
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px] bg-white">
                <Spin tip="Loading app info..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-white">
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <div className="p-2 md:p-4 bg-gray-50 min-h-screen">
            <Card className="w-full rounded-lg shadow-sm">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <Title level={3} className="m-0 text-xl md:text-2xl">App Info</Title>
                    <div className="flex flex-wrap gap-2">
                        <SuperMarketMigrate className="text-xs md:text-sm" />
                        <LiquorMigrate className="text-xs md:text-sm" />
                        <GroceryMigrate className="text-xs md:text-sm" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {/* Apps Download Section */}
                    <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-4">
                        <Title level={5} className="!m-0 text-base">
                            Our Apps
                        </Title>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                type="primary"
                                size="large"
                                className="flex-1 !bg-blue-600 hover:!bg-blue-700 !border-blue-600 text-white py-2.5 px-4 rounded-3 transition-all duration-200"
                                onClick={() =>
                                    window.open(
                                        "https://drive.google.com/uc?export=download&id=1s8rpcumqnGe93GuJByU8u6YGA-3NJGgA",
                                        "_blank"
                                    )
                                }
                            >
                                <MdSmartphone size={18} /> Download User App
                            </Button>

                            <Button
                                type="primary"
                                size="large"
                                className="flex-1 !bg-green-600 hover:!bg-green-700 !border-green-600 text-white py-2.5 px-4 rounded-lg transition-all duration-200"
                                onClick={() =>
                                    window.open(
                                        "https://drive.google.com/uc?export=download&id=1i2QZos7lyZ3EkNrIkfbCQtBVyle0GZFz",
                                        "_blank"
                                    )
                                }
                            >
                                <FaCarSide size={18} /> Download Driver App
                            </Button>
                        </div>
                    </div>

                    {/* Commission Section */}
                    <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-4">
                        <Title level={5} className="!m-0 text-base">
                            Driver Commission Rate
                        </Title>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <InputNumber
                                min={0}
                                max={100}
                                value={commissionRate}
                                onChange={setCommissionRate}
                                formatter={(value) => `${value}%`}
                                parser={(value) => value.replace("%", "")}
                                className="w-full sm:w-32"
                                size="large"
                            />

                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                loading={commissionLoading}
                                onClick={handleCommissionUpdate}
                                className="w-full sm:w-auto"
                                size="large"
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>

                <Tabs defaultActiveKey="main" className="w-full">
                    <TabPane tab="Main App Info" key="main">
                        <Title level={4} className="text-lg md:text-xl mb-4">Main Application Information</Title>
                        {!mainAppData ? (
                            <Alert message="No main app info available" type="info" />
                        ) : (
                            <div className="overflow-x-auto">
                                <Table
                                    columns={columns}
                                    dataSource={[mainAppData]}
                                    rowKey="id"
                                    pagination={false}
                                    bordered
                                    scroll={{ x: 1000 }}
                                    size="middle"
                                />
                            </div>
                        )}
                    </TabPane>

                    <TabPane tab={`All App Data (${allAppData.length})`} key="all">
                        <Title level={4} className="text-lg md:text-xl mb-4">All Application Data</Title>
                        {allAppData.length === 0 ? (
                            <Alert message="No app info available" type="info" />
                        ) : (
                            <div className="overflow-x-auto">
                                <Table
                                    columns={columns}
                                    dataSource={allAppData}
                                    rowKey="id"
                                    bordered
                                    scroll={{ x: 1000 }}
                                    size="middle"
                                />
                            </div>
                        )}
                    </TabPane>
                </Tabs>

                <AppInfoEditModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    selectedRecord={selectedRecord}
                    setSelectedRecord={setSelectedRecord}
                    setAllAppData={setAllAppData}
                    setMainAppData={setMainAppData}
                    mainAppData={mainAppData}
                />
            </Card>
        </div>
    );
}

export default AppInfo;