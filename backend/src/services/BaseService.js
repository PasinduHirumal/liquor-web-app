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
            
            // Handle date range filtering separately
            if (filters.dateRange) {
                const { start, end } = filters.dateRange;
                
                // Firestore Timestamp format (created_at)
                const timestampQuery = this.collection
                    .where('created_at', '>=', start)
                    .where('created_at', '<=', end);
                
                // Then try with ISO string format (created_at)
                const isoQuery = this.collection
                    .where('created_at', '>=', start.toISOString())
                    .where('created_at', '<=', end.toISOString());
                
                // Apply other filters to both queries
                Object.entries(filters).forEach(([field, value]) => {
                    if (field !== 'dateRange' && value !== undefined && value !== null) {
                        timestampQuery = timestampQuery.where(field, '==', value);
                        isoQuery = isoQuery.where(field, '==', value);
                    }
                });
                
                // Execute both queries
                const [timestampResults, isoResults] = await Promise.all([
                    timestampQuery.get().catch(() => ({ docs: [] })),
                    isoQuery.get().catch(() => ({ docs: [] }))
                ]);
                
                // Combine results and remove duplicates
                const allDocs = [...timestampResults.docs, ...isoResults.docs];
                const uniqueDocs = allDocs.filter((doc, index, self) => 
                    index === self.findIndex(d => d.id === doc.id)
                );

                if (!uniqueDocs) {
                    return [];
                }
                
                return uniqueDocs.map(doc => new Orders(doc.id, doc.data()));
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