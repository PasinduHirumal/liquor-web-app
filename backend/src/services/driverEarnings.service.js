import BaseService from "./BaseService.js";
import DriverEarnings from "../models/DriverEarnings.js";

class DriverEarningsService extends BaseService {
    constructor() {
        super('driver_earnings', DriverEarnings, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at',
            idField: 'earning_id',
        })
    }

    async findByOrderId(order_id) {
        try {
            const docs = await this.findByFilter('order_id', '==', order_id);
            if (docs.length === 0) {
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async findByDriverId(driver_id) {
        try {
            const docs = await this.findByFilter('driver_id', '==', driver_id);
            if (docs.length === 0) {
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async getTotalEarningForDriver(driver_id, is_delivery_completed = false) {
        try {
            const filters = {
                driver_id: driver_id,
                is_delivery_completed: is_delivery_completed
            };
            
            const earnings = await this.findWithFilters(filters);
            return earnings.reduce((total, earning) => {
                return total + (earning.earning_amount || 0);
            }, 0);
        } catch (error) {
            throw error;
        }
    }
}

export default DriverEarningsService;