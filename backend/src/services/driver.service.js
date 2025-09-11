import bcrypt from "bcryptjs";
import BaseService from "./BaseService.js";
import Drivers from "../models/Drivers.js";


class DriverService extends BaseService {
    constructor () {
        super('drivers', Drivers, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt'
        })
    }

    async findByEmail(email) {
        try {
            const docs = await this.findByFilter('email', '==', email);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async findByGoogleId(googleId) {
        try {
            const docs = await this.findByFilter('googleId', '==', googleId);
            
            if (docs.length){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async findByPhone(phone) {
        try {
            const docs = await this.findByFilter('phone', '==', phone);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async updateCommissionRateForAllDrivers(commission_rate) {
        try {
            // Fetch all drivers
            const drivers = await this.findAll();
            if (drivers.length === 0) {
                throw new Error("No drivers found")
            }

            // Update each driver's commission rate
            const updatePromises = drivers.map(async (driver) => {
                const updateData = {
                    commissionRate: commission_rate
                }

                return await this.updateById(driver.id, updateData);
            });

            // Wait for all updates to complete
            const updateResults = await Promise.all(updatePromises);

            // Check if all updates were successful
            const failedUpdates = updateResults.filter(result => !result || result.error);
            if (failedUpdates.length > 0) {
                throw new Error(`Failed to update ${failedUpdates.length} drivers`);
            }

            return {
                success: true,
                message: `Successfully updated commission rate to ${commission_rate} for all drivers`, 
                before_count: drivers.length,
                updated_count: drivers.length,
                successful_updates: updateResults.length
            };
        } catch (error) {
            throw error;
        }
    }

    async updateFinanceForDriverById(driver_id, totalWithdraws, currentBalance) {
        try {
            const updateData = {
                totalWithdraws: totalWithdraws,
                currentBalance: currentBalance
            };

            const result = await this.updateById(driver_id, updateData);
            if (!result) {
                return {
                    success: false,
                    totalWithdraws: 0,
                    currentBalance: 0,
                }
            }

            return {
                success: true,
                totalEarnings: result.totalEarnings,
                totalWithdraws: result.totalWithdraws,
                currentBalance: result.currentBalance,
            };
        } catch (error) {
            throw error;
        }
    }

}

export default DriverService;