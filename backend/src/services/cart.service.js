import initializeFirebase from "../config/firebase.config.js";
import BaseService from "./BaseService.js";
import Cart from "../models/Cart.js";

const { db } = initializeFirebase();

class CartService extends BaseService {
    constructor() {
        super('cart_items', Cart, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        });
        this.usersCollection = db.collection('users');
    }

    getCollection(userId) {
        if (!userId) {
            throw new Error('UserId is required for cart operations');
        }
        return this.usersCollection.doc(userId).collection('cart_items');
    }

    // Override BaseService methods to work with sub-collections
    async findById(userId, cartId) {
        try {
            const collection = this.getCollection(userId);
            const doc = await collection.doc(cartId).get();
            
            if (!doc.exists) {
                return null;
            }
        
            const data = doc.data();
            return new this.ModelClass(doc.id, data);
        } catch (error) {
            throw error;
        }
    }

    async findAllByUserId(userId) {
        try {
            const collection = this.getCollection(userId);
            const docsRef = await collection.get();

            if (docsRef.empty) {
                return [];
            }

            return docsRef.docs.map(doc => new this.ModelClass(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async findByFilter(userId, field, operator, value) {
        try {
            const collection = this.getCollection(userId);
            const docsRef = await collection.where(field, operator, value).get();

            if (docsRef.empty) {
                return [];
            }

            return docsRef.docs.map(doc => new this.ModelClass(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async findWithFilters(userId, filters = {}) {
        try {
            let query = this.getCollection(userId);
            
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

            // Apply other filters (excluding dateRange and userId)
            Object.entries(filters).forEach(([field, value]) => {
                if (value !== undefined && value !== null && field !== 'dateRange') {
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

    async create(userId, data) {
        try {
            const collection = this.getCollection(userId);
            const timestamp = new Date().toISOString();
            
            const docRef = await collection.add({
                ...data,
                [this.timestampFields.createdAt]: timestamp,
                [this.timestampFields.updatedAt]: timestamp
            });

            return new this.ModelClass(docRef.id, data);
        } catch (error) {
            throw error;
        }
    }

    async updateById(userId, cartId, updateData) {
        try {
            const collection = this.getCollection(userId);
            const doc = await collection.doc(cartId).get();

            if (!doc.exists) {
                return false;
            }
            
            updateData[this.timestampFields.updatedAt] = new Date().toISOString();
        
            await collection.doc(cartId).update(updateData);
        
            const updatedData = await this.findById(userId, cartId);
            return updatedData;
        } catch (error) {
            throw error;
        }
    }

    async deleteById(userId, cartId) {
        try {
            const collection = this.getCollection(userId);
            const doc = await collection.doc(cartId).get();

            if (!doc.exists) {
                return false;
            }

            await collection.doc(cartId).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }


    // helper methods
    async isItemInCart(userId, productId) {
        const items = await this.findByFilter(userId, 'product_id', '==', productId);
        
        let is_item_in_cart = false;
        if (items.length > 0) {
            is_item_in_cart = true;
        }

        return is_item_in_cart;
    }
};

export default CartService;