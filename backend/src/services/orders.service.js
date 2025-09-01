import BaseService from "./BaseService.js";
import Orders from "../models/Orders.js";
import ORDER_STATUS from "../enums/orderStatus.js";


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

            const totalBalance = orders.reduce((sum, order) => {
                const balanceValue = order.total_amount;
                return sum + balanceValue;
            }, 0);

            return {
                Total_TAX: parseFloat(totalTAX.toFixed(2)),
                Total_Delivery_Fee: parseFloat(totalDeliveries.toFixed(2)),
                Total_Balance: parseFloat(totalBalance.toFixed(2))
            };
        } catch (error) {
            throw error;
        }
    }

    async getDeliveryStats(driver_id) {
        try {
            const docs_total = await this.findByFilter('assigned_driver_id', '==', driver_id);

            const docs_completed = await this.collection
                .where('assigned_driver_id', '==', driver_id)
                .where('status', '==', ORDER_STATUS.DELIVERED)
                .get();

            const docs_cancelled = await this.collection
                .where('assigned_driver_id', '==', driver_id)
                .where('status', '==', ORDER_STATUS.CANCELLED)
                .get();

            const docs_not_accepted = await this.collection
                .where('assigned_driver_id', '==', driver_id)
                .where('status', '==', ORDER_STATUS.PROCESSING)
                .get();

            const docs_on_going = await this.collection
                .where('assigned_driver_id', '==', driver_id)
                .where('status', '==', ORDER_STATUS.OUT_FOR_DELIVERY)
                .get();


            return {
                total: docs_total.length,
                completed: docs_completed.size,
                cancelled: docs_cancelled.size,
                notAccepted: docs_not_accepted.size,
                onGoing: docs_on_going.size
            };
        } catch (error) {
            throw error;
        }
    }

    async getOrdersCountForWarehouse(filters = {}) {
        try {
            const orders = await this.findWithFilters(filters);

            return orders.length;
        } catch (error) {
            throw error;
        }
    }

    async getOrdersCountForSuperMarket(supermarket_id, additionalFilters = {}) {
        try {
            let query = this.collection.where('superMarket_ids', 'array-contains', supermarket_id);

            // Apply additional filters (except date range which needs special handling)
            Object.entries(additionalFilters).forEach(([field, value]) => {
                if (field !== 'dateRange' && value !== undefined && value !== null) {
                    query = query.where(field, '==', value);
                }
            });

            // Handle date range separately if needed
            if (additionalFilters.dateRange) {
                const { start, end } = additionalFilters.dateRange;
                query = query.where('created_at', '>=', start).where('created_at', '<=', end);
            }

            const ordersRef = await query.get();
            return ordersRef.size;
        } catch (error) {
            throw error;
        }
    }

}

export default OrdersService;