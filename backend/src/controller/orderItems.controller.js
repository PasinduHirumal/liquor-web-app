import OrderItemsService from "../services/orderItems.service.js";
import OrdersService from '../services/orders.service.js';
import UserService from "../services/users.service.js";
import ProductService from '../services/product.service.js';
import OtherProductService from '../services/otherProduct.service.js';

const orderItemsService = new OrderItemsService();
const orderService = new OrdersService();
const userService = new UserService();
const liquorService = new ProductService();
const groceryService = new OtherProductService();

const createOrderItem = async ({ order_id, product_id, quantity }) => {
	try {
        const filters = {};

        filters.order_id = order_id;
        filters.product_id = product_id;

        const existingOrderItem = await orderItemsService.findWithFilters(filters);

        let orderItemResult = existingOrderItem;
        let isNewData = false;

        if (existingOrderItem.length === 0) {
            const order = await orderService.findById(order_id);
            const user = await userService.findById(order.user_id);

            let product_temp = await liquorService.findById(product_id);
            if (!product_temp) {
                product_temp = await groceryService.findById(product_id);
            }

            const product = product_temp;
            const profitValue = parseFloat((product.selling_price - product.cost_price).toFixed(2));
            const total_price = parseFloat((product.selling_price * quantity).toFixed(2));

            const orderItemData = {
                order_id: order_id,
                order_number: order.order_number,
                user: {
                    user_id: order.user_id,
                    username: `${user.firstName} ${user.lastName}`,
                },
                product_id: product_id,
                product_name: product.name,
                product_image: product.main_image,
                product_quantity: quantity,
                unit_cost_price: product.cost_price,
                unit_marked_price: product.marked_price,
                unit_discount_value: product.discount_amount,
                unit_selling_price: product.selling_price,
                unit_profit_value: profitValue,
                isProfit: profitValue > 0,
                total_price: total_price
            };

            const orderItem = await orderItemsService.create(orderItemData);

            orderItemResult = orderItem;
            isNewData = true;
        }
        
        return { 
            success: true, 
            isNew: isNewData,
            result: orderItemResult
        };
    } catch (error) {
        console.error('Order item creation error:', error);
        return { 
            success: false, 
            error: "Failed to create Order item" 
        };
    }
};

const getAllOrderItemsForAnOrder = async (req, res) => {
	try {
        const order_id = req.params.id;

        const order = await orderService.findById(order_id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found"});
        }

        const orderItems = await orderItemsService.findAllByOrderId(order_id);
        
        return res.status(200).json({ 
            success: true, 
            message: `Order items for #${order_id}, fetched successfully`,
            count: orderItems.length,
            data: orderItems
        });
    } catch (error) {
        console.error("Get All Order Items For An Order error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createOrderItem, getAllOrderItemsForAnOrder };