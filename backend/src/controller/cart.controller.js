import CartService from "../services/cart.service.js";

const cartService = new CartService();

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