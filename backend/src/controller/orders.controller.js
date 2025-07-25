import OrdersService from '../services/orders.service.js';
import populateUser from '../utils/populateUser.js';
import populateAddress from '../utils/populateAddress.js';

const orderService = new OrdersService();


const getAllOrders = async (req, res) => {
	try {
        const { status } = req.query;

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

        let populatedOrders
        try {
            populatedOrders = await populateUser(filteredOrders);
            //populatedOrders = await populateAddress(populatedOrders);
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
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getAllOrders };