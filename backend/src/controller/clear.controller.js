import AddressService from "../services/address.service.js";
import CartService from "../services/cart.service.js"
import CategoryService from "../services/category.service.js";
import MoneyWithdrawService from "../services/moneyWithdraws.service.js";
import OrderItemsService from "../services/orderItems.service.js";
import OrdersService from "../services/orders.service.js";

const cartService = new CartService();
const addressService = new AddressService();
const categoryService = new CategoryService();
const ordersService = new OrdersService();
const orderItemsService = new OrderItemsService();
const moneyWithdrawsService = new MoneyWithdrawService();

export const clearCart = async (req, res) => {
    try {
        await cartService.clearCart(req.user.id);
    } catch (error) {
        console.error("Clear my cart error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const clearAddresses = async (req, res) => {
    try {
        await addressService.clearAddresses(req.user.id);
    } catch (error) {
        console.error("Clear my addresses error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const clearCategories = async (req, res) => {
    try {
        await categoryService.clearCategories();
    } catch (error) {
        console.error("Clear categories error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const clearOrders= async (req, res) => {
    try {
        await ordersService.clearOrders();
    } catch (error) {
        console.error("Clear categories error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const clearOrderItems = async (req, res) => {
    try {
        await orderItemsService.clearOrderItems();
    } catch (error) {
        console.error("Clear categories error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const clearMoneyWithdraws = async (req, res) => {
    try {
        await moneyWithdrawsService.clearWithdraws();
    } catch (error) {
        console.error("Clear categories error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}