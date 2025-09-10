import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import {
    Table, Tabs, Typography, Spin, Alert, Card, Switch, Tag, Button, InputNumber,
} from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
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
        { title: "ID", dataIndex: "id", key: "id", width: 80 },
        { title: "Reg Number", dataIndex: "reg_number", key: "reg_number", width: 150 },
        { title: "Description", dataIndex: "description", key: "description", width: 250 },
        { title: "App Version", dataIndex: "app_version", key: "app_version", width: 120 },
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
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 200,
            render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
            width: 200,
            render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
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
                >
                    Edit
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="pt-5 flex text-center bg-white">
                <Spin tip="Loading app info..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 bg-white">
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <Card className="p-4" style={{ borderRadius: 0 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Title level={3}>App Info</Title>
                <div className="d-flex gap-2">
                    <SuperMarketMigrate />
                    <LiquorMigrate />
                    <GroceryMigrate />
                </div>
            </div>

            {/* Commission Update */}
            <div className="flex items-center gap-3 mb-6">
                <Title level={5}>Update Commission Rate (Drivers):</Title>
                <InputNumber
                    min={0}
                    max={100}
                    value={commissionRate}
                    onChange={setCommissionRate}
                    formatter={(value) => `${value}%`}
                    parser={(value) => value.replace("%", "")}
                />
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={commissionLoading}
                    onClick={handleCommissionUpdate}
                >
                    Save
                </Button>
            </div>

            <Tabs defaultActiveKey="main">
                <TabPane tab="Main App Info" key="main">
                    <Title level={4}>Main Application Information</Title>
                    {!mainAppData ? (
                        <Alert message="No main app info available" type="info" />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={[mainAppData]}
                            rowKey="id"
                            pagination={false}
                            bordered
                            scroll={{ x: 1400 }}
                        />
                    )}
                </TabPane>

                <TabPane tab={`All App Data (${allAppData.length})`} key="all">
                    <Title level={4}>All Application Data</Title>
                    {allAppData.length === 0 ? (
                        <Alert message="No app info available" type="info" />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={allAppData}
                            rowKey="id"
                            bordered
                            scroll={{ x: 1400 }}
                        />
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
    );
}

export default AppInfo;
