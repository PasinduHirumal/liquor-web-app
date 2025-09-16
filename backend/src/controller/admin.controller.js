import AdminUserService from '../services/adminUsers.service.js';
import CompanyService from "../services/company.service.js";
import generateToken from '../utils/createToken.js';
import ADMIN_ROLES from '../enums/adminRoles.js';
import populateWhereHouse from "../utils/populateWhere_House.js";

const adminService = new AdminUserService();
const companyService = new CompanyService();

const getAdminById = async (req, res) => {
    try {
        const admin = await adminService.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found"});
        }

        let populatedAdmin = null;
        try {
            populatedAdmin = await populateWhereHouse(admin);
        } catch (error) {
            console.error("Error populating where house:", error);
            return res.status(500).json({ success: false, message: "Failed to populate where house" });
        }

        // Remove password before sending user
        const { password, ...adminWithoutPassword } = populatedAdmin;

        return res.status(200).json({ success: true, message: "Admin found: ", data: adminWithoutPassword});
    } catch (error) {
        console.error("Get admin by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllAdmins = async (req, res) => {
	try {
        const { isAdminAccepted, isActive, where_house_id } = req.query;

        const filters = {};
        const filterDescription = [];

        if (isActive !== undefined) {
            const isBoolean = isActive === 'true';
            filters.isActive = isBoolean;
            filterDescription.push(`isActive: ${isActive}`);
        } 
        if (isAdminAccepted !== undefined) {
            const isBoolean = isAdminAccepted === 'true';
            filters.isAdminAccepted = isBoolean;
            filterDescription.push(`isAdminAccepted: ${isAdminAccepted}`);
        }
        if (where_house_id !== undefined) {
            const where_house = await companyService.findById(where_house_id);
            if (!where_house) {
                return res.status(400).json({ success: false, message: "Invalid warehouse id" });
            }
            
            filters.where_house_id = where_house_id;
            filterDescription.push(`where_house_id: ${where_house_id}`);
        }

        // Use database filtering instead of in-memory filtering
        const filteredAdmins = Object.keys(filters).length > 0 
            ? await adminService.findWithFilters(filters)
            : await adminService.findAll();

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

        let populatedAdmin = null;
        try {
            populatedAdmin = await populateWhereHouse(sortedUsers);
        } catch (error) {
            console.error("Error populating where house:", error);
            return res.status(500).json({ success: false, message: "Failed to populate where house" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "All admins received successfully", 
            count: sortedUsers.length, 
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null,
            data: populatedAdmin
        });
    } catch (error) {
        console.error("Get all admins error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateAdminImportantFieldsById = async (req, res) => {
	try {
        const admin_id = req.params.id;
        const { role, isAdminAccepted, where_house_id} = req.body;

        const admin = await adminService.findById(admin_id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found"});
        }

        if (where_house_id !== undefined) {
            const warehouse = await companyService.findById(where_house_id);
            if (!warehouse) {
                return res.status(400).json({ success: false, message: "Invalid Warehouse id" });
            }
            if (!warehouse.isActive) {
                return res.status(400).json({ success: false, message: "Warehouse is in Not-Active" });
            }
        }

        if (isAdminAccepted !== undefined && isAdminAccepted === true) {
            req.body.role = ADMIN_ROLES.ADMIN;
        }

        const updateData = { ...req.body };

        // Update the admin
        const updatedAdmin = await adminService.updateById(admin.id, updateData);
        if (!updatedAdmin) {
            return res.status(400).json({ success: false, message: "Failed to update admin"});
        }

        const username = `${updatedAdmin.firstName} ${updatedAdmin.lastName}`;
        
        if (role !== undefined && admin_id === req.user.id) {
            const payload = {
                id: updatedAdmin.id,
                email: updatedAdmin.email,
                username: username,
                role: updatedAdmin.role,
                where_house: user.where_house_id || null,
            };

            generateToken(payload, res);
            console.log("New token created")
        }

        // remove password
        const { password, ...adminWithoutPassword } = updatedAdmin;

        return res.status(200).json({ success: true, message: `Admin ${username} updated successfully`, data: adminWithoutPassword});
    } catch (error) {
        console.error("Update admin error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateAdminById = async (req, res) => {
    try {
        const admin_id = req.params.id;

        const admin = await adminService.findById(admin_id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found"});
        }

        const updateData = { ...req.body };

        // Update the admin
        const updatedAdmin = await adminService.updateById(admin.id, updateData);
        if (!updatedAdmin) {
            return res.status(400).json({ success: false, message: "Failed to update admin"});
        }

        // remove password
        const { password, ...adminWithoutPassword } = updatedAdmin;

        const username = `${updatedAdmin.firstName} ${updatedAdmin.lastName}`;

        return res.status(200).json({ success: true, message: `${username} updated successfully`, data: adminWithoutPassword});
    } catch (error) {
        console.error("Update admin error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

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

export { updateAdminById, updateAdminImportantFieldsById, getAllAdmins, deleteAdmin, getAdminById }