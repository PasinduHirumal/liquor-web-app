import initializeFirebase from "../config/firebase.config.js";
import Orders from "../models/Orders.js";

const { db } = initializeFirebase();

class OrdersService {
    constructor () {
        this.collection = db.collection('orders');
    }

    async findById(id) {
        try {
            const userDoc = await this.collection.doc(id).get();
            if (!userDoc.exists) {
                return null;
            }
        
            const userData = userDoc.data();
            return new Orders(userDoc.id, userData);
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            const usersRef = await this.collection.get();

            if (usersRef.empty) {
                return [];
            }

            return usersRef.docs.map(doc => new Orders(doc.id, doc.data()));
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

            const ordersRef = await query.get();

            if (ordersRef.empty) {
                return [];
            }

            return ordersRef.docs.map(doc => new Orders(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async findByFilter(field, operator, value) {
        try {
            const usersRef = await this.collection.where(field, operator, value).get();

            if (usersRef.empty) {
                return [];
            }

            return usersRef.docs.map(doc => new Orders(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async create(data) {
        try {
            const userRef = await this.collection.add({...data,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

            return new Orders(userRef.id, data);
        } catch (error) {
            throw error;
        }
    }

    async updateById(id, updateData) {
        try {
            const userDoc = await this.collection.doc(id).get();

            if (!userDoc.exists) {
                return false;
            }
            
            updateData.updated_at = new Date().toISOString();
        
            await this.collection.doc(id).update(updateData);
        
            const updatedData = await this.findById(id);
            return updatedData;
        } catch (error) {
            throw error;
        }
    }

    async deleteById(id) {
        try {
            const userDoc = await this.collection.doc(id).get();

            if (!userDoc.exists) {
                return false;
            }

            await this.collection.doc(id).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }
}

export default OrdersService;