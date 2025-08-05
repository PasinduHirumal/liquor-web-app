import dotenv from 'dotenv';
import ADMIN_ROLES from '../enums/adminRoles.js';
import AdminUserService from '../services/adminUsers.service.js';

dotenv.config();
const adminService = new AdminUserService();

const createDefaultSuperAdmin = async () => {
    try {
        const email = process.env.SUPER_ADMIN_EMAIL;
        const existingSuperAdmin = await adminService.findByEmail(email);

        if (!existingSuperAdmin) {
            
            const superAdminData  = {
                email: process.env.SUPER_ADMIN_EMAIL,
                password: process.env.SUPER_ADMIN_PASSWORD,
                firstName: process.env.SUPER_ADMIN_FIRST_NAME ,
                lastName: process.env.SUPER_ADMIN_LAST_NAME,            
                phone: process.env.SUPER_ADMIN_PHONE,

                role: ADMIN_ROLES.SUPER_ADMIN,
                googleId: '',
                where_house_id: "N/A",

                isAccountVerified: true,
                isAdminAccepted: true,
                isActive: true
            };

            await adminService.create(superAdminData);
            console.log("✅ Default Account created.");
        } else {
            console.log("✅ Default Account already exists.");
        }
    } catch (error) {
        console.error("❌ Error creating default Account:", error);
    }
};


const initializeDefaultSuperAdmin = async () => {
    try {
        await createDefaultSuperAdmin();
        console.log("✅ Default Account initialization completed...");
    } catch (err) {
        console.error("❌ Failed to initialize Default Account:", err.message);
    }
};

export {createDefaultSuperAdmin, initializeDefaultSuperAdmin};
