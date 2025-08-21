import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";

function AppInfo() {
    const [appData, setAppData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppInfo = async () => {
            try {
                const res = await axiosInstance.get("/appInfo/getAll");
                setAppData(res.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch app info");
            } finally {
                setLoading(false);
            }
        };
        fetchAppInfo();
    }, []);

    if (loading) {
        return <div className="p-5">Loading app info...</div>;
    }

    if (error) {
        return <div className="p-5 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="pt-5 bg-white p-4">
            <h1 className="text-xl font-bold mb-4">App Info</h1>

            {appData.length === 0 ? (
                <p>No app info available</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2 text-left">ID</th>
                            <th className="border px-4 py-2 text-left">Reg Number</th>
                            <th className="border px-4 py-2 text-left">Description</th>
                            <th className="border px-4 py-2 text-left">App Version</th>
                            <th className="border px-4 py-2 text-left">Liquor Show</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appData.map((item) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{item.id}</td>
                                <td className="border px-4 py-2">{item.reg_number}</td>
                                <td className="border px-4 py-2">{item.description}</td>
                                <td className="border px-4 py-2">{item.app_version}</td>
                                <td className="border px-4 py-2">
                                    {item.is_liquor_show ? "Yes" : "No"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AppInfo;