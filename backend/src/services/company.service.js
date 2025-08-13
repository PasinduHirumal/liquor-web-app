import BaseService from "./BaseService.js";
import CompanyDetails from "../models/CompanyDetails.js";


class CompanyService extends BaseService {
    constructor () {
        super('company_details', CompanyDetails, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

}

export default CompanyService;