import React, { useState } from "react";
import { Modal, Descriptions } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";

const DriverPaymentModal = ({ visible, onClose, driver }) => {
    const [processingPayment, setProcessingPayment] = useState(false);

    const confirmPayment = async () => {
        if (!driver) return;
        try {
            setProcessingPayment(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.success(`Payment made to ${driver.firstName} ${driver.lastName}`);
            onClose();
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Failed to process payment");
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
            onCancel={onClose}
            okText="Confirm"
            cancelText="Cancel"
            icon={<ExclamationCircleOutlined />}
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
                </Descriptions>
            )}
        </Modal>
    );
};

export default DriverPaymentModal;
