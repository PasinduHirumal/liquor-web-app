import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Table, Tabs, Typography, Spin, Alert, Card, Switch, Tag } from "antd";
import toast from "react-hot-toast";

const { Title } = Typography;
const { TabPane } = Tabs;

function AppInfo() {
    const [mainAppData, setMainAppData] = useState(null);
    const [allAppData, setAllAppData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

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
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch app info");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleToggle = async (record) => {
        try {
            setUpdatingId(record.id);
            const newValue = !record.is_liquor_show;

            const res = await axiosInstance.patch("/appInfo/update/toggle", {
                is_liquor_show: newValue,
            });

            toast.success(res.data.message || "Updated successfully");

            const updateState = (data) => {
                return data.map((item) =>
                    item.id === record.id ? { ...item, is_liquor_show: newValue } : item
                );
            };

            setMainAppData((prev) => (prev?.id === record.id ? { ...prev, is_liquor_show: newValue } : prev));
            setAllAppData((prev) => updateState(prev));

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update");
        } finally {
            setUpdatingId(null);
        }
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Reg Number", dataIndex: "reg_number", key: "reg_number" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "App Version", dataIndex: "app_version", key: "app_version" },
        {
            title: "Liquor Show",
            dataIndex: "is_liquor_show",
            key: "is_liquor_show",
            render: (value, record) => (
                <div className="flex items-center">
                    <Switch
                        checked={value}
                        loading={updatingId === record.id}
                        onChange={() => handleToggle(record)}
                    />
                    <Tag color={value ? "green" : "red"}>{value ? "Yes" : "No"}</Tag>
                </div>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
        },
        {
            title: "Updated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (value) => (value ? new Date(value).toLocaleString() : "N/A"),
        },
    ];

    if (loading) {
        return (
            <div className="p-5 flex justify-center items-center">
                <Spin tip="Loading app info..." size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5">
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <Card className="p-4">
            <Title level={3}>App Info</Title>

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
                        />
                    )}
                </TabPane>
            </Tabs>
        </Card>
    );
}

export default AppInfo;
