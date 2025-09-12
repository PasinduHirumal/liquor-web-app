import OrdersService from '../services/orders.service.js';
import MoneyWithdrawService from '../services/moneyWithdraws.service.js';
import { ORDER_STATUS_FOR_REPORT } from '../data/OrderStatus.js';
import { buildFiltersForWithdrawCash } from "../functions/BuildFilters.js";
import { calculateCashSummary } from '../utils/calculateCashSummary.js';

const orderService = new OrdersService();
const moneyWithdrawService = new MoneyWithdrawService();

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

const withdrawProfitedCash = async (req, res) => {
	try {
        const { status = ORDER_STATUS_FOR_REPORT } = req.query;
        const { withdraw_amount, description } = req.body;

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

        const Available_Balance = Cash_Summery.amount_can_withdraw;

        if (Available_Balance < withdraw_amount) {
            return res.status(400).json({ success: false, message: "Insufficient Account Balance"});
        }

        const withdrawData = {
            withdraw_amount: withdraw_amount,
            description: description,
            admin_id: req.user?.id,
            admin_email: req.user?.email,
            admin_role: req.user?.role
        };

        const withdrawal = await moneyWithdrawService.create(withdrawData);

        return res.status(201).json({ 
            success: true, 
            message: `Your ${withdraw_amount} cash withdrawal successfully completed`,
            data: withdrawal
        });
    } catch (error) {
        console.error("Withdraw profited cash error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllWithdrawalHistory = async (req, res) => {
	try {
        const withdrawals = await moneyWithdrawService.findAll();
        
        // Sort by created_at in descending order (newest first)
        const sortedWithdrawals = withdrawals.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
        
        return res.status(200).json({ 
            success: true, 
            message: "Withdrawals history fetched successfully", 
            data: sortedWithdrawals 
        });
    } catch (error) {
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getCashSummery, withdrawProfitedCash, getAllWithdrawalHistory };