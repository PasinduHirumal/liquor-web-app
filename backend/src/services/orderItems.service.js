import BaseService from "./BaseService.js";
import OrderItems from "../models/OrderItems.js";

class OrderItemsService extends BaseService {
    constructor() {
        super('order_items', OrderItems, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt'
        })
    }

    async findAllByOrderId(order_id) {
        try {
            const docs = await this.findByFilter('order_id', '==', order_id);

            return docs;
        } catch (error) {
            throw error;
        }
    }
}


export default OrderItemsService;