import AddressService from "../services/address.service.js";
import CartService from "../services/cart.service.js";
import OtherProductService from "../services/otherProduct.service.js";
import ProductService from "../services/product.service.js";
import { buildItemsSnapshot, calculateFinancial, resolveWarehouseAndDistance, splitAndValidateCartItems } from "./checkout.controller.js";

const cartService = new CartService();
const liquorProductService = new ProductService();
const groceryProductService = new OtherProductService();
const addressService = new AddressService();

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

        const supermarketIds = [];

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
        const userId    = req.user.id;
        const addressId = req.params.address_id;

        // 1. Get address
        const address = await addressService.findById(userId, addressId);
        if (!address) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }
        const normalizedAddress = { ...address, lat: address.latitude, lng: address.longitude };

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
        const routeResult = await resolveWarehouseAndDistance(normalizedAddress, cartItems, liquorItems);
        if (!routeResult.success) {
            return res.status(routeResult.status).json({ success: false, message: routeResult.message });
        }
        const { warehouse, distance, supermarketLocations } = routeResult;

        // 5. Financial + items
        const finance = calculateFinancial(cartItems, productsWithType, warehouse, distance);
        const items   = buildItemsSnapshot(cartItems, productsWithType);

        // 6. Supermarket ids
        const productIds = [
            ...new Set(cartItems.map(
                item => item.product_id
            ))
        ];

        const supermarketIds = await cartService.getSupermarketIds(productIds);

        return res.status(200).json({
            success: true,
            message: "Checkout preview successful",
            data: {
                finance,
                distance: {
                    totalDistanceKm:   distance.totalDistanceKm,
                    totalDurationText: distance.totalDurationText,
                    legs:              distance.legs,
                },
                estimated_delivery: new Date(Date.now() + distance.totalDurationSeconds * 1000),
                warehouse: {
                    id:   warehouse.id,
                    name: warehouse.where_house_name,
                },
                supermarkets: supermarketIds,
                updatedItems: validation.updatedItems, // price change warnings
                items,
                summary: {
                    total_items:   cartItems.length,
                    liquor_items:  liquorItems.length,
                    grocery_items: validation.groceryItems.length,
                }
            }
        });

    } catch (error) {
        console.error("Checkout cart error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};