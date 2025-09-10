import React, { useState } from "react";
import { Modal, Descriptions, InputNumber } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const DriverPaymentModal = ({ visible, onClose, driver, refreshDriverData }) => {
    const [processingPayment, setProcessingPayment] = useState(false);
    const [paymentValue, setPaymentValue] = useState(null);

    const handleClose = () => {
        setPaymentValue(null); // reset input
        onClose();
    };

    const confirmPayment = async () => {
        if (!driver || !paymentValue) {
            toast.error("Please enter a payment amount");
            return;
        }

        try {
            setProcessingPayment(true);

            const response = await axiosInstance.post(`/payment/driver/${driver.id}`, {
                payment_value: paymentValue,
            });

            if (response.data.success) {
                toast.success(response.data.message);

                if (refreshDriverData) {
                    await refreshDriverData(driver.id);
                }

                handleClose();
            } else {
                toast.error(response.data.message || "Payment failed");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.response?.data?.message || "Failed to process payment");
        } finally {
            setProcessingPayment(false);
        }
    };

    return (
        <Modal
            title="Confirm Payment"
            open={visible}
            onOk={confirmPayment}
            confirmLoading={processingPayment}
            onCancel={handleClose}
            okText="Confirm"
            cancelText="Cancel"
            maskClosable={false}
        >
            {driver && (
                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Driver">
                        {driver.firstName} {driver.lastName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Current Balance">
                        Rs: {driver.currentBalance || 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">{driver.email}</Descriptions.Item>
                    <Descriptions.Item label="NIC Number">
                        {driver.nic_number}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Amount">
                        <InputNumber
                            min={1}
                            precision={2}
                            style={{ width: "100%" }}
                            value={paymentValue}
                            onChange={setPaymentValue}
                        />
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Modal>
    );
};

export default DriverPaymentModal;
