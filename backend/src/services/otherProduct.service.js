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
}

export default OtherProductService;