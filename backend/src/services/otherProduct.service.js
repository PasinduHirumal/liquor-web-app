import BaseService from "./BaseService.js";
import OtherProducts from "../models/OtherProducts.js";


class OtherProductService extends BaseService {
    constructor () {
        super('other_products', OtherProducts, {
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

    // functions
    async getTotalStockValue() {
        try {
            const products = await this.findAll();
            return products.reduce((total, product) => {
                return total + (product.stock_quantity * product.price);
            }, 0);
        } catch (error) {
            throw error;
        }
    }

    async updateStock(productId, addQuantity, withdrawQuantity) {
        try {
            const product = await this.findById(productId);
            if (!product) return false;
            
            const newStockQuantity = product.stock_quantity + addQuantity - withdrawQuantity;
            
            const updateData = {
                add_quantity: addQuantity,
                withdraw_quantity: withdrawQuantity,
                stock_quantity: newStockQuantity,
                is_in_stock: newStockQuantity > 0
            };
            
            return await this.updateById(productId, updateData);
        } catch (error) {
            throw error;
        }
    }
}

export default OtherProductService;