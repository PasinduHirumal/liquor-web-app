import BaseService from "./BaseService.js";
import Products from "../models/Products.js";


class ProductService extends BaseService {
    constructor () {
        super('products', Products, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

}

export default ProductService;