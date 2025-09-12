import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";

function CashWithdrawModel({ visible, onClose, onSuccess }) {
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!visible) {
            setWithdrawAmount("");
            setDescription("");
        }
    }, [visible]);

    const handleWithdraw = async () => {
        if (!withdrawAmount || Number(withdrawAmount) <= 0) {
            return toast.error("Amount cannot be empty or zero");
        }
        if (!description || description.trim() === "") {
            return toast.error("Description cannot be empty");
        }

        setLoading(true);
        try {
            const res = await axiosInstance.post("/finance/withdraw_cash", {
                withdraw_amount: Number(withdrawAmount),
                description,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                onSuccess();
                onClose();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Withdraw error:", error);
            toast.error("Cash withdrawal failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Withdraw Cash"
            open={visible}
            onOk={handleWithdraw}
            onCancel={onClose}
            okText="Withdraw"
            okButtonProps={{ loading }}
            maskClosable={false}
        >
            <div className="flex flex-col gap-4">
                <Input
                    className="w-full"
                    placeholder="Amount"
                    type="text"
                    value={withdrawAmount}
                    onKeyDown={(e) => {
                        const allowedKeys = [
                            "Backspace",
                            "ArrowLeft",
                            "ArrowRight",
                            "Delete",
                            "Tab",
                        ];
                        if (!/[0-9.]/.test(e.key) && !allowedKeys.includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val)) {
                            setWithdrawAmount(val);
                        }
                    }}
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
    );
}

export default CashWithdrawModel;
