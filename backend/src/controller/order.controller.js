import OrdersService from "../services/orders.service.js";

const orderService = new OrdersService();

export const createOrder = async (req, res) => {
    try {
        
    } catch (error) {
        console.error("Create order error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}