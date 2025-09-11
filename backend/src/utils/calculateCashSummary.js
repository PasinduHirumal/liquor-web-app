import OrdersService from '../services/orders.service.js';
import DriverEarningsService from '../services/driverEarnings.service.js';
import DriverPaymentService from '../services/driverPayment.service.js';
import MoneyWithdrawService from '../services/moneyWithdraws.service.js';

const orderService = new OrdersService();
const driverEarningsService = new DriverEarningsService();
const driverPaymentService = new DriverPaymentService();
const withdrawService = new MoneyWithdrawService();

const calculateCashSummary = async (orders) => {
    // Fetch all required data
    const Income_Result = await orderService.getTotalIncomeValues(orders);
    const Total_Cost_Value = await orderService.getTotalCostForAllOrders();
    const Delivery_Fee_Earning_Result = await driverEarningsService.getTotalEarningForCompany();
    const Total_Earnings_For_All_Drivers_Result = await driverEarningsService.getTotalEarningForAllDrivers();
    const Total_Payments_For_All_Drivers = await driverPaymentService.getTotalPaymentForAllDrivers();
    const Total_Withdraw_Result = await withdrawService.getTotalWithdrawsAmount();

    // Perform calculations
    const Tax_And_Profits = Income_Result.Total_TAX + Income_Result.Total_Profit_From_Products;
    const Total_Income = Tax_And_Profits + Income_Result.Total_Delivery_Fee;
    const Total_Payment_For_All_Drivers = parseFloat(Total_Payments_For_All_Drivers.toFixed(2));
    const Total_Withdraws = Total_Withdraw_Result.Total_Value;
    const Available_Balance = Total_Income - Total_Payment_For_All_Drivers - Total_Withdraws;
    const Amount_To_Be_Paid_To_Drivers = Total_Earnings_For_All_Drivers_Result.Total_Value - Total_Payment_For_All_Drivers;
    const Amount_Can_Withdraw = Tax_And_Profits + Delivery_Fee_Earning_Result.Total_Value - Total_Withdraws;
    const Available_Total_Balance = parseFloat((Total_Cost_Value + Available_Balance).toFixed(2));

    // Return summary object
    return {
        total_TAX: Income_Result.Total_TAX,
        total_profit_from_products: Income_Result.Total_Profit_From_Products,
        total_delivery_fee: Income_Result.Total_Delivery_Fee,
        total_income: Total_Income,
        total_payment_for_drivers: Total_Payment_For_All_Drivers,
        total_company_withdraws: Total_Withdraws,
        available_balance: Available_Balance,
        amount_to_be_paid_to_drivers: Amount_To_Be_Paid_To_Drivers,
        amount_can_withdraw: Amount_Can_Withdraw,
        extra: {
            total_cost: parseFloat(Total_Cost_Value.toFixed(2)),
            total_balance: Available_Total_Balance
        }
    };
};

export { calculateCashSummary };