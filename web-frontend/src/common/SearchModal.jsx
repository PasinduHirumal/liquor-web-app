import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Spin, Alert, Empty } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { axiosInstance } from "../lib/axios";
import LiquorProductCard from "./LiquorProductCard";
import OtherProductCard from "./OtherProductCard";

const SearchModal = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (value) => {
    if (!value.trim()) return;

    setLoading(true);
    setError(null);
    setSearchTerm(value);

    try {
      const response = await axiosInstance.get("/search/all", {
        params: { q: value }
      });

      if (response.data.success) {
        setSearchResults(response.data.data || []);
      } else {
        setError(response.data.message || "Search failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search products");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
  };

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      setSearchTerm("");
      setSearchResults([]);
      setError(null);
      setHasSearched(false);
    }
  }, [open]);

  return (
    <Modal
      title={<span style={{ color: "#fff", fontWeight: "bold" }}>Search Products</span>}
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      maskClosable={false}
      style={{
        top: 70,
        maxWidth: "95%",
        height: "90vh"
      }}
      width="95%"
      bodyStyle={{
        padding: "16px",
        backgroundColor: "#010524ff",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      }}
      styles={{
        header: {
          backgroundColor: "#010524ff",
          color: "#fff",
          borderBottom: "1px solid #1c1f2b",
          padding: "16px"
        },
        content: {
          backgroundColor: "#010524ff",
          padding: 0
        },
        body: {
          padding: 0,
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }
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

      {/* Search Input */}
      <div style={{ padding: "16px", borderBottom: "1px solid #1c1f2b" }}>
        <Input.Search
          placeholder="Search for products..."
          enterButton={<SearchOutlined />}
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={handleSearch}
          loading={loading}
          allowClear
          onClear={handleClear}
          style={{
            backgroundColor: "#0b0d17",
            border: "1px solid #1c1f2b",
          }}
          inputStyle={{ color: "#fff" }}
        />
      </div>

      {/* Results Area */}
      <div style={{
        flex: 1,
        overflow: "auto",
        padding: "16px",
        paddingTop: 0
      }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <p style={{ color: "#fff", marginTop: "16px" }}>Searching...</p>
          </div>
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: "16px" }}
          />
        )}

        {hasSearched && !loading && searchResults.length === 0 && (
          <Empty
            description="No products found"
            imageStyle={{ height: 60 }}
            style={{ color: "#fff", marginTop: "40px" }}
          />
        )}

        {!loading && searchResults.length > 0 && (
          <>
            <div style={{
              color: "#fff",
              marginBottom: "16px",
              padding: "8px 0",
              borderBottom: "1px solid #1c1f2b"
            }}>
              Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
            </div>

            <div className="row">
              {searchResults.map((product) => (
                <React.Fragment key={product.id || product.product_id}>
                  {product.is_liquor ? (
                    <LiquorProductCard
                      product={product}
                      userOnly={true}
                    />
                  ) : (
                    <OtherProductCard
                      product={product}
                      userOnly={true}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;