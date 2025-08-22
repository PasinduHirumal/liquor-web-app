import bcrypt from "bcryptjs";
import initializeFirebase from "../config/firebase.config.js";

const { db } = initializeFirebase();

class BaseService {
    constructor(collectionName, ModelClass, options = {}) {
        this.collection = db.collection(collectionName);
        this.ModelClass = ModelClass;
        this.timestampFields = {
            createdAt: options.createdAtField || 'created_at',
            updatedAt: options.updatedAtField || 'updated_at'
        };
        this.idField = options.idField || 'id';
        this.searchableFields = options.searchableFields || [];
    }

    async findById(id) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) {
                return null;
            }
        
            const data = doc.data();
            return new this.ModelClass(doc.id, data);
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const docsRef = await this.collection.get();

            if (docsRef.empty) {
                return [];
            }

            return docsRef.docs.map(doc => new this.ModelClass(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async findWithFilters(filters = {}) {
        try {
            let query = this.collection;
            
            // Handle date range filtering 
            if (filters.dateRange) {
                const { start, end } = filters.dateRange;
                
                // Convert to Firestore Timestamps if they're Date objects
                const startTimestamp = start instanceof Date ? start : start.toDate();
                const endTimestamp = end instanceof Date ? end : end.toDate();
                
                query = query
                    .where(this.timestampFields.createdAt, '>=', startTimestamp)
                    .where(this.timestampFields.createdAt, '<=', endTimestamp);
            }

            // Apply other filters
            Object.entries(filters).forEach(([field, value]) => {
                if (value !== undefined && value !== null) {
                    query = query.where(field, '==', value);
                }
            });

            const docsRef = await query.get();

            if (docsRef.empty) {
                return [];
            }

            return docsRef.docs.map(doc => new this.ModelClass(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async findByFilter(field, operator, value) {
        try {
            const docsRef = await this.collection.where(field, operator, value).get();

            if (docsRef.empty) {
                return [];
            }

            return docsRef.docs.map(doc => new this.ModelClass(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async findByMultipleFilters(filterGroups = []) {
        try {
            const results = new Map(); // Use Map to avoid duplicates
            
            // Execute each filter group and collect results
            for (const filters of filterGroups) {
                const docs = await this.findWithFilters(filters);
                docs.forEach(doc => results.set(doc.id, doc));
            }
            
            return Array.from(results.values());
        } catch (error) {
            throw error;
        }
    }

    async count(filters = {}) {
        try {
            let query = this.collection;
            
            // Apply filters if provided
            Object.entries(filters).forEach(([field, value]) => {
                if (value !== undefined && value !== null) {
                    query = query.where(field, '==', value);
                }
            });

            const snapshot = await query.get();
            return snapshot.size;
        } catch (error) {
            throw error;
        }
    }

    async create(data) {
        try {
            // Hash password if it's being created
            if (data.password) {
                const salt = await bcrypt.genSalt(10);
                data.password = await bcrypt.hash(data.password, salt);
            }

            // Generate search tokens if searchable fields are configured
            if (this.searchableFields.length > 0) {
                data.searchTokens = this.generateSearchTokens(data);
            }

            const timestamp = new Date().toISOString();
            const docRef = await this.collection.add({
                ...data,
                [this.timestampFields.createdAt]: timestamp,
                [this.timestampFields.updatedAt]: timestamp
            });

            const createdData = {
                ...data,
                [this.timestampFields.createdAt]: timestamp,
                [this.timestampFields.updatedAt]: timestamp
            };

            return new this.ModelClass(docRef.id, createdData);
        } catch (error) {
            throw error;
        }
    }

    async updateById(id, updateData) {
        try {
            const doc = await this.collection.doc(id).get();

            if (!doc.exists) {
                return null;
            }

            // Hash password if it's being updated
            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }

            // Update search tokens if searchable fields are modified
            if (this.searchableFields.length > 0) {
                const hasSearchableUpdate = this.searchableFields.some(field => 
                    this.hasNestedProperty(updateData, field)
                );
                
                if (hasSearchableUpdate) {
                    const currentDoc = await this.findById(id);
                    if (currentDoc) {
                        const mergedData = { ...currentDoc, ...updateData };
                        updateData.searchTokens = this.generateSearchTokens(mergedData);
                    }
                }
            }
            
            updateData[this.timestampFields.updatedAt] = new Date().toISOString();
        
            await this.collection.doc(id).update(updateData);
        
            const updatedData = await this.findById(id);
            return updatedData;
        } catch (error) {
            throw error;
        }
    }


    async deleteById(id) {
        try {
            const doc = await this.collection.doc(id).get();

            if (!doc.exists) {
                return false;
            }

            await this.collection.doc(id).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }

    // SEARCH METHODS
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

    async searchWithFilters(searchTerm, filters = {}) {
        try {
            let results;
            
            if (searchTerm && searchTerm.trim() !== '') {
                results = await this.search(searchTerm);
                
                // Apply additional filters on the search results
                if (Object.keys(filters).length > 0) {
                    results = results.filter(item => {
                        return Object.entries(filters).every(([field, value]) => {
                            if (value === undefined || value === null || value === '') {
                                return true;
                            }
                            return item[field] === value;
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

    generateSearchTokens(objectData) {
        const tokens = new Set();
        
        // Use the configured searchable fields
        this.searchableFields.forEach(field => {
            const value = this.getNestedValue(objectData, field);
            
            if (value !== undefined && value !== null) {
                if (typeof value === 'string') {
                    this.addStringTokens(tokens, value);
                } else if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (typeof item === 'string') {
                            this.addStringTokens(tokens, item);
                        }
                    });
                }
            }
        });

        return Array.from(tokens);
    }

    // Helper method to get nested object values (e.g., "flavour.primary_flavour")
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    addStringTokens(tokens, str) {
        const cleanField = str.toLowerCase().trim();
        
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

    // Migration method for adding search tokens to existing documents
    async addSearchTokensToExistingDocuments() {
        try {
            console.log(`Starting search tokens migration for ${this.collection.id}...`);
            
            const allDocs = await this.findAll();
            let processed = 0;
            let errors = 0;
            
            for (const doc of allDocs) {
                try {
                    const searchTokens = this.generateSearchTokens(doc);
                    const doc_id = doc.id != null ? doc.id : doc[this.idField];
                    await this.updateById(doc_id, { searchTokens });
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

    hasNestedProperty(obj, path) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length; i++) {
            if (current.hasOwnProperty(keys[i])) {
                if (i === keys.length - 1) {
                    return true; // Found the final key
                }
                current = current[keys[i]];
            } else {
                // Check if it's a partial match (e.g., updating entire "flavour" object)
                if (i < keys.length - 1) {
                    return keys.slice(0, i + 1).join('.') in obj;
                }
                return false;
            }
        }
        return false;
    }
}

export default BaseService;