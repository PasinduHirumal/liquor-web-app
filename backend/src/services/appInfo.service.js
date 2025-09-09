import BaseService from "./BaseService.js";
import AppInfo from "../models/AppInfo.js";
import APP_INFO from "../data/AppInfo.js";

class AppInfoService extends BaseService {
    constructor() {
        super('app_info', AppInfo, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt'
        })
    }

    async findByRegNumber(reg_number) {
        try {
            const docs = await this.findByFilter('reg_number', '==', reg_number);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async getCommissionRateForDrivers() {
        try {
            const reg_number = APP_INFO.REG_NUMBER;
            const appInfo = await this.findByRegNumber(reg_number);

            if (!appInfo) {
                return {
                    success: false,
                    commissionRate: 0
                }
            }

            return {
                success: true,
                commissionRate: appInfo.commissionRate_drivers
            }
        } catch (error) {
            throw error;
        }
    }

}

export default AppInfoService;