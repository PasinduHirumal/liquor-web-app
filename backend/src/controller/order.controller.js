import OrdersService from "../services/orders.service.js";
import CartService from "../services/cart.service.js";
import AddressService from "../services/address.service.js";
import { createOrderItem } from "./orderItems.controller.js";
import ORDER_STATUS from "../enums/orderStatus.js";
import { buildItemsSnapshot, calculateFinancial, resolveWarehouseAndDistance, splitAndValidateCartItems } from "./checkout.controller.js";
import PAYMENT_STATUS from "../enums/paymentStatus.js";

const orderService = new OrdersService();
const cartService = new CartService();
const addressService = new AddressService();

const generateOrderNumber = () => {
    const random = Math.floor(10000000 + Math.random() * 90000000);
    return `LD${random}`;
};

export const createOrder = async (req, res) => {
    try {
        const userId    = req.user.id;
        const addressId = req.params.address_id;
        const { payment_method, notes } = req.body;

        // 1. Get address
        const address = await addressService.findById(userId, addressId);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        // 2. Get cart items
        const cartItems = await cartService.findAllByUserId(userId);
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        // 3. Split & validate
        const validation = await splitAndValidateCartItems(cartItems);
        if (!validation.success) {
            return res.status(validation.status).json(validation);
        }
        const { productsWithType, liquorItems } = validation;

        // 4. Warehouse + distance
        const routeResult = await resolveWarehouseAndDistance(address, cartItems, liquorItems);
        if (!routeResult.success) {
            return res.status(routeResult.status).json({ success: false, message: routeResult.message });
        }
        const { warehouse, distance, supermarketLocations } = routeResult;

        // 5. Financial + items
        const finance = calculateFinancial(cartItems, productsWithType, warehouse, distance);
        const items   = buildItemsSnapshot(cartItems, productsWithType);

        const superMarket_ids  = supermarketLocations.map(sm => sm.superMarket_id);
        const estimatedDelivery = new Date(Date.now() + distance.totalDurationSeconds * 1000);

        // 6. Create order
        const orderData = {
            order_number:        generateOrderNumber(),
            order_date:          new Date(),
            user_id:             userId,
            items,

            delivery_address_id: addressId,
            distance:            distance.totalDistanceKm,
            estimated_delivery:  estimatedDelivery,
            delivered_at:        null,

            ...finance,

            payment_method,
            payment_status:      PAYMENT_STATUS.PENDING,

            notes:               notes || null,
            status:              ORDER_STATUS.PENDING,
            warehouse_id:        warehouse.id,
            superMarket_ids,
            assigned_driver_id:  null,
            driver_earning_id:   null,
            is_driver_accepted:  false,

            created_at:          new Date(),
            updated_at:          new Date(),
        };

        const order = await orderService.create(orderData);

        // 7. Create order items in parallel
        await Promise.all(
            cartItems.map(item => {
                const product = productsWithType.find(p => p.item.product_id === item.product_id)?.product;
                return createOrderItem({
                    order_id:   order.order_id,
                    product_id: item.product_id,
                    cost_price: product.cost_price,
                    unit_price: product.selling_price,
                    quantity:   item.quantity,
                });
            })
        );

        // 8. Clear cart
        await cartService.clearCart(userId);

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: {
                order_id:           order.order_id,
                order_number:       order.order_number,
                status:             order.status,
                payment_method:     order.payment_method,
                payment_status:     order.payment_status,
                estimated_delivery: estimatedDelivery,
                finance,
                distance: {
                    totalDistanceKm:   distance.totalDistanceKm,
                    totalDurationText: distance.totalDurationText,
                },
                items,
            }
        });

    } catch (error) {
        console.error("Create order error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};