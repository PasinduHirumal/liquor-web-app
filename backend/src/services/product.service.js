import initializeFirebase from "../config/firebase.config.js";
import Products from "../models/Products.js";

const { db } = initializeFirebase();

class ProductService {
    constructor () {
        this.collection = db.collection('products');
    }

    async findById(id) {
        try {
            const userDoc = await this.collection.doc(id).get();
            if (!userDoc.exists) {
                return null;
            }
        
            const userData = userDoc.data();
            return new Products(userDoc.id, userData);
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

            return usersRef.docs.map(doc => new Products(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async findWithFilters(filters = {}) {
        try {
            let query = this.collection;
            
            // Apply each filter to the query
            Object.entries(filters).forEach(([field, value]) => {
                if (value !== undefined && value !== null) {
                    query = query.where(field, '==', value);
                }
            });

            const usersRef = await query.get();

            if (usersRef.empty) {
                return [];
            }

            return usersRef.docs.map(doc => new Products(doc.id, doc.data()));
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

            return usersRef.docs.map(doc => new Products(doc.id, doc.data()));
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

            return new Products(userRef.id, data);
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

export default ProductService;