import AdminUserService from '../services/adminUsers.service.js';
import CompanyService from "../services/company.service.js";
import generateToken from '../utils/createToken.js';
import ADMIN_ROLES from '../enums/adminRoles.js';

const adminService = new AdminUserService();
const companyService = new CompanyService();

const getAdminById = async (req, res) => {
    try {
        const admin = await adminService.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found"});
        }

        // Remove password before sending user
        const { password, ...adminWithoutPassword } = admin;

        return res.status(200).json({ success: true, message: "Admin found: ", data: adminWithoutPassword});
    } catch (error) {
        console.error("Get admin by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllAdmins = async (req, res) => {
	try {
        const { isAdminAccepted, isActive, where_house_id } = req.query;
        
        const admins = await adminService.findAll();
        if (!admins) {
            return res.status(400).json({ success: false, message: "Failed to get all admins"});
        }

        let filteredAdmins = admins;
        let filterDescription = [];

        if (isActive !== undefined) {
            const isActiveBoolean = isActive === 'true';
            filteredAdmins = filteredAdmins.filter(admin => admin.isActive === isActiveBoolean);
            filterDescription.push(`isActive: ${isActive}`);
        } 
        if (isAdminAccepted !== undefined) {
            const isActiveBoolean = isAdminAccepted === 'true';
            filteredAdmins = filteredAdmins.filter(admin => admin.isAdminAccepted === isActiveBoolean);
            filterDescription.push(`isAdminAccepted: ${isAdminAccepted}`);
        }
        if (where_house_id !== undefined) {
            const where_house = await companyService.findById(where_house_id);
            if (!where_house) {
                return res.status(400).json({ success: false, message: "Invalid where house id" });
            }
            
            filteredAdmins = filteredAdmins.filter(admin => admin.where_house_id === where_house_id);
            filterDescription.push(`where_house_id: ${where_house_id}`);
        }

        const rolePriority = {
            [ADMIN_ROLES.SUPER_ADMIN]: 3,
            [ADMIN_ROLES.ADMIN]: 2,
            [ADMIN_ROLES.PENDING]: 1
        };

        const sortedUsers = filteredAdmins.length > 0
        ? filteredAdmins.sort((a, b) => {
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

        return res.status(200).json({ 
            success: true, 
            message: "All admins received successfully", 
            count: sortedUsers.length, 
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null,
            data: sortedUsers
        });
    } catch (error) {
        console.error("Get all admins error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateAdmin = async (req, res) => {
	try {
        const adminIdToUpdate = req.params.id;
        const currentUserId = req.user.id;
        const { email, phone, isActive, isAdminAccepted, isAccountVerified, where_house_id} = req.body;

        const admin = await adminService.findById(adminIdToUpdate);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found"});
        }

        const where_house = await companyService.findById(where_house_id);
        if (!where_house) {
            return res.status(400).json({ success: false, message: "Invalid where house id" });
        }

        // Authorization logic
        const isSuperAdmin = req.user.role === ADMIN_ROLES.SUPER_ADMIN;
        const isAdmin = req.user.role === ADMIN_ROLES.ADMIN;
        const isUpdatingSelf = currentUserId === adminIdToUpdate;

        // Only allow:
        // 1. Super admin can update anyone
        // 2. Admin can update themselves
        if (!isSuperAdmin && !isUpdatingSelf) {
            return res.status(403).json({ success: false, message: "Not authorized to update" });
        }
        
        // Role change restrictions
        if (req.body.role || isAdminAccepted || isActive || isAccountVerified || where_house_id) {
            // Only super admin can change roles
            if (!isSuperAdmin) {
                return res.status(403).json({ success: false, message: "Not authorized to update" });
            }

            // Validate role value
            if (req.body.role && !Object.values(ADMIN_ROLES).includes(req.body.role)) {
                return res.status(400).json({ success: false, message: "Invalid role value" });
            }
        }

        const updateData = { ...req.body };

        if (email !== undefined || phone !== undefined) {
            updateData.isAccountVerified = false;
        }
        
        // Handle isAdminAccepted logic
        if (updateData.isAdminAccepted === true && admin.role === ADMIN_ROLES.PENDING) {
            // If accepting a pending admin, set their role to ADMIN
            updateData.role = ADMIN_ROLES.ADMIN;
        }

        // Update the admin
        const updatedAdmin = await adminService.updateById(admin.id, updateData);
        if (!updatedAdmin) {
            return res.status(400).json({ success: false, message: "Failed to update admin"});
        }
        
        if (req.body.role && isUpdatingSelf) {
            const payload = {
                id: updatedAdmin.id,
                email: updatedAdmin.email,
                username: `${updatedAdmin.firstName} ${updatedAdmin.lastName}`,
                role: updatedAdmin.role,
                where_house: user.where_house_id || "N/A",
            };

            generateToken(payload, res);
            console.log("New token created")
        }

        // remove password
        const { password, ...adminWithoutPassword } = updatedAdmin;

        return res.status(200).json({ success: true, message: "Admin updated successfully", data: adminWithoutPassword});
    } catch (error) {
        console.error("Update admin error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteAdmin = async (req, res) => {
	try {
        const adminIdToDelete = req.params.id;
        const currentAdminId = req.user.id;

        // Only allow users to delete their own profile unless admin
        if (req.user.role !== ADMIN_ROLES.SUPER_ADMIN && currentAdminId !== adminIdToDelete) {
            return res.status(403).json({ success: false, message: "Not authorized to delete" });
        }

        const adminToDelete = await adminService.findById(adminIdToDelete);
        if (!adminToDelete) {
            return res.status(404).json({ success: false, message: "Admin not found"});
        }

        await adminService.deleteById(adminIdToDelete);
        
        return res.status(200).json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
        console.error("Delete admin error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { updateAdmin, getAllAdmins, deleteAdmin, getAdminById }