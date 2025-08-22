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


}

export default ProductService;