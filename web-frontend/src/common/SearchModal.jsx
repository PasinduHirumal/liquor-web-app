import React from "react";
import { Modal, Input, Button } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";

const SearchModal = ({ open, onClose }) => {
  return (
    <Modal
      title={<span style={{ color: "#fff", fontWeight: "bold" }}>Search</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      maskClosable={false}
      style={{
        top: 70,
      }}
      width="95%"
      bodyStyle={{
        paddingTop: "16px",
        backgroundColor: "#010524ff",
      }}
      styles={{
        header: {
          backgroundColor: "#010524ff",
          color: "#fff",
        },
        content: {
          backgroundColor: "#010524ff",
        },
      }}
    >
      {/* Custom Close Button */}
      <Button
        type="text"
        icon={<CloseOutlined style={{ color: "#fff", fontSize: "16px" }} />}
        onClick={onClose}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
        }}
      />

      <Input.Search
        placeholder="Search for products..."
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={(value) => console.log("Searching:", value)}
        style={{
          backgroundColor: "#010524ff",
          color: "#fff",
        }}
      />
    </Modal>
  );
};

export default SearchModal;
