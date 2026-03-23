import CartService from "../services/cart.service.js";
import CompanyService from "../services/company.service.js";
import SuperMarketService from "../services/superMarket.service.js";
import ProductService from "../services/product.service.js";
import OtherProductService from "../services/otherProduct.service.js";

const cartService        = new CartService();
const warehouseService   = new CompanyService();
const superMarketService = new SuperMarketService();
const liquorService      = new ProductService();
const groceryService     = new OtherProductService();

// ── Shared: split + validate cart items ──────────────────────────────────────
export const splitAndValidateCartItems = async (cartItems) => {
    // Fetch all products and determine type
    const productsWithType = await Promise.all(
        cartItems.map(async (item) => {
            let product = await liquorService.findById(item.product_id);
            if (product) return { item, product, is_liquor: true };

            product = await groceryService.findById(item.product_id);
            if (product) return { item, product, is_liquor: false };

            return { item, product: null, is_liquor: null };
        })
    );

    // Check not found
    const notFound = productsWithType.filter(p => p.product === null);
    if (notFound.length > 0) {
        return {
            success: false,
            status: 404,
            message: "Some products not found",
            data: notFound.map(p => ({
                cart_item_id: p.item.cart_item_id,
                product_id:   p.item.product_id,
                productName:  p.item.productName,
            }))
        };
    }

    const liquorItems  = productsWithType.filter(p =>  p.is_liquor).map(p => ({ ...p.item, product: p.product }));
    const groceryItems = productsWithType.filter(p => !p.is_liquor).map(p => ({ ...p.item, product: p.product }));

    // Validate both collections in parallel
    const [liquorValidation, groceryValidation] = await Promise.all([
        liquorItems.length  > 0 ? liquorService.validateCartItems(liquorItems)   : { isValid: true, errors: [], updatedItems: [] },
        groceryItems.length > 0 ? groceryService.validateCartItems(groceryItems) : { isValid: true, errors: [], updatedItems: [] },
    ]);

    const allErrors      = [...liquorValidation.errors,      ...groceryValidation.errors];
    const allUpdatedItems = [...liquorValidation.updatedItems, ...groceryValidation.updatedItems];

    if (allErrors.length > 0) {
        return {
            success: false,
            status: 400,
            message: "Some cart items have issues",
            errors: allErrors,
            updatedItems: allUpdatedItems,
        };
    }

    return {
        success: true,
        productsWithType,
        liquorItems,
        groceryItems,
        updatedItems: allUpdatedItems,
    };
};

// ── Shared: build financial ──────────────────────────────────────────────────
export const calculateFinancial = (cartItems, productsWithType, warehouse, distance) => {
    const subtotal = cartItems.reduce((sum, item) => {
        const product = productsWithType.find(p => p.item.product_id === item.product_id)?.product;
        return sum + (product.selling_price * item.quantity);
    }, 0);

    const total_cost_price = cartItems.reduce((sum, item) => {
        const product = productsWithType.find(p => p.item.product_id === item.product_id)?.product;
        return sum + (product.cost_price * item.quantity);
    }, 0);

    const service_charge = parseFloat(((subtotal * warehouse.service_charge) / 100).toFixed(2));
    const tax_amount     = parseFloat(((subtotal * warehouse.tax_charge)     / 100).toFixed(2));
    const delivery_fee   = parseFloat((distance.totalDistanceKm * warehouse.delivery_charge_for_1KM).toFixed(2));
    const total_amount   = parseFloat((subtotal + service_charge + tax_amount + delivery_fee).toFixed(2));

    return { subtotal, total_cost_price, service_charge, tax_amount, delivery_fee, total_amount };
};

// ── Shared: build items snapshot ──────────────────────────────────────────────
export const buildItemsSnapshot = (cartItems, productsWithType) => {
    return cartItems.map(item => {
        const product = productsWithType.find(p => p.item.product_id === item.product_id)?.product;
        return {
            product_id:       item.product_id,
            product_name:     product.name,
            product_image:    product.main_image,
            unitCostPrice:    product.cost_price,
            unit_price:       product.selling_price,
            quantity:         item.quantity,
            total_cost_price: parseFloat((product.cost_price   * item.quantity).toFixed(2)),
            total_price:      parseFloat((product.selling_price * item.quantity).toFixed(2)),
        };
    });
};

// ── Shared: get warehouse + distance ─────────────────────────────────────────
export const resolveWarehouseAndDistance = async (address, cartItems, liquorItems) => {
    const warehouseResult = await warehouseService.getNearestWarehouse(address);
    if (warehouseResult.distanceMeters === Infinity) {
        return { success: false, status: 400, message: "Cannot calculate distance to any warehouse" };
    }

    const warehouse = warehouseResult.warehouse;

    if (liquorItems.length > 0 && !warehouse.isLiquorActive) {
        return { success: false, status: 400, message: "Nearest warehouse does not support liquor delivery" };
    }

    const supermarketLocations = await superMarketService.getSupermarketLocations(cartItems);
    const distance = await cartService.calculateTotalDistance(warehouse, supermarketLocations, address);

    return { success: true, warehouse, supermarketLocations, distance };
};