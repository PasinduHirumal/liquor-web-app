import OrdersService from '../services/orders.service.js';
import DriverService from "../services/driver.service.js";
import CompanyService from "../services/company.service.js";
import DriverDutyService from '../services/driverDuty.service.js';
import ORDER_STATUS from '../enums/orderStatus.js';
import populateUser from '../utils/populateUser.js';
import populateDriver from '../utils/populateDriver.js';
import { populateAddressWithUserIdInData } from '../utils/populateAddress.js';


const orderService = new OrdersService();
const driverService = new DriverService();
const dutyService = new DriverDutyService();
const companyService = new CompanyService();


const getAllOrders = async (req, res) => {
	try {
        const { status, is_driver_accepted, where_house_id } = req.query;

        const filters = {};
        const filterDescription = [];

        if (status !== undefined){
            if (status && !Object.values(ORDER_STATUS).includes(status)) {
                return res.status(400).json({ success: false, message: "Invalid status value" });
            }
            
            filters.status = status;
            filterDescription.push(`status: ${status}`);
        }
        if (is_driver_accepted !== undefined) {
            const isBoolean = is_driver_accepted === 'true';
            filters.is_driver_accepted = isBoolean;
            filterDescription.push(`is_driver_accepted: ${is_driver_accepted}`);
        } 
        if (where_house_id !== undefined) {
            const where_house = await companyService.findById(where_house_id);
            if (!where_house) {
                return res.status(400).json({ success: false, message: "Invalid where house id" });
            }
            
            filters.where_house_id = where_house_id;
            filterDescription.push(`where_house_id: ${where_house_id}`);
        }

        const filteredOrders = Object.keys(filters).length > 0 
            ? await orderService.findWithFilters(filters)
            : await orderService.findAll();

        let populatedOrders = filteredOrders;
        try {
            populatedOrders = await populateAddressWithUserIdInData(populatedOrders);
            populatedOrders = await populateUser(populatedOrders);
            populatedOrders = await populateDriver(populatedOrders);
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
            populatedOrders = await populateDriver(populatedOrders);
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
        const orderId = req.params.id;
        const { status, assigned_driver_id } = req.body;

        let order = await orderService.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found"});
        }

        if (order.is_driver_accepted === undefined){
            const updateOrderData = {
                is_driver_accepted: false
            };

            const updatedOrderWithIsDriverAccepted = await orderService.updateById(orderId, updateOrderData);
            if (!updatedOrderWithIsDriverAccepted) {
                return res.status(500).json({ success: true, message: "Failed to update is_driver_accepted in order"});
            }

            order = updatedOrderWithIsDriverAccepted;
        }

        let driver_duty = null;
        const isAssigningDriver = assigned_driver_id !== undefined;
        const isUpdatingStatus = status !== undefined;

        if (isAssigningDriver && order.is_driver_accepted) {
            const driver = await driverService.findById(order.assigned_driver_id);
            return res.status(400).json({ success: false, message: `Order is already accepted by driver: ${driver.firstName} ${driver.lastName}` });
        }

        if (isAssigningDriver && !order.is_driver_accepted) {
            const driver = await driverService.findById(assigned_driver_id);
            if (!driver) {
                return res.status(404).json({ success: false, message: "Driver not found"});
            }

            const failedChecks = [];
            
            if (!driver.isDocumentVerified) failedChecks.push("Documents not verified");
            if (!driver.isAccountVerified) failedChecks.push("Account not verified");
            if (!driver.isAvailable) failedChecks.push("Not available");
            if (!driver.isActive) failedChecks.push("Account not active");
            if (driver.backgroundCheckStatus !== "approved") {
                failedChecks.push(`Background check ${driver.backgroundCheckStatus} (must be approved)`);
            }

            if (failedChecks.length > 0) {
                return res.status(400).json({ success: false, message: failedChecks.join('.\n') });
            }

            // create driver duty
            try {
                const driverDutyData = {
                    driver_id: assigned_driver_id,
                    order_id: order.order_id,
                    is_completed: false,
                    is_driver_accepted: false,
                    is_re_assigning_driver: order.assigned_driver_id !== undefined
                }

                const driverDuty = await dutyService.create(driverDutyData);
                if (!driverDuty){
                    return res.status(500).json({ success: false, message: "Failed to creating driver duty" });
                }

                driver_duty = driverDuty;
            } catch (error) {
                console.error("Error creating driver duty:", error);
                return res.status(500).json({ success: false, message: "Failed to creating driver duty" });
            }
        }

        const updateData = { ...req.body };

        if (isAssigningDriver) updateData.status = ORDER_STATUS.PROCESSING;

        const updatedOrder = await orderService.updateById(orderId, updateData);
        if (!updatedOrder) {
            return res.status(500).json({ success: true, message: "Failed to update order"});
        }

        let successMessage = "Order updated successfully";
        if (isAssigningDriver && isUpdatingStatus) {
            successMessage = "Order status updated and Driver assigned successfully";
        } else if (isAssigningDriver) {
            successMessage = "Driver assigned successfully";
        } else if (isUpdatingStatus) {
            successMessage = "Order status updated successfully";
        }

        return res.status(200).json({ 
            success: true, 
            message: successMessage, 
            data: {
                duty: driver_duty,
                order: updatedOrder
            }
        });
    } catch (error) {
        console.error("Update Order error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getAllOrders, getOrderById, updateOrder};