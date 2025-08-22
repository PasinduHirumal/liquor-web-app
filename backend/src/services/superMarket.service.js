import BaseService from "./BaseService.js";
import SuperMarket from "../models/SuperMarket.js";


class SuperMarketService extends BaseService {
    constructor() {
        super('super_markets', SuperMarket, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt'
        })

        // Set the ID field name for this service(for searchMultiWords)
        this.idField = 'id';
    }

    async findByStreetAddress(address) {
        try {
            const docs = await this.findByFilter('streetAddress', '==', address);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async findByLocation(location) {
        try {
            const addDocs  = await this.findAll();
            
            const GPS_TOLERANCE = 0.0001; 

            const duplicateLocation = addDocs.find(place => {
                if (!place.location) return false;
                
                const latDiff = Math.abs(place.location.lat - location.lat);
                const lngDiff = Math.abs(place.location.lng - location.lng);
                
                return latDiff <= GPS_TOLERANCE && lngDiff <= GPS_TOLERANCE;
            });
            
            return duplicateLocation || null;
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
                    const validResults = wordResults.filter(doc => doc && doc[this.idField] && doc[this.idField].toString().trim() !== '');
                    results = new Set(validResults.map(doc => doc[this.idField]));
                } else {
                    // Keep only documents that contain all words (intersection)
                    const validWordResults = wordResults.filter(doc => doc && doc[this.idField] && doc[this.idField].toString().trim() !== '');
                    const wordIds = new Set(validWordResults.map(doc => doc[this.idField]));
                    results = new Set([...results].filter(id => wordIds.has(id)));
                }
                
                // If no intersection, break early
                if (results.size === 0) break;
            }

            if (results.size === 0) return [];

            // Fetch the actual documents
            const finalResults = [];
            for (const docId of results) {
                if (docId && docId.toString().trim() !== '') {
                    try {
                        const doc = await this.findById(docId);
                        if (doc) finalResults.push(doc);
                    } catch (docError) {
                        console.warn(`Error fetching document with ID ${docId}:`, docError.message);
                    }
                }
            }
            
            return finalResults;
        } catch (error) {
            throw error;
        }
    }

    // GENERATE SEARCH TOKENS - Called automatically on create/update
    generateSearchTokens(marketData) {
        const tokens = new Set();
        
        // Define searchable fields
        const searchableFields = [
            marketData.superMarket_Name,
            marketData.city,
            marketData.state,
            marketData.country,
            marketData.streetAddress // Added street address for more comprehensive search
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
            const searchableFields = ['superMarket_Name', 'city', 'state', 'country', 'streetAddress'];
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
            
            const allMarkets = await this.findAll();
            let processed = 0;
            let errors = 0;
            
            for (const market of allMarkets) {
                try {
                    const searchTokens = this.generateSearchTokens(market);
                    await super.updateById(market.id, { searchTokens });
                    processed++;
                    
                    if (processed % 10 === 0) {
                        console.log(`Processed ${processed}/${allMarkets.length} documents...`);
                    }
                } catch (error) {
                    console.error(`Error updating document ${market.id}:`, error.message);
                    errors++;
                }
            }
            
            console.log(`Migration complete! Processed: ${processed}, Errors: ${errors}`);
            return { processed, errors, total: allMarkets.length };
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

export default SuperMarketService;