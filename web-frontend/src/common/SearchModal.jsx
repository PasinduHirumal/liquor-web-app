import React from "react";
import { Modal, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchModal = ({ open, onClose }) => {
  return (
    <Modal
      title={<span style={{ color: "#fff",fontWeight: "bold" }}>Search</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      style={{
        top: 70,
      }}
      width="95%"
      bodyStyle={{
        paddingTop: "16px",
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
