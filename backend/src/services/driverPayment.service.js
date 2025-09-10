import BaseService from "./BaseService.js";
import DriverPayments from "../models/DriverPayments.js";

class DriverPaymentService extends BaseService {
    constructor() {
        super('driver_payments', DriverPayments, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at',
            idField: 'payment_id',
        })
    }

    async getTotalPaymentsForDriver(driver_id) {
        try {
            const payments = await this.findByFilter('driver_id', '==', driver_id);

            return payments.reduce((total, payment) => {
                return total + (payment.payment_value || 0);
            }, 0);
        } catch (error) {
            throw error;
        }
    }

    async getTotalPaymentForAllDrivers() {
        try {
            const payments = await this.findAll();

            return payments.reduce((total, payment) => {
                return total + (payment.payment_value || 0);
            }, 0);
        } catch (error) {
            throw error;
        }
    }

    async findAllByDriverId(driver_id) {
        try {
            const docs = await this.findByFilter('driver_id', '==', driver_id);
            
            return docs;
        } catch (error) {
            throw error;
        }
    }
}

export default DriverPaymentService;