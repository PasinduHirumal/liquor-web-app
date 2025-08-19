import BaseService from "./BaseService.js";
import CompanyDetails from "../models/CompanyDetails.js";


class CompanyService extends BaseService {
    constructor () {
        super('company_details', CompanyDetails, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

    async findByWarehouseName(warehouse_name) {
        try {
            const docs = await this.findByFilter('where_house_name', '==', warehouse_name);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

}

export default CompanyService;