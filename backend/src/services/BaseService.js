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

    // New method for multiple field searches (OR logic)
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
}

export default BaseService;