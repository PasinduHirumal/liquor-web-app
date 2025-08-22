import React, { useState } from "react";
import { Button, Spin, Card } from "antd";
import { axiosInstance } from "../../../../lib/axios";
import toast from "react-hot-toast";

function SuperMarketMigrate() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleMigrate = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await axiosInstance.post("/superMarket/migrate");
            if (response.data.success) {
                toast.success(response.data.message);
                setResult(response.data);
            } else {
                toast.error(response.data.message || "Migration failed");
            }
        } catch (error) {
            console.error("Migration error:", error);
            toast.error(error.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Migrate Search Tokens</h2>
            <p className="mb-4 text-gray-600">
                Click the button below to regenerate and add search tokens to all existing supermarkets.
            </p>
            <Button
                type="primary"
                onClick={handleMigrate}
                disabled={loading}
            >
                {loading ? <Spin size="small" /> : "Run Migration"}
            </Button>

            {result && (
                <div className="mt-4 text-sm text-gray-700">
                    <p><strong>Processed:</strong> {result.processed}</p>
                    <p><strong>Errors:</strong> {result.errors}</p>
                    <p><strong>Total:</strong> {result.total}</p>
                </div>
            )}
        </Card>
    );
}

export default SuperMarketMigrate;
