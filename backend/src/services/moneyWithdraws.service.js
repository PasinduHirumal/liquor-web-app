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

    async clearWithdraws() {
        try {
            const docsRef = await this.collection.get();

            if (docsRef.empty) {
                return true;
            }

            // Firestore batch delete (max 500 per batch)
            const BATCH_SIZE = 500;
            const docs = docsRef.docs;

            for (let i = 0; i < docs.length; i += BATCH_SIZE) {
                const batch = db.batch();
                const chunk = docs.slice(i, i + BATCH_SIZE);

                chunk.forEach(doc => batch.delete(doc.ref));

                await batch.commit();
            }

            return true;
        } catch (error) {
            throw error;
        }
    }
}

export default MoneyWithdrawService;