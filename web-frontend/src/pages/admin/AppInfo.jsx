import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import {
    Table,
    Tabs,
    Typography,
    Spin,
    Alert,
    Card,
    Switch,
    Tag,
    Modal,
    Form,
    Input,
    Button,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const { Title } = Typography;
const { TabPane } = Tabs;

function AppInfo() {
    const [mainAppData, setMainAppData] = useState(null);
    const [allAppData, setAllAppData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [form] = Form.useForm();

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

            const updateState = (data) =>
                data.map((item) =>
                    item.id === record.id ? { ...item, is_liquor_show: newValue } : item
                );

            setMainAppData((prev) =>
                prev?.id === record.id ? { ...prev, is_liquor_show: newValue } : prev
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
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = form.getFieldsValue();

            const res = await axiosInstance.patch(`/appInfo/update/${selectedRecord.id}`, values);

            toast.success(res.data.message || "Updated successfully");

            // Update UI state
            setAllAppData((prev) =>
                prev.map((item) =>
                    item.id === selectedRecord.id ? { ...item, ...values } : item
                )
            );
            if (mainAppData?.id === selectedRecord.id) {
                setMainAppData((prev) => ({ ...prev, ...values }));
            }

            setIsModalOpen(false);
            setSelectedRecord(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update");
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
        <Card className="p-4" style={{ borderRadius: 0 }}>
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
                            scroll={{ x: 1200 }}
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
                            scroll={{ x: 1200 }}
                        />
                    )}
                </TabPane>
            </Tabs>

            {/* Edit Modal */}
            <Modal
                title="Edit App Info"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleModalOk}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="ID" name="id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Reg Number" name="reg_number">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input />
                    </Form.Item>
                    <Form.Item label="App Version" name="app_version">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Liquor Show" name="is_liquor_show">
                        <Input disabled />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}

export default AppInfo;
