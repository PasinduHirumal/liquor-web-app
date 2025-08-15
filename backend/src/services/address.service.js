import initializeFirebase from "../config/firebase.config.js";
import BaseService from "./BaseService.js";
import Addresses from "../models/Addresses.js";

const { db } = initializeFirebase();

class AddressService extends BaseService {
    constructor() {
        // Initialize BaseService with a dummy collection name since we'll override collection handling
        super('addresses', Addresses, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
        this.usersCollection = db.collection('users');
    }

    // Override collection getter to work with sub-collections
    getCollection(userId) {
        if (!userId) {
            throw new Error('UserId is required for address operations');
        }
        return this.usersCollection.doc(userId).collection('addresses');
    }

    // Override BaseService methods to work with sub-collections
    async findById(userId, addressId) {
        try {
            const collection = this.getCollection(userId);
            const doc = await collection.doc(addressId).get();
            
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

    async updateById(userId, addressId, updateData) {
        try {
            const collection = this.getCollection(userId);
            const doc = await collection.doc(addressId).get();

            if (!doc.exists) {
                return false;
            }
            
            updateData[this.timestampFields.updatedAt] = new Date().toISOString();
        
            await collection.doc(addressId).update(updateData);
        
            const updatedData = await this.findById(userId, addressId);
            return updatedData;
        } catch (error) {
            throw error;
        }
    }

    async deleteById(userId, addressId) {
        try {
            const collection = this.getCollection(userId);
            const doc = await collection.doc(addressId).get();

            if (!doc.exists) {
                return false;
            }

            await collection.doc(addressId).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }


    // Additional method to get all addresses across all users (if needed)
    async findAllAddressesGlobally() {
        try {
            const usersSnapshot = await this.usersCollection.get();
            const allAddresses = [];

            for (const userDoc of usersSnapshot.docs) {
                const addressesSnapshot = await userDoc.ref.collection('addresses').get();
                const userAddresses = addressesSnapshot.docs.map(doc => ({
                    ...new this.ModelClass(doc.id, doc.data()),
                    userId: userDoc.id // Include userId for reference
                }));
                allAddresses.push(...userAddresses);
            }

            return allAddresses;
        } catch (error) {
            throw error;
        }
    }
}

export default AddressService;