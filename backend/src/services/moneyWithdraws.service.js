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
            if (docs.length === 0) {
                return { 
                    Total_Value: 0 
                } 
            }

            const totalCompanyEarning = docs.reduce((total, doc) => {
                const companyEarning = doc.delivery_fee - doc.earning_amount;
                return total + (companyEarning || 0);
            }, 0);

            return { 
                Total_Value: parseFloat(totalCompanyEarning.toFixed(2)) 
            }
        } catch (error) {
            throw error;
        }
    }
}

export default MoneyWithdrawService;