import CartService from "../services/cart.service.js";
import ProductService from "../services/product.service.js";

const cartService = new CartService();
const productService = new ProductService();

export const isInCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.product_id;

        const isExistingProduct = await cartService.isItemInCart(userId, productId);

        return res.status(200).json({
            success: true,
            message: "Is item in cart checking successful",
            data: {
                isItemInCart: isExistingProduct,
            }
        });
    } catch (error) {
        console.error("Check is product in cart error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.product_id;

        const isExistingProduct = await cartService.isItemInCart(userId, productId);
        if (isExistingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product is already in your cart"
            });
        }

        const product = await productService.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (!product.is_active) {
            return res.status(400).json({
                success: false,
                message: "Product not active"
            });
        }

        if (!product.is_in_stock) {
            return res.status(400).json({
                success: false,
                message: "Product not in stock"
            });
        }

        const cartData = {
            product_id: productId,
            productName: product.name,
            productImage: product.main_image,
            quantity: 1,
            unit_price: product.selling_price,
        };

        const cartItem = await cartService.create(userId, cartData);
        if (!cartItem) {
            return res.status(400).json({
                success: false,
                message: "Failed to add to cart"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Product added to cart successfully",
            data: cartItem
        });
    } catch (error) {
        console.error("Add to cart error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}