import OrdersService from '../services/orders.service.js';
import DriverService from "../services/driver.service.js";
import CompanyService from "../services/company.service.js";
import DriverEarningsService from '../services/driverEarnings.service.js';
import ORDER_STATUS from '../enums/orderStatus.js';
import populateUser from '../utils/populateUser.js';
import populateDriver from '../utils/populateDriver.js';
import populateWhereHouse from "../utils/populateWhere_House.js";
import getDateFromTimestamp from '../utils/convertFirestoreTimeStrapToDate.js';
import { populateAddressWithUserIdInData } from '../utils/populateAddress.js';
import { createDriverEarning, updateDriverEarning } from './driverEarnings.controller.js';
import { extractSupermarketIds, updateOrderMissingFields } from '../utils/orderHelpers.js';
import { validateDriverForDuty } from '../utils/validateDriverForDelivery.js';
import { createDriverDuty } from './driverDuty.controller.js';


const orderService = new OrdersService();
const driverService = new DriverService();
const companyService = new CompanyService();
const driverEarningService = new DriverEarningsService();


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
            populatedOrders = await populateWhereHouse(populatedOrders);
        } catch (error) {
            console.error("Error populating orders:", error);
            return res.status(500).json({ success: false, message: "Failed to populate orders" });
        } 

        // Sort by created_at in descending order (newest first)
        const sortedOrders = populatedOrders.sort((a, b) => {
            const dateA = getDateFromTimestamp(a.created_at);
            const dateB = getDateFromTimestamp(b.created_at);
            return dateB - dateA;
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
            populatedOrders = await populateWhereHouse(populatedOrders);
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

const assignDriverForOrderById = async (req, res) => {
	try {
        const orderId = req.params.id;
        const { assigned_driver_id } = req.body;

        let order = await orderService.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found"});
        }

        const driver = await driverService.findById(assigned_driver_id);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found"});
        }

        // update supermarket ids and is_driver_accepted
        try {
            order = await updateOrderMissingFields(order, orderId);
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        // Check if order is already accepted by a driver
        if (assigned_driver_id && order.is_driver_accepted) {
            const driver = await driverService.findById(order.assigned_driver_id);
            return res.status(400).json({ success: false, message: `Order is already accepted by driver: ${driver.firstName} ${driver.lastName}` });
        }

        // check driver validation for delivery
        const Driver_Validation_Result = validateDriverForDuty(driver, order);
        if (!Driver_Validation_Result.isValid) {
            return res.status(400).json({ success: false, message: Driver_Validation_Result.errors });
        }

        // create driver duty
        const Driver_Duty_Result = await createDriverDuty(assigned_driver_id, order);
        if (!Driver_Duty_Result.success) {
            return res.status(400).json({ success: false, message: Driver_Duty_Result.error });
        }

        // create driver earning
        let driver_earning_temp = null;
        const existingDriverEarning = await driverEarningService.findByOrderId(orderId);
        if (!existingDriverEarning) {
            const created_earning = await createDriverEarning(assigned_driver_id, orderId);

            if (!created_earning.shouldCreateEarning) {
                return res.status(400).json({ success: false, message: created_earning.error });
            }

            driver_earning_temp = created_earning.data;
        } else {
            const earning_id = existingDriverEarning.earning_id;
            const updated_earning = await updateDriverEarning(assigned_driver_id, earning_id);

            if (!updated_earning.shouldUpdateEarning) {
                return res.status(400).json({ success: false, message: updated_earning.error });
            }

            driver_earning_temp = updated_earning.data;
        }

        const driver_earning = driver_earning_temp;

        const updateData = { 
            assigned_driver_id: assigned_driver_id,
            status: ORDER_STATUS.PROCESSING,
            driver_earning_id: driver_earning?.earning_id ?? null,
        };

        const updatedOrder = await orderService.updateById(orderId, updateData);
        if (!updatedOrder) {
            return res.status(500).json({ success: false, message: "Failed to update order"});
        }

        return res.status(200).json({ 
            success: true, 
            message: "Order status updated and Driver assigned successfully", 
            data: {
                duty: Driver_Duty_Result.duty_data,
                earning: driver_earning,
                order: updatedOrder
            }
        });
    } catch (error) {
        console.error("Assign driver for Order error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateOrderStatusById = async (req, res) => {
	try {
        const order_id = req.params.id;
        const { status } = req.body;

        const order = await orderService.findById(order_id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found"});
        }

        const immutableStatuses = [ORDER_STATUS.DELIVERED, ORDER_STATUS.OUT_FOR_DELIVERY, ORDER_STATUS.CANCELLED];
        if (immutableStatuses.includes(order.status)) {
            return res.status(400).json({ 
                success: false, 
                message: `Can't update order status. Order is at ${order.status}`
            });
        }

        const updateData = { status: status };

        if (order.is_driver_accepted === undefined) updateData.is_driver_accepted = false;
        if (!order.superMarket_ids || order.superMarket_ids.length === 0) {
            const superMarketIds = await extractSupermarketIds(order.items);
            if (superMarketIds.length > 0) updateData.superMarket_ids = superMarketIds;
        }

        const updatedOrder = await orderService.updateById(order_id, updateData);

        return res.status(200).json({ 
            success: true, 
            message: "Order status updated successfully", 
            data: updatedOrder 
        });
    } catch (error) {
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getAllOrders, getOrderById, assignDriverForOrderById, updateOrderStatusById };