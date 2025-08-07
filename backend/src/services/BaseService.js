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

    async create(data) {
        try {
            const timestamp = new Date().toISOString();
            const docRef = await this.collection.add({
                ...data,
                [this.timestampFields.createdAt]: timestamp,
                [this.timestampFields.updatedAt]: timestamp
            });

            return new this.ModelClass(docRef.id, data);
        } catch (error) {
            throw error;
        }
    }

    async updateById(id, updateData) {
        try {
            const doc = await this.collection.doc(id).get();

            if (!doc.exists) {
                return false;
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