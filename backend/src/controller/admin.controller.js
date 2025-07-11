import AdminUserService from '../services/adminUsers.service.js';
import generateToken from '../utils/createToken.js';
import ADMIN_ROLES from '../enums/adminRoles.js';

const adminService = new AdminUserService();

const getAllAdmins = async (req, res) => {
	try {
        const admins = await adminService.findAll();

        const rolePriority = {
            [ADMIN_ROLES.SUPER_ADMIN]: 3,
            [ADMIN_ROLES.ADMIN]: 2,
            [ADMIN_ROLES.PENDING]: 1
        };

        const sortedUsers = admins.length > 0
        ? admins.sort((a, b) => {
            const priorityA = rolePriority[a.role] || 0;
            const priorityB = rolePriority[b.role] || 0;

            if (priorityB !== priorityA) {
                return priorityB - priorityA;
            }

            return (a.firstName || '').localeCompare(b.firstName || '');
            })
            .map(admin => {
                const { password, ...adminWithoutPassword } = admin;
                return adminWithoutPassword;
            })
        : [];

        return res.status(200).json({ success: true, message: "All admins received successfully", count: sortedUsers.length, data: sortedUsers});
    } catch (error) {
        console.error("Get all admins error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateAdmin = async (req, res) => {
	try {
        const adminIdToUpdate = req.params.id;
        const currentUserId = req.user.id;

        // Only allow users to update their own profile unless admin
        if (req.user.role !== ADMIN_ROLES.SUPER_ADMIN && currentUserId !== adminIdToUpdate) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this admin' });
        }
        
        // Don't allow role change unless admin
        if (req.body.role && req.user.role !== ADMIN_ROLES.SUPER_ADMIN) {
            delete req.body.role;
        }

        const admin = await adminService.findById(adminIdToUpdate);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found"});
        }

        let isUpdatingTokenValue = false;
        if (req.body.role && currentUserId === adminIdToUpdate) {
            isUpdatingTokenValue = true;
        }

        let updatedAdmin = await adminService.updateById(admin.id, req.body);
        if (!updatedAdmin) {
            return res.status(400).json({ success: false, message: "Failed to update admin"});
        }

        if (updatedAdmin.isAdminAccepted) {
            updatedAdmin = await adminService.updateById(admin.id, { role: ADMIN_ROLES.ADMIN });
            if (!updatedAdmin) {
                return res.status(400).json({ success: false, message: "Failed to update admin"});
            }
        }
        
        if (isUpdatingTokenValue) {
            const payload = {
                id: updatedAdmin.id,
                email: updatedAdmin.email,
                username: `${updatedAdmin.firstName} ${updatedAdmin.lastName}`,
                role: updatedAdmin.role,
            };

            generateToken(payload, res);
            console.log("New token created")
        }

        // remove password
        updatedAdmin.password = undefined;

        return res.status(200).json({ success: true, message: "Admin updated successfully", data: updatedAdmin});
    } catch (error) {
        console.error("Update admin error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { updateAdmin, getAllAdmins }