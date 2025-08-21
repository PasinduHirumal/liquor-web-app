import React from "react";
import { Modal, Form, Input } from "antd";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const AppInfoEditModal = ({
    isModalOpen,
    setIsModalOpen,
    selectedRecord,
    setSelectedRecord,
    setAllAppData,
    setMainAppData,
    mainAppData
}) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (selectedRecord) {
            form.setFieldsValue(selectedRecord);
        }
    }, [selectedRecord, form]);

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

    return (
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
                    <Input />
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
    );
};

export default AppInfoEditModal;
