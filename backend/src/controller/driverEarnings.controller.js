import APP_INFO from "../data/AppInfo.js";
import AppInfoService from "../services/appInfo.service.js";
import DriverService from "../services/driver.service.js";
import DriverEarningsService from "../services/driverEarnings.service.js";
import OrdersService from "../services/orders.service.js";

const driverEarningService = new DriverEarningsService();
const orderService = new OrdersService();
const appInfoService = new AppInfoService();
const driverService = new DriverService();

const createDriverEarning = async (driver_id, order_id) => {
    try {
        const existingDriverEarning = await driverEarningService.findByOrderId(order_id);
        if (existingDriverEarning) {
            return { 
                shouldCreateEarning: false, 
                error: "Driver earning for this order already created" 
            };
        }

        const order = await orderService.findById(order_id);
        if (!order) {
            return { 
                shouldCreateEarning: false, 
                error: "Order not found to create driver earning" 
            };
        }

        const app_info = await appInfoService.findByRegNumber(APP_INFO.REG_NUMBER);
        if (!app_info) {
            return { 
                shouldCreateEarning: false, 
                error: "App-Info, commission rate not found to create driver earning" 
            };
        }

        const Delivery_Fee = order.delivery_fee ?? 0;
        const Commission_Rate = app_info.commissionRate_drivers ?? 0;
        const Earning_Value = parseFloat(((Delivery_Fee * Commission_Rate) / 100).toFixed(2));

        const driverEarningData = {
            driver_id: driver_id,
            order_id: order_id,
            delivery_fee: Delivery_Fee,
            commission_rate: Commission_Rate,
            earning_amount: Earning_Value,
            is_delivery_completed: false
        }

        const driverEarning = await driverEarningService.create(driverEarningData);

        return { 
            shouldCreateEarning: true, 
            data: driverEarning 
        };
    } catch (error) {
        console.error('Driver earning creation error:', error);
        return { 
            shouldCreateEarning: false, 
            error: "Failed to create Driver Earning" 
        };
    }
}

const updateDriverEarning = async (driver_id, earning_id) => {
    try {
        const earning = await driverEarningService.findById(earning_id);
        if (!earning) {
            return { 
                shouldUpdateEarning: false, 
                error: "Driver earning not found to update" 
            };
        }

        const updateData = {
            driver_id: driver_id
        }

        const updatedEarning = await driverEarningService.updateById(earning_id, updateData);
        if (!updatedEarning) {
            return { 
                shouldUpdateEarning: false, 
                error: "Driver earning update failed" 
            };
        }

        return { 
            shouldUpdateEarning: true, 
            data: updatedEarning 
        };
    } catch (error) {
        console.error('Driver earning update error:', error);
        return { 
            shouldUpdateEarning: false, 
            error: "Failed to update Driver Earning" 
        };
    }
}

const getAllEarningsForDriverById = async (req, res) => {
	try {
        const driver_id = req.params.id;

        const driver = await driverService.findById(driver_id);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found"});
        }

        const earnings = await driverEarningService.findAllByDriverId(driver_id);

        // Sort by created_at in descending order (newest first)
        const sortedEarnings = earnings.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
        
        const driver_name = `${driver.firstName} ${driver.lastName}`;

        return res.status(200).json({ 
            success: true, 
            message: `All earnings for driver: ${driver_name} fetched successfully`,
            count: earnings.length,
            data: sortedEarnings
        });
    } catch (error) {
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createDriverEarning, updateDriverEarning, getAllEarningsForDriverById };