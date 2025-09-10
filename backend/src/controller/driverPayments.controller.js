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
        const Current_Balance = parseFloat((Total_Earnings - Total_Payments).toFixed(2));

        // calculate new balance
        const Current_Balance_New = parseFloat((Current_Balance - payment_value).toFixed(2));
        if (Current_Balance_New < 0) {
            return res.status(400).json({ success: false, message: "Insufficient current balance"});
        }

        const paymentData = {
            driver_id: driver_id,
            current_balance_before: Current_Balance,
            payment_value: payment_value,
            current_balance_new: Current_Balance_New
        };

        const payment = await driverPaymentService.create(paymentData);

        // update driver
        const Total_Withdraws = await driverPaymentService.getTotalPaymentsForDriver(driver_id);
        const New_Current_Balance = parseFloat((Total_Earnings - Total_Withdraws).toFixed(2));

        const updatedFinanceResult = await driverService.updateFinanceForDriverById(driver_id, Total_Earnings, Total_Withdraws, New_Current_Balance);
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

        return res.status(200).json({ 
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

export { payToDriverByDriverId };