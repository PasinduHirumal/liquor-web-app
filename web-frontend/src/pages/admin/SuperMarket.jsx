import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";

function SuperMarket() {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMarkets = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/superMarket/getAll");
            if (res.data && res.data.success) {
                setMarkets(res.data.data);
            } else {
                setError("Failed to fetch supermarkets");
            }
        } catch (err) {
            console.error("Fetch SuperMarkets Error:", err);
            setError(err.response?.data?.message || "Server Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarkets();
    }, []);

    return (
        <div className="bg-white p-4">
            <h1 className="text-xl font-bold mb-4">Super Market Management</h1>

            {loading && <p>Loading supermarkets...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Name</th>
                            <th className="border px-4 py-2">Street Address</th>
                            <th className="border px-4 py-2">City</th>
                            <th className="border px-4 py-2">State</th>
                            <th className="border px-4 py-2">Postal Code</th>
                            <th className="border px-4 py-2">Country</th>
                            <th className="border px-4 py-2">Active</th>
                            <th className="border px-4 py-2">Orders Count</th>
                            <th className="border px-4 py-2">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {markets.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    No supermarkets found.
                                </td>
                            </tr>
                        )}
                        {markets.map((market) => (
                            <tr key={market.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{market.superMarket_Name}</td>
                                <td className="border px-4 py-2">{market.streetAddress}</td>
                                <td className="border px-4 py-2">{market.city}</td>
                                <td className="border px-4 py-2">{market.state}</td>
                                <td className="border px-4 py-2">{market.postalCode}</td>
                                <td className="border px-4 py-2">{market.country}</td>
                                <td className="border px-4 py-2">
                                    {market.isActive ? "Yes" : "No"}
                                </td>
                                <td className="border px-4 py-2">{market.orders_count}</td>
                                <td className="border px-4 py-2">
                                    {new Date(market.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SuperMarket;
