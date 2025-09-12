import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Input, Typography, Spin } from "antd";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";
import { DollarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function CashWithdraws() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [description, setDescription] = useState("");

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/finance/withdraw_history");
            if (res.data.success) {
                setWithdrawals(res.data.data);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Fetch withdrawals error:", error);
            toast.error("Failed to fetch withdrawals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const handleWithdraw = async () => {
        if (!withdrawAmount || Number(withdrawAmount) <= 0) {
            return toast.warning("Enter a valid amount");
        }

        try {
            const res = await axiosInstance.post("/finance/withdraw_cash", {
                withdraw_amount: Number(withdrawAmount),
                description,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setModalVisible(false);
                setWithdrawAmount("");
                setDescription("");
                fetchWithdrawals();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Withdraw error:", error);
            toast.error("Cash withdrawal failed");
        }
    };

    const columns = [
        {
            title: "Admin",
            key: "admin",
            width: 180,
            render: (record) => (
                <div>
                    <Text strong>{record.admin_email}</Text>
                    <br />
                    <Text type="secondary">ID: {record.admin_id}</Text>
                </div>
            ),
        },
        {
            title: "Role",
            dataIndex: "admin_role",
            key: "role",
            width: 100,
        },
        {
            title: "Amount",
            dataIndex: "withdraw_amount",
            key: "amount",
            width: 100,
            render: (text) => <Text>Rs. {text.toFixed(2)}</Text>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 270,
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "date",
            width: 150,
            render: (text) => <Text>{new Date(text).toLocaleString()}</Text>,
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <Title level={3}>Cash Withdraws</Title>
                <Button
                    type="primary"
                    icon={<DollarOutlined />}
                    onClick={() => setModalVisible(true)}
                >
                    Withdraw Cash
                </Button>
            </div>

            <Card className="shadow-sm rounded-lg">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        dataSource={withdrawals}
                        columns={columns}
                        rowKey={(record) => record.id}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 1000 }} // enables horizontal scroll
                    />
                )}
            </Card>

            <Modal
                title="Withdraw Cash"
                open={modalVisible}
                onOk={handleWithdraw}
                onCancel={() => setModalVisible(false)}
                okText="Withdraw"
            >
                <div className="flex flex-col gap-4">
                    <Input
                        className="w-full"
                        placeholder="Amount"
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <Input.TextArea
                        className="w-full"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default CashWithdraws;
