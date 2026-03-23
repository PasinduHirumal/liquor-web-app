import BaseService from "./BaseService.js";
import OtherProducts from "../models/OtherProducts.js";


class OtherProductService extends BaseService {
    constructor () {
        super('other_products', OtherProducts, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at',
            idField: 'product_id',
            searchableFields: [
                'name', 
                'description', 
                'product_from'
            ]
        });
    }

    async findAllBySuperMarket(superMarket_id) {
        try {
            const docs = await this.findByFilter('superMarket_id', '==', superMarket_id);

            return docs;
        } catch (error) {
            throw error;
        }
    }

    // functions
    async getTotalStockValue() {
        try {
            const products = await this.findAll();
            return products.reduce((total, product) => {
                return total + (product.stock_quantity * product.price);
            }, 0);
        } catch (error) {
            throw error;
        }
    }

    async updateStock(productId, addQuantity, withdrawQuantity) {
        try {
            const product = await this.findById(productId);
            if (!product) return false;
            
            const newStockQuantity = product.stock_quantity + addQuantity - withdrawQuantity;
            
            const updateData = {
                add_quantity: addQuantity,
                withdraw_quantity: withdrawQuantity,
                stock_quantity: newStockQuantity,
                is_in_stock: newStockQuantity > 0
            };
            
            return await this.updateById(productId, updateData);
        } catch (error) {
            throw error;
        }
    }

    // GENERATE SEARCH TOKENS - override method
    generateSearchTokens(objectData) {
        const tokens = new Set();
        
        // Define searchable fields
        const searchableFields = [
            objectData.name,
            objectData.description,
            objectData.product_from,
        ];

        searchableFields.forEach(field => {
            if (field && typeof field === 'string') {
                this.addStringTokens(tokens, field);
            }
        });

        return Array.from(tokens);
    }

    async getProfitForProduct(product_id) {
        try {
            const product = await this.findById(product_id);
            if (!product) return false;

            return product.selling_price - product.cost_price;
        } catch (error) {
            throw error;
        }
    }

    async addProfitValueToExistingDocuments() {
        try {
            console.log(`Starting Profit Value migration for ${this.collection.id}...`);
            
            const allDocs = await this.findAll();
            let processed = 0;
            let errors = 0;
            
            for (const doc of allDocs) {
                try {
                    const doc_id = doc.id != null ? doc.id : doc[this.idField];

                    const profit = doc.selling_price - doc.cost_price;
                    const isProfit = profit > 0;

                    const updateData = {
                        profit_value: profit,
                        isProfit: isProfit
                    };

                    await this.updateById(doc_id, updateData);
                    processed++;
                    
                    if (processed % 10 === 0) {
                        console.log(`Processed ${processed}/${allDocs.length} documents...`);
                    }
                } catch (error) {
                    console.error(`Error updating document ${doc.id}:`, error.message);
                    errors++;
                }
            }
            
            console.log(`Migration complete! Processed: ${processed}, Errors: ${errors}`);
            return { processed, errors, total: allDocs.length };
        } catch (error) {
            console.error('Migration failed:', error.message);
            throw error;
        }
    }


    // helper methods
    async validateCartItems(cartItems) {
        const errors = [];
        const updatedItems = [];

        await Promise.all(
            cartItems.map(async (cartItem) => {
                // Fetch product from DB
                const product = await this.findById(cartItem.product_id);

                // 1. Product still exists
                if (!product) {
                    errors.push({
                        cart_item_id: cartItem.cart_item_id,
                        product_id: cartItem.product_id,
                        productName: cartItem.productName,
                        issue: 'PRODUCT_NOT_FOUND',
                        message: `"${cartItem.productName}" is no longer available`,
                    });
                    return;
                }

                // 2. Product is active
                if (!product.is_active) {
                    errors.push({
                        cart_item_id: cartItem.cart_item_id,
                        product_id: cartItem.product_id,
                        productName: cartItem.productName,
                        issue: 'PRODUCT_INACTIVE',
                        message: `"${product.name}" is currently unavailable`,
                    });
                    return;
                }

                // 3. Product is in stock
                if (!product.is_in_stock) {
                    errors.push({
                        cart_item_id: cartItem.cart_item_id,
                        product_id: cartItem.product_id,
                        productName: cartItem.productName,
                        issue: 'OUT_OF_STOCK',
                        message: `"${product.name}" is out of stock`,
                    });
                    return;
                }

                // 4. Requested quantity is available
                if (product.stock_quantity < cartItem.quantity) {
                    errors.push({
                        cart_item_id: cartItem.cart_item_id,
                        product_id: cartItem.product_id,
                        productName: cartItem.productName,
                        issue: 'INSUFFICIENT_STOCK',
                        message: `Only ${product.stock_quantity} unit(s) of "${product.name}" available`,
                        available_quantity: product.stock_quantity,
                        requested_quantity: cartItem.quantity,
                    });
                    return;
                }

                // 5. Price has changed since added to cart
                if (product.selling_price !== cartItem.unit_price) {
                    updatedItems.push({
                        cart_item_id: cartItem.cart_item_id,
                        product_id: cartItem.product_id,
                        productName: product.name,
                        issue: 'PRICE_CHANGED',
                        message: `Price of "${product.name}" has changed`,
                        old_price: cartItem.unit_price,
                        new_price: product.selling_price,
                    });
                }
            })
        );

        if (errors.length > 0) {
            return {
                isValid: false,
                errors,           // ← blocking issues (stop checkout)
                updatedItems,     // ← non-blocking (price changes, warn user)
            };
        }

        return {
            isValid: true,
            errors: [],
            updatedItems,         // ← still notify about price changes even if valid
        };
    }
}

export default OtherProductService;