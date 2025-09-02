import BaseService from "./BaseService.js";
import Products from "../models/Products.js";


class ProductService extends BaseService {
    constructor () {
        super('products', Products, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at',
            idField: 'product_id',
            searchableFields: [
                'name',
                'description', 
                'brand',
                'country',
                'flavour.primary_flavour',
                'flavour.flavour_notes',
                'flavour.fruit_flavours',
                'flavour.spice_flavours',
                'flavour.herbal_flavours',
                'flavour.wood_flavours',
                'flavour.finish_notes',
                'flavour.finish_type',
                'flavour.tasting_profile',
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

    // GENERATE SEARCH TOKENS - Override generateSearchTokens
    generateSearchTokens(objectData) {
        const tokens = new Set();
        
        // Define searchable fields with custom handling
        const searchableFields = [
            objectData.name,
            objectData.description,
            objectData.brand,
            objectData.country,
            objectData.flavour?.primary_flavour,
            ...(objectData.flavour?.flavour_notes || []),
            ...(objectData.flavour?.fruit_flavours || []),
            ...(objectData.flavour?.spice_flavours || []),
            ...(objectData.flavour?.herbal_flavours || []),
            ...(objectData.flavour?.wood_flavours || []),
            ...(objectData.flavour?.finish_notes || []),
            objectData.flavour?.finish_type,
            objectData.flavour?.tasting_profile,
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

export default ProductService;