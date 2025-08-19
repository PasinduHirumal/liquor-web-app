import bcrypt from "bcryptjs";
import BaseService from "./BaseService.js";
import AdminUsers from "../models/AdminUsers.js";


class AdminUserService extends BaseService {
    constructor () {
        super('admin_users', AdminUsers, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt'
        })
    }

    async findByEmail(email) {
        try {
            const docs = await this.findByFilter('email', '==', email);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async findByGoogleId(googleId) {
        try {
            const docs = await this.findByFilter('googleId', '==', googleId);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async findByPhone(phone) {
        try {
            const docs = await this.findByFilter('phone', '==', phone);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async findByRole(role) {
        try {
            const docs = await this.findByFilter('role', '==', role);
            
            if (docs.length === 0){
                return null;
            }

            return docs;
        } catch (error) {
            throw error;
        }
    }

    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

}

export default AdminUserService;