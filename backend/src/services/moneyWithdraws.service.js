import BaseService from "./BaseService.js";
import MoneyWithdraws from "../models/MoneyWithdraws.js";

class MoneyWithdrawService extends BaseService {
    constructor() {
        super('money_withdraws', MoneyWithdraws, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at',
            idField: 'withdraw_id',
        })
    }

    async getTotalWithdrawsAmount() {
        try {
            const docs = await this.findAll();

            const totalWithdrawalsAmount = docs.reduce((total, doc) => {
                const withdrawalsAmount= doc.withdraw_amount;
                return total + (withdrawalsAmount || 0);
            }, 0);

            return { 
                Total_Value: totalWithdrawalsAmount 
            }
        } catch (error) {
            throw error;
        }
    }
}

export default MoneyWithdrawService;