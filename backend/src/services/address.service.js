import initializeFirebase from "../config/firebase.config.js";
import Addresses from "../models/Addresses.js";

const { db } = initializeFirebase();

class AddressService {
    constructor() {
        this.usersCollection = db.collection('users');
    }

    // Get addresses sub-collection for a specific user
    getAddressesCollection(userId) {
        return this.usersCollection.doc(userId).collection('addresses');
    }

    async findById(userId, addressId) {
        try {
            const addressDoc = await this.getAddressesCollection(userId).doc(addressId).get();
            if (!addressDoc.exists) {
                return null;
            }
        
            const addressData = addressDoc.data();
            return new Addresses(addressDoc.id, addressData);
        } catch (error) {
            throw error;
        }
    }

    async findAllByUserId(userId) {
        try {
            const addressesRef = await this.getAddressesCollection(userId).get();

            if (addressesRef.empty) {
                return [];
            }

            return addressesRef.docs.map(doc => new Addresses(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async findByFilter(userId, field, operator, value) {
        try {
            const addressesRef = await this.getAddressesCollection(userId)
                .where(field, operator, value)
                .get();

            if (addressesRef.empty) {
                return [];
            }

            return addressesRef.docs.map(doc => new Addresses(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async create(userId, data) {
        try {
            const addressRef = await this.getAddressesCollection(userId).add({
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return new Addresses(addressRef.id, data);
        } catch (error) {
            throw error;
        }
    }

    async updateById(userId, addressId, updateData) {
        try {
            const addressDoc = await this.getAddressesCollection(userId).doc(addressId).get();

            if (!addressDoc.exists) {
                return false;
            }
            
            updateData.updatedAt = new Date().toISOString();
        
            await this.getAddressesCollection(userId).doc(addressId).update(updateData);
        
            const updatedData = await this.findById(userId, addressId);
            return updatedData;
        } catch (error) {
            throw error;
        }
    }

    async deleteById(userId, addressId) {
        try {
            const addressDoc = await this.getAddressesCollection(userId).doc(addressId).get();

            if (!addressDoc.exists) {
                return false;
            }

            await this.getAddressesCollection(userId).doc(addressId).delete();
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
                    ...new Addresses(doc.id, doc.data()),
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