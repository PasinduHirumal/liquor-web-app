import React, { useState, useEffect, useCallback } from "react";
import { Modal, Input, Button, Spin, Alert, Empty } from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { axiosInstance } from "../lib/axios";
import LiquorProductCard from "./LiquorProductCard";
import OtherProductCard from "./OtherProductCard";
import { debounce } from "lodash";

const SearchModal = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchSearchResults = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);

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

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      fetchSearchResults(value);
    }, 500),
    [] // Ensure it's created only once
  );

  // Trigger search automatically when searchTerm changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel(); // Cleanup on unmount
    };
  }, [searchTerm, debouncedSearch]);

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
  };

  useEffect(() => {
    if (!open) {
      // Reset state when modal closes
      handleClear();
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
        <Input
          placeholder="Search for products..."
          size="large"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          onClear={handleClear}
          style={{
            backgroundColor: "#fff",
            border: "1px solid #1c1f2b",
            color: "#1c1f2b"
          }}
        />
      </div>

      {/* Results Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column"
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
            }}
            className="px-3">
              Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
            </div>

            {/* Scrollable product list */}
            <div
              className="overflow-auto"
              style={{
                flex: 1,
                maxHeight: "calc(90vh - 180px)",
                paddingRight: "8px"
              }}
            >
              <div className="row g-3 px-2 m-0">
                {searchResults.map((product) => (
                  <React.Fragment key={product.id || product.product_id}>
                    {product.is_liquor ? (
                      <LiquorProductCard product={product} userOnly={true} />
                    ) : (
                      <OtherProductCard product={product} userOnly={true} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;
