import DriverService from "../services/driver.service.js";
import DriverEarningsService from "../services/driverEarnings.service.js";
import DriverPaymentService from "../services/driverPayment.service.js";

const driverService = new DriverService();
const driverPaymentService = new DriverPaymentService();
const driverEarningsService = new DriverEarningsService();

const payToDriverByDriverId = async (req, res) => {
	try {
        const driver_id = req.params.id;
        const { payment_value } = req.body;

        const driver = await driverService.findById(driver_id);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found"});
        }

        const Total_Earnings = await driverEarningsService.getTotalEarningForDriver(driver_id);
        const Total_Payments = await driverPaymentService.getTotalPaymentsForDriver(driver_id);
        
        const Amount_Can_Pay = parseFloat((Total_Earnings - Total_Payments).toFixed(2));

        if (Amount_Can_Pay < payment_value) {
            return res.status(400).json({ success: false, message: "Insufficient current balance"});
        }

        const Current_Balance_New = parseFloat((Amount_Can_Pay - payment_value).toFixed(2));

        const paymentData = {
            driver_id: driver_id,
            current_balance_before: Amount_Can_Pay,
            payment_value: payment_value,
            current_balance_new: Current_Balance_New
        };

        const payment = await driverPaymentService.create(paymentData);

        const Total_Payments_New = Total_Payments + payment_value;
        
        // update driver
        const updatedFinanceResult = await driverService.updateFinanceForDriverById(driver_id, Total_Payments_New, Current_Balance_New);
        if (!updatedFinanceResult.success) {
            return res.status(400).json({ success: false, message: "Failed to update finance section of driver"});
        }

        const driver_name = `${driver.firstName} ${driver.lastName}`;

        const updatedDriverData = {
            id: driver_id,
            email: driver.email,
            driver_name: driver_name,
            totalEarnings: updatedFinanceResult.totalEarnings,
            totalWithdraws: updatedFinanceResult.totalWithdraws,
            currentBalance: updatedFinanceResult.currentBalance,
        };

        return res.status(201).json({ 
            success: true, 
            message: `Pay ${payment_value} /= to driver: ${driver_name} was successful`,
            data: {
                payment: payment,
                driver: updatedDriverData
            }
        });
    } catch (error) {
        console.error("Pay to driver error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getPaymentHistoryForDriver = async (req, res) => {
	try {
        const driver_id = req.params.id;

        const driver = await driverService.findById(driver_id);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found"});
        }

        const payments = await driverPaymentService.findAllByDriverId(driver_id);

        // Sort by created_at in descending order (newest first)
        const sortedPayments = payments.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });

        const driver_name = `${driver.firstName} ${driver.lastName}`;

        return res.status(200).json({ 
            success: true, 
            message: `Payment history for driver: ${driver_name} fetched successfully`,
            count: payments.length,
            data: sortedPayments
        });
    } catch (error) {
        console.error("Get payment history for driver error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { payToDriverByDriverId, getPaymentHistoryForDriver };