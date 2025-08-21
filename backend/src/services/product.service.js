import BaseService from "./BaseService.js";
import Products from "../models/Products.js";


class ProductService extends BaseService {
    constructor () {
        super('products', Products, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

    async findAllBySuperMarket(superMarket_id) {
        try {
            const docs = await this.findByFilter('superMarket_id', '==', superMarket_id);

            return docs;
        } catch (error) {
            throw error;
        }
    }

}

export default ProductService;