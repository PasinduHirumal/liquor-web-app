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

    async getUniqueProduct(order_id, product_id) {
        try {
            const doc = await this.collection
                .where('order_id', '==', order_id)
                .where('product_id', '==', product_id)
                .limit(1)
                .get();
            
            if (doc.empty) {
                return false;
            }

            return new this.ModelClass(doc.id, doc.data);
        } catch (error) {
            throw error;
        }
    }

    async getProfitForProduct(order_id, product_id) {
        try {
            const product = await this.getUniqueProduct(order_id, product_id);
            if (!product) return false;
            
            return product.unit_profit_value;
        } catch (error) {
            throw error;
        }
    }

    async getProductProfitsForOrders(orderIds, productIds) {
        try {
            const productProfits = {};
            
            // Initialize all products with 0 profit
            productIds.forEach(id => {
                productProfits[id] = 0;
            });

            // Get all order items for the given orders
            for (const orderId of orderIds) {
                try {
                    const orderItems = await this.findAllByOrderId(orderId);
                    
                    orderItems.forEach(item => {
                        if (productIds.includes(item.product_id)) {
                            // Use the actual profit value from the order item
                            productProfits[item.product_id] = parseFloat(item.unit_profit_value || 0);
                        }
                    });
                } catch (orderError) {
                    console.error(`Error fetching order items for order ${orderId}:`, orderError);
                    // Continue with other orders even if one fails
                    continue;
                }
            }

            return productProfits;
        } catch (error) {
            console.error('Error fetching product profits:', error);
            throw error;
        }
    }

    async getOrderItemsMapping(orderIds) {
        try {
            const orderItemsMapping = {};
            
            // Process each order to build the mapping
            await Promise.all(
                orderIds.map(async (orderId) => {
                    try {
                        const orderItems = await this.findAllByOrderId(orderId);
                        orderItemsMapping[orderId] = {};
                        
                        orderItems.forEach(item => {
                            orderItemsMapping[orderId][item.product_id] = {
                                product_name: item.product_name || '',
                                unit_selling_price: parseFloat(item.unit_selling_price || 0),
                                unit_cost_price: parseFloat(item.unit_cost_price || 0),
                                unit_profit_value: parseFloat(item.unit_profit_value || 0),
                                product_quantity: parseInt(item.product_quantity || 0),
                                total_price: parseFloat(item.total_price || 0),
                                isProfit: item.isProfit || false
                            };
                        });
                    } catch (orderError) {
                        console.error(`Error fetching order items for order ${orderId}:`, orderError);
                        orderItemsMapping[orderId] = {};
                    }
                })
            );
            
            return orderItemsMapping;
        } catch (error) {
            console.error('Error creating order items mapping:', error);
            throw error;
        }
    }
}


export default OrderItemsService;