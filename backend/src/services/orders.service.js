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

    async findAllByProductId(product_id, status = null) {
        try {
            let allOrders;
            if (status) {
                allOrders = await this.findByFilter('status', '==', status);
            } else {
                allOrders = await this.findAll();
            }
            
            // Filter orders that contain the specific product_id in their items array
            const ordersWithProduct = allOrders.filter(order => {
                return order.items && order.items.some(item => item.product_id === product_id);
            });

            return ordersWithProduct;
        } catch (error) {
            throw error;
        }
    }

    // Alternative method using Firestore query (more efficient for large datasets)
    // Note: This requires restructuring your data to have a separate field for product IDs
    async findAllByProductIdOptimized(product_id) {
        try {
            // This approach would work if you stored product_ids as a separate array field
            // Example: product_ids: ["Mv8h6zgcZEzo3i1gidKQ", "injwcpVSvM1JVqHIKh2T"]
            const docsRef = await this.collection
                .where('product_ids', 'array-contains', product_id)
                .get();

            if (docsRef.empty) {
                return [];
            }

            return docsRef.docs.map(doc => new this.ModelClass(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async getTotalIncomeValues(orders) {
        try {
            const totalTAX = orders.reduce((sum, order) => {
                const taxValue = order.tax_amount;
                return sum + taxValue;
            }, 0);

            const totalDeliveries = orders.reduce((sum, order) => {
                const deliveryValue = order.delivery_fee;
                return sum + deliveryValue;
            }, 0);

            return {
                Total_TAX: parseFloat(totalTAX.toFixed(2)),
                Total_Delivery_Fee: parseFloat(totalDeliveries.toFixed(2))
            };
        } catch (error) {
            throw error;
        }
    }

}

export default OrdersService;