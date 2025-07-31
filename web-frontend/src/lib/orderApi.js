import { axiosInstance } from "./axios";

export const getPendingOrdersCount = async () => {
    const response = await axiosInstance.get("/orders/getAllOrders?status=pending");
    return response.data.count;
};
