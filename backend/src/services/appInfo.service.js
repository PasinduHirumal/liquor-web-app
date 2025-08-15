import BaseService from "./BaseService.js";
import AppInfo from "../models/AppInfo.js";

class AppInfoService extends BaseService {
    constructor() {
        super('app_info', AppInfo, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt'
        })
    }

    async findByDescription(description) {
        try {
            const docs = await this.findByFilter('description', '==', description);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }
}

export default AppInfoService;