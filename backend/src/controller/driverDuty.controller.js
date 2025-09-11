import DriverDutyService from '../services/driverDuty.service.js';
import OrdersService from '../services/orders.service.js';
import populateDriver from '../utils/populateDriver.js';
import { extractSupermarketIds } from '../utils/orderHelpers.js';

const dutyService = new DriverDutyService();
const orderService = new OrdersService();

const createDriverDuty = async (assigned_driver_id, order, ) => {
    try {
        const Super_Market_ids = await extractSupermarketIds(order.items);

        const driverDutyData = {
            driver_id: assigned_driver_id,
            order_id: order.order_id,
            warehouse_id: order.warehouse_id,
            superMarket_ids: Super_Market_ids,
            is_completed: false,
            is_driver_accepted: false,
            is_re_assigning_driver: order.assigned_driver_id !== undefined
        }

        const driverDuty = await dutyService.create(driverDutyData);

        return { 
            success: true, 
            duty_data: driverDuty
        };
    } catch (error) {
        console.error('Driver duty creation error:', error);
        return { 
            success: false, 
            error: "Failed to create Driver Duty" 
        };
    }
};

const getAllDutiesForOrder = async (req, res) => {
	try {
        const orderId = req.params.id;
        const { is_completed, is_driver_accepted, is_re_assigning_driver } = req.query;

        const order = await orderService.findById(orderId)
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const duties = await dutyService.findByFilter('order_id', '==', orderId);
        if (!duties) {
            return res.status(400).json({ success: false, message: "Failed to get duties by order_id" });
        }

        let filteredDuties = duties;
        let filterDescription = [];

        if (is_completed !== undefined) {
            const isActiveBoolean = is_completed === 'true';
            filteredDuties = filteredDuties.filter(duty => duty.is_completed === isActiveBoolean);
            filterDescription.push(`is_completed: ${is_completed}`);
        }

        if (is_driver_accepted !== undefined) {
            const isActiveBoolean = is_driver_accepted === 'true';
            filteredDuties = filteredDuties.filter(duty => duty.is_driver_accepted === isActiveBoolean);
            filterDescription.push(`is_driver_accepted: ${is_driver_accepted}`);
        }

        if (is_re_assigning_driver !== undefined) {
            const isActiveBoolean = is_re_assigning_driver === 'true';
            filteredDuties = filteredDuties.filter(duty => duty.is_re_assigning_driver === isActiveBoolean);
            filterDescription.push(`is_re_assigning_driver: ${is_re_assigning_driver}`);
        }

        let populatedDuties;
        try {
            populatedDuties = await populateDriver(filteredDuties);
        } catch (error) {
            console.error("Error populating driver duties:", error);
            return res.status(500).json({ success: false, message: "Failed to populate driver duties" });
        } 

        // Sort by created_at in descending order (newest first)
        const sortedDuties = populatedDuties.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
        
        return res.status(200).json({ 
            success: true, 
            message: "Fetching driver duties for order successfully",
            count: sortedDuties.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: sortedDuties
        });
    } catch (error) {
        console.error("Get all duties for product error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createDriverDuty, getAllDutiesForOrder };