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
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // ── Split cart items into liquor / grocery ──────────────────────────
        // Fetch all products in parallel to check is_liquor flag
        const productsWithType = await Promise.all(
            cartItems.map(async (item) => {
                // try liquor collection first, then grocery
                let product = await liquorProductService.findById(item.product_id);
                if (product) return { item, product, is_liquor: true };

                product = await groceryProductService.findById(item.product_id);
                if (product) return { item, product, is_liquor: false };

                return { item, product: null, is_liquor: null }; // not found
            })
        );

        // Check if any product was not found in either collection
        const notFound = productsWithType.filter(p => p.product === null);
        if (notFound.length > 0) {
            return res.status(404).json({
                success: false,
                message: "Some products not found",
                data: notFound.map(p => ({
                    cart_item_id: p.item.cart_item_id,
                    product_id: p.item.product_id,
                    productName: p.item.productName,
                }))
            });
        }

        const liquorItems   = productsWithType.filter(p => p.is_liquor).map(p => ({ ...p.item, product: p.product }));
        const groceryItems  = productsWithType.filter(p => !p.is_liquor).map(p => ({ ...p.item, product: p.product }));

        // ── Validate separately ─────────────────────────────────────────────
        const [liquorValidation, groceryValidation] = await Promise.all([
            liquorItems.length  > 0 ? liquorProductService.validateCartItems(liquorItems)  : { isValid: true, errors: [], updatedItems: [] },
            groceryItems.length > 0 ? groceryProductService.validateCartItems(groceryItems) : { isValid: true, errors: [], updatedItems: [] },
        ]);

        const allErrors      = [...liquorValidation.errors,      ...groceryValidation.errors];
        const allUpdatedItems = [...liquorValidation.updatedItems, ...groceryValidation.updatedItems];

        if (allErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Some cart items have issues",
                errors: allErrors,
                updatedItems: allUpdatedItems,
            });
        }

        // ── Get nearest warehouse ───────────────────────────────────────────
        const warehouse = await warehouseService.getNearestWarehouse(address);
        if (warehouse.distanceMeters === Infinity) {
            return res.status(400).json({
                success: false,
                message: "Cannot calculate distance to any warehouse"
            });
        }

        // Check if warehouse supports liquor (if cart has liquor items)
        if (liquorItems.length > 0 && !warehouse.warehouse.isLiquorActive) {
            return res.status(400).json({
                success: false,
                message: "Nearest warehouse does not support liquor delivery"
            });
        }

        // ── Get supermarket locations ───────────────────────────────────────
        const supermarketLocations = await superMarketService.getSupermarketLocations(cartItems);

        // ── Calculate total distance ────────────────────────────────────────
        const distance = await cartService.calculateTotalDistance(warehouse, supermarketLocations, address);

        // ── Checkout ────────────────────────────────────────────────────────
        const details = await cartService.checkoutCart(cartItems, warehouse, distance);

        return res.status(200).json({
            success: true,
            message: "Checkout successful",
            data: {
                ...details,
                summary: {
                    total_items:   cartItems.length,
                    liquor_items:  liquorItems.length,
                    grocery_items: groceryItems.length,
                }
            }
        });

    } catch (error) {
        console.error("Checkout cart error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}