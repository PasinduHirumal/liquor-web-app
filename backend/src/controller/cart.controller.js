import AddressService from "../services/address.service.js";
import CartService from "../services/cart.service.js";
import CompanyService from "../services/company.service.js";
import OtherProductService from "../services/otherProduct.service.js";
import ProductService from "../services/product.service.js";
import SuperMarketService from "../services/superMarket.service.js";

const cartService = new CartService();
const liquorProductService = new ProductService();
const groceryProductService = new OtherProductService();
const addressService = new AddressService();
const warehouseService = new CompanyService();
const superMarketService = new SuperMarketService();

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

        let tempProduct = await liquorProductService.findById(productId);
        if (!tempProduct) {
            tempProduct = await groceryProductService.findById(productId);
        }

        const product = tempProduct;

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

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItemId = req.params.cart_item_id;

        const cartItem = await cartService.findById(userId, cartItemId);

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        const isDeleted = await cartService.deleteById(userId, cartItemId);
        if (!isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Failed to remove item from cart"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully"
        });
    } catch (error) {
        console.error("Remove from cart error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getMyCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const items = await cartService.findAllByUserId(userId);

        return res.status(200).json({
            success: true,
            count: items.length,
            message: "My cart fetched successfully",
            data: items
        })
    } catch (error) {
        console.error("Get my cart error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const changeQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItemId = req.params.cart_item_id;
        const { quantity } = req.body;

        const cartItem = await cartService.findById(userId, cartItemId);

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        const updateData = { quantity: quantity };
        const updatedCartItem = await cartService.updateById(
            userId, 
            cartItemId, 
            updateData
        );

        if (!updatedCartItem) {
            return res.status(400).json({
                success: false,
                message: "Failed to update quantity"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Quantity updated successfully",
            data: updatedCartItem
        })
    } catch (error) {
        console.error("Change item quantity in cart error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const checkoutCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = req.params.address_id;

        // get address
        const address = await addressService.findById(userId, addressId);
        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // get cart items
        const cartItems = await cartService.findAllByUserId(userId);

        // validate products
        const result = await productService.validateCartItems(cartItems);
        if (!result.isValid) {
            return res.status(404).json({
                success: false,
                message: result.errors || result.updatedItems
            });
        }

        // get nearest warehouse
        const warehouse = await warehouseService.getNearestWarehouse(address);
        if (warehouse.distanceMeters === Infinity) {
            return res.status(400).json({
                success: false,
                message: "Cannot calculate distance"
            });
        }

        // get supermarket locations
        const supermarketLocations = await superMarketService.getSupermarketLocations(cartItems);

        // calculate total distance
        const distance = await cartService.calculateTotalDistance(warehouse, supermarketLocations, address);

        // checkout cart
        const details = await cartService.checkoutCart(cartItems, warehouse, distance);

        return res.status(200).json({
            success: true,
            message: "checkout successful",
            data: details
        })
    } catch (error) {
        console.error("Checkout cart error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}