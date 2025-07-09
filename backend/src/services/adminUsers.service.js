import bcrypt from "bcryptjs"
import initializeFirebase from "../config/firebase.config.js";
import AdminUsers from "../models/AdminUsers.js"

const { db } = initializeFirebase();

class AdminUserService {
    constructor () {
        this.collection = db.collection('admin_users');
    }

    async findById(id) {
        try {
            const userDoc = await this.collection.doc(id).get();
            if (!userDoc.exists) {
                return null;
            }
        
            const userData = userDoc.data();
            return new AdminUsers(userDoc.id, userData);
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            const userRef = await this.collection.where('email', '==', email).get();
            
            if (userRef.empty){
                return null;
            }

            const userDoc = userRef.docs[0];
            return new AdminUsers(userDoc.id, userDoc.data());
        } catch (error) {
            throw error;
        }
    }

    async findByGoogleId(googleId) {
        try {
            const userRef = await this.collection.where('googleId', '==', googleId).get();
            
            if (userRef.empty){
                return null;
            }

            const userDoc = userRef.docs[0];
            return new AdminUsers(userDoc.id, userDoc.data());
        } catch (error) {
            throw error;
        }
    }

    async findByPhone(phone) {
        try {
            const userRef = await this.collection.where('phone', '==', phone).get();
            
            if (userRef.empty){
                return null;
            }

            const userDoc = userRef.docs[0];
            return new AdminUsers(userDoc.id, userDoc.data());
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

            return usersRef.docs.map(doc => new AdminUsers(doc.id, doc.data()));
        } catch (error) {
            throw error;
        }
    }

    async create(userData) {
        try {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);

            const userRef = await this.collection.add({...userData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

            return new AdminUsers(userRef.id, userData);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async updateById(id, updateData) {
        try {
            const userDoc = await this.collection.doc(id).get();

            if (!userDoc.exists) {
                return false;
            }

            // Hash password if it's being updated
            if (updateData.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(updateData.password, salt);
            }
            
            updateData.updatedAt = new Date().toISOString();
        
            await this.collection.doc(id).update(updateData);
        
            const updatedUser = await this.findById(id);
            return updatedUser;
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
            console.error('Error deleting user:', error);
            throw error;
        }
    }
}

export default AdminUserService;