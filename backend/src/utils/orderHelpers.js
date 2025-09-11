import OrdersService from '../services/orders.service.js';
import ProductService from '../services/product.service.js';
import OtherProductService from '../services/otherProduct.service.js';

const orderService = new OrdersService();
const liquorService = new ProductService();
const groceryService = new OtherProductService();

const extractSupermarketIds = async (orderItems) => {
    const productIds = [];
    const superMarketIds = [];

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
        return superMarketIds;
    }

    // Collect product IDs
    orderItems.forEach(item => {
        if (item.product_id) {
            productIds.push(item.product_id);
        }
    });

    // Fetch supermarket IDs for each product
    for (const productId of productIds) {
        try {
            let product = await liquorService.findById(productId);
            if (!product) {
                product = await groceryService.findById(productId);
            }

            if (product && product.superMarket_id && !superMarketIds.includes(product.superMarket_id)) {
                superMarketIds.push(product.superMarket_id);
            }
        } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
        }
    }

    return superMarketIds;
};

const updateOrderMissingFields = async (order, orderId) => {
    try {
        const updateData = {};

        if (order.is_driver_accepted === undefined) {
            updateData.is_driver_accepted = false;
        }

        if (!order.superMarket_ids || order.superMarket_ids.length === 0) {
            const superMarketIds = await extractSupermarketIds(order.items);
        
            if (superMarketIds.length > 0) {
                updateData.superMarket_ids = superMarketIds;
            }
        }

        if (Object.keys(updateData).length > 0) {
            order = await orderService.updateById(orderId, updateData);
        }

        return order;
    } catch (error) {
        console.error("Error updating supermarket ids and is_driver_accepted:", error);
        throw new Error("Failed to update supermarket ids and is_driver_accepted");
    }
};

export { extractSupermarketIds, updateOrderMissingFields };