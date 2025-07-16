import initializeFirebase from "../config/firebase.config.js";
import OtherProducts from "../models/OtherProducts.js";

const { db } = initializeFirebase();

class OtherProductService {
    constructor () {
        this.collection = db.collection('other_products');
    }

    async findById(id) {
        try {
            const userDoc = await this.collection.doc(id).get();
            if (!userDoc.exists) {
                return null;
            }
        
            const userData = userDoc.data();
            return new OtherProducts(userDoc.id, userData);
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

            return usersRef.docs.map(doc => new OtherProducts(doc.id, doc.data()));
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

            return usersRef.docs.map(doc => new OtherProducts(doc.id, doc.data()));
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

            return new OtherProducts(userRef.id, data);
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

    // functions
    async getTotalStockValue() {
        try {
            const products = await this.findAll();
            return products.reduce((total, product) => {
                return total + (product.stock_quantity * product.price);
            }, 0);
        } catch (error) {
            throw error;
        }
    }

    async updateStock(productId, addQuantity, withdrawQuantity) {
        try {
            const product = await this.findById(productId);
            if (!product) return false;
            
            const newStockQuantity = product.stock_quantity + addQuantity - withdrawQuantity;
            
            const updateData = {
                add_quantity: addQuantity,
                withdraw_quantity: withdrawQuantity,
                stock_quantity: newStockQuantity,
                is_in_stock: newStockQuantity > 0
            };
            
            return await this.updateById(productId, updateData);
        } catch (error) {
            throw error;
        }
    }
}

export default OtherProductService;