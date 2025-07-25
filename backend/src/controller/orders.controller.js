import OrdersService from '../services/orders.service.js';
import populateUser from '../utils/populateUser.js';
import ORDER_STATUS from '../enums/orderStatus.js';
import { populateAddressWithUserIdInData } from '../utils/populateAddress.js';

const orderService = new OrdersService();


const getAllOrders = async (req, res) => {
	try {
        const { status } = req.query;

        if (!Object.values(ORDER_STATUS).includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const orders = await orderService.findAll();
        if (!orders) {
            return res.status(400).json({ success: false, message: "Failed to fetch orders"});
        }
        
        let filteredOrders = orders;
        let filterDescription = [];

        if (status !== undefined){
            filteredOrders = filteredOrders.filter(order => order.status === status);
            filterDescription.push(`status: ${status}`);
        }

        let populatedOrders;
        try {
            populatedOrders = await populateAddressWithUserIdInData(filteredOrders);
            populatedOrders = await populateUser(populatedOrders);
        } catch (error) {
            console.error("Error populating orders:", error);
            return res.status(500).json({ success: false, message: "Failed to populate orders" });
        } 

        // Sort by created_at in descending order (newest first)
        const sortedOrders = populatedOrders.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });

        return res.status(200).json({ 
            success: true, 
            message: "Fetching orders successfully",
            count: sortedOrders.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: sortedOrders
        });
    } catch (error) {
        console.error("Get All Orders error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getOrderById = async (req, res) => {
	try {
        const orderId = req.params.id;

        const order = await orderService.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found"});
        }

        let populatedOrders;
        try {
            populatedOrders = await populateAddressWithUserIdInData(order);
            populatedOrders = await populateUser(populatedOrders);
        } catch (error) {
            console.error("Error populating orders:", error);
            return res.status(500).json({ success: false, message: "Failed to populate orders" });
        } 
        
        return res.status(200).json({ success: true, message: "Order found successfully", data: populatedOrders});
    } catch (error) {
        console.error("Get Order By Id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateOrder = async (req, res) => {
	try {
        return res.status(400).json({ success: false, message: ""});
        return res.status(200).json({ success: true, message: ""});
    } catch (error) {
        console.error("Update Order error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getAllOrders, getOrderById };