import BaseService from "./BaseService.js";
import Orders from "../models/Orders.js";


class OrdersService extends BaseService {
    constructor () {
        super('orders', Orders, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

    // Override method
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
                
                return uniqueDocs.map(doc => new this.ModelClass(doc.id, doc.data()));
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

            return ordersRef.docs.map(doc => new this.ModelClass(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async findAllByWarehouseId(warehouse_id) {
        try {
            const docs = await this.findByFilter('warehouse_id', '==', warehouse_id);

            return docs;
        } catch (error) {
            throw error;
        }
    }

}

export default OrdersService;