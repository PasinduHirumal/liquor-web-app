import bcrypt from "bcryptjs"
import initializeFirebase from "../config/firebase.config.js";
import Users from "../models/Users.js"

const { db } = initializeFirebase();

class UserService {
    constructor () {
        this.collection = db.collection('users');
    }

    async findById(id) {
        try {
            const userDoc = await this.collection.doc(id).get();
            if (!userDoc.exists) {
                return null;
            }
        
            const userData = userDoc.data();
            return new Users(userDoc.id, userData);
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
            return new Users(userDoc.id, userDoc.data());
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
            return new Users(userDoc.id, userDoc.data());
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
            return new Users(userDoc.id, userDoc.data());
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

            return new Users(userRef.id, userData);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default UserService;