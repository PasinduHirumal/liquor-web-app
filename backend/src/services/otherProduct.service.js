import BaseService from "./BaseService.js";
import OtherProducts from "../models/OtherProducts.js";


class OtherProductService extends BaseService {
    constructor () {
        super('other_products', OtherProducts, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
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

    // PRIMARY SEARCH METHOD - Use this in your controller
    async search(searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                return await this.findAll();
            }

            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            
            // Use Firestore array-contains for efficient searching
            const docs = await this.findByFilter('searchTokens', 'array-contains', lowerSearchTerm);
            
            return docs;
        } catch (error) {
            throw error;
        }
    }

    // ADVANCED SEARCH - Search for multiple words
    async searchMultiWords(searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                return await this.findAll();
            }

            const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
            
            if (searchWords.length === 1) {
                return await this.search(searchTerm);
            }

            // For multiple words, we need to fetch results for each word and find intersection
            let results = null;
            
            for (const word of searchWords) {
                const wordResults = await this.findByFilter('searchTokens', 'array-contains', word);
                
                if (results === null) {
                    results = new Set(wordResults.map(doc => doc.id));
                } else {
                    // Keep only documents that contain all words (intersection)
                    const wordIds = new Set(wordResults.map(doc => doc.id));
                    results = new Set([...results].filter(id => wordIds.has(id)));
                }
                
                // If no intersection, break early
                if (results.size === 0) break;
            }

            if (results.size === 0) return [];

            // Fetch the actual documents
            const finalResults = [];
            for (const id of results) {
                const doc = await this.findById(id);
                if (doc) finalResults.push(doc);
            }
            
            return finalResults;
        } catch (error) {
            throw error;
        }
    }

    // GENERATE SEARCH TOKENS - Called automatically on create/update
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
                const cleanField = field.toLowerCase().trim();
                
                // Add the full field as a token
                tokens.add(cleanField);
                
                // Split by spaces and add individual words
                cleanField.split(/\s+/).forEach(word => {
                    if (word.length > 0) {
                        tokens.add(word);
                        
                        // Add partial matches for words longer than 3 characters
                        if (word.length > 3) {
                            for (let i = 3; i <= word.length; i++) {
                                tokens.add(word.substring(0, i));
                            }
                        }
                    }
                });
            }
        });

        return Array.from(tokens);
    }

    // OVERRIDE CREATE - Automatically add search tokens
    async create(data) {
        try {
            // Generate and add search tokens
            data.searchTokens = this.generateSearchTokens(data);
            
            return await super.create(data);
        } catch (error) {
            throw error;
        }
    }

    // OVERRIDE UPDATE - Automatically update search tokens when needed
    async updateById(id, updateData) {
        try {
            const searchableFields = ['name', 'description', 'product_from'];
            const hasSearchableUpdate = searchableFields.some(field => field in updateData);
            
            if (hasSearchableUpdate) {
                // Get current document to merge with updates
                const currentDoc = await this.findById(id);
                if (currentDoc) {
                    const mergedData = { ...currentDoc, ...updateData };
                    updateData.searchTokens = this.generateSearchTokens(mergedData);
                }
            }
            
            return await super.updateById(id, updateData);
        } catch (error) {
            throw error;
        }
    }

    // MIGRATION METHOD - Run this once to update existing documents
    async addSearchTokensToExistingDocuments() {
        try {
            console.log('Starting search tokens migration...');
            
            const allDocs = await this.findAll();
            let processed = 0;
            let errors = 0;
            
            for (const doc of allDocs) {
                try {
                    const searchTokens = this.generateSearchTokens(doc);
                    const doc_id = doc.id != null ? doc.id : doc.product_id;
                    await super.updateById(doc_id, { searchTokens });
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

    // SEARCH WITH FILTERS - Combine search with other filters
    async searchWithFilters(searchTerm, filters = {}) {
        try {
            let results;
            
            if (searchTerm && searchTerm.trim() !== '') {
                results = await this.search(searchTerm);
                
                // Apply additional filters on the search results
                if (Object.keys(filters).length > 0) {
                    results = results.filter(market => {
                        return Object.entries(filters).every(([field, value]) => {
                            if (value === undefined || value === null || value === '') {
                                return true;
                            }
                            return market[field] === value;
                        });
                    });
                }
            } else {
                // No search term, just apply filters
                results = await this.findWithFilters(filters);
            }
            
            return results;
        } catch (error) {
            throw error;
        }
    }
}

export default OtherProductService;