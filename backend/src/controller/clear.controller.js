import AddressService from "../services/address.service.js";
import CartService from "../services/cart.service.js"
import CategoryService from "../services/category.service.js";

const cartService = new CartService();
const addressService = new AddressService();
const categoryService = new CategoryService();

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