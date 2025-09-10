import OrdersService from '../services/orders.service.js';
import DriverEarningsService from '../services/driverEarnings.service.js';
import DriverPaymentService from '../services/driverPayment.service.js';
import MoneyWithdrawService from '../services/moneyWithdraws.service.js';
import { ORDER_STATUS_FOR_REPORT } from '../data/OrderStatus.js';
import { buildFiltersForWithdrawCash } from "../functions/BuildFilters.js";

const orderService = new OrdersService();
const driverEarningsService = new DriverEarningsService();
const driverPaymentService = new DriverPaymentService();
const withdrawService = new MoneyWithdrawService();

const getCashSummery = async (req, res) => {
	try {
        const { status = ORDER_STATUS_FOR_REPORT } = req.query;

        const { filters, filterDescription, validationError } = await buildFiltersForWithdrawCash({ status });

        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }

        const orders = Object.keys(filters).length > 0
            ? await orderService.findWithFilters(filters)
            : await orderService.findAll();
        
        if (!orders) {
            return res.status(400).json({ success: false, message: "Failed to fetch orders, app-info"});
        }

        const Income_Result = await orderService.getTotalIncomeValues(orders);
        const Delivery_Fee_Earning_Result = await driverEarningsService.getTotalEarningForCompany();
        const Total_Payments_For_All_Drivers = await driverPaymentService.getTotalPaymentForAllDrivers();
        const Total_Withdraw_Result = await withdrawService.getTotalWithdrawsAmount();
        const Total_Earnings_For_All_Drivers_Result = await driverEarningsService.getTotalEarningForAllDrivers();

        const Tax_And_Profits = Income_Result.Total_TAX + Income_Result.Total_Profit_From_Products;

        const Total_Income = Tax_And_Profits + Income_Result.Total_Delivery_Fee;
        const Total_Payment_For_All_Drivers = parseFloat(Total_Payments_For_All_Drivers.toFixed(2));
        const Total_Withdraws = Total_Withdraw_Result.Total_Value;
        const Available_Balance = Total_Income - Total_Payment_For_All_Drivers - Total_Withdraws;
        const Amount_To_Be_Paid_To_Drivers = Total_Earnings_For_All_Drivers_Result.Total_Value - Total_Payment_For_All_Drivers;
        const Amount_Can_Withdraw = Tax_And_Profits + Delivery_Fee_Earning_Result.Total_Value - Total_Withdraws;

        const resultsSummery = {
            total_income: Total_Income,
            total_payment_for_drivers: Total_Payment_For_All_Drivers,
            total_company_withdraws: Total_Withdraws,
            available_balance: Available_Balance,
            amount_to_be_paid_to_drivers: Amount_To_Be_Paid_To_Drivers,
            amount_can_withdraw: Amount_Can_Withdraw,
        }
        
        return res.status(200).json({ 
            success: true, 
            message: "Cash summery fetched successfully",
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: resultsSummery
        });
    } catch (error) {
        console.error("Get cash summery error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getCashSummery };