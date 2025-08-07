import BaseService from "./BaseService.js";
import CompanyDetails from "../models/CompanyDetails.js";


class SystemService extends BaseService {
    constructor(){
        super('company_details', CompanyDetails, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

    // Add any specific methods here if needed
    async findAllByWhereHouseName(whereHouseName) {
        return this.findByFilter('where_house_name', '==', whereHouseName);
    }
}

export default SystemService;