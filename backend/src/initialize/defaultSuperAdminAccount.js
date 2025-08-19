import SUPER_ADMIN_DATA from '../data/SuperAdmin.js';
import ADMIN_ROLES from '../enums/adminRoles.js';
import AdminUserService from '../services/adminUsers.service.js';

const adminService = new AdminUserService();

const createDefaultSuperAdmin = async () => {
    try {
        const email = SUPER_ADMIN_DATA.EMAIL;
        const existingSuperAdmin = await adminService.findByEmail(email);

        if (!existingSuperAdmin) {
            
            const superAdminData  = {
                email: SUPER_ADMIN_DATA.EMAIL,
                password: SUPER_ADMIN_DATA.PASSWORD,
                firstName: SUPER_ADMIN_DATA.FIRST_NAME,
                lastName: SUPER_ADMIN_DATA.LAST_NAME,            
                phone: SUPER_ADMIN_DATA.PHONE,

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
