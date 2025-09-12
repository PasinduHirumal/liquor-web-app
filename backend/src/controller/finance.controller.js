import OrdersService from '../services/orders.service.js';
import { ORDER_STATUS_FOR_REPORT } from '../data/OrderStatus.js';
import { buildFiltersForWithdrawCash } from "../functions/BuildFilters.js";
import { calculateCashSummary } from '../utils/calculateCashSummary.js';

const orderService = new OrdersService();

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

        const Cash_Summery = await calculateCashSummary(orders);
        
        return res.status(200).json({ 
            success: true, 
            message: "Cash summery fetched successfully",
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: {
                total_tax: Cash_Summery.total_TAX,
                total_service_charge: Cash_Summery.total_service_charge,
                total_profit_from_products: Cash_Summery.total_profit_from_products,
                total_delivery_fee: Cash_Summery.total_delivery_fee,
                total_income: Cash_Summery.total_income,
                total_payment_for_drivers: Cash_Summery.total_payment_for_drivers,
                total_company_withdraws: Cash_Summery.total_company_withdraws,
                available_balance: Cash_Summery.available_balance,
                amount_to_be_paid_to_drivers: Cash_Summery.amount_to_be_paid_to_drivers,
                amount_can_withdraw: Cash_Summery.amount_can_withdraw,
            }
        });
    } catch (error) {
        console.error("Get cash summery error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getCashSummery };