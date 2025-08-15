import BaseService from "./BaseService.js";
import SuperMarket from "../models/SuperMarket.js";


class SuperMarketService extends BaseService {
    constructor() {
        super('super_markets', SuperMarket, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt'
        })
    }

    async findByStreetAddress(address) {
        try {
            const docs = await this.findByFilter('streetAddress', '==', address);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }
}

export default SuperMarketService;