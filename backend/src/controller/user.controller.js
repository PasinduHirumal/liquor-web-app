import UserService from '../services/users.service.js';
import generateToken from '../utils/createToken.js';
import ADMIN_ROLES from '../enums/adminRoles.js';
import USER_ROLES from '../enums/userRoles.js';

const userService = new UserService();

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await userService.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found"});
        }

        // Remove password before sending user
        const { password, ...userWithoutPassword } = user;

        return res.status(200).json({ success: true, message: "User found: ", data: userWithoutPassword});
    } catch (error) {
        console.error("Get admin by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllUsers = async (req, res) => {
	try {
        const { isAccountCompleted, isActive } = req.query;
        let users;
        let filterDescription = [];

        if (isAccountCompleted !== undefined && isActive !== undefined) {
            return res.status(400).json({ success: false, message: "Pass only one query parameter at a time"});
        }

        if (isAccountCompleted !== undefined){
            // Convert string to boolean (query params are always strings)
            const status = isAccountCompleted === 'true';
            users = await userService.findByFilter('isAccountCompleted', '==', status);
            filterDescription.push(`isAccountCompleted: ${isAccountCompleted}`);
        } else if (isActive !== undefined){
            // Convert string to boolean (query params are always strings)
            const status = isActive === 'true';
            users = await userService.findByFilter('isActive', '==', status);
            filterDescription.push(`isActive: ${isActive}`);
        } else {
            users = await userService.findAll();
        }

        const rolePriority = {
            [USER_ROLES.USER]: 1
        };

        const sortedUsers = users.length > 0
        ? users.sort((a, b) => {
            const priorityA = rolePriority[a.role] || 0;
            const priorityB = rolePriority[b.role] || 0;

            if (priorityB !== priorityA) {
                return priorityB - priorityA;
            }

            return (a.firstName || '').localeCompare(b.firstName || '');
            })
            .map(user => {
                const { password, ...adminWithoutPassword } = user;
                return adminWithoutPassword;
            })
        : [];

        return res.status(200).json({ 
            success: true, 
            message: "All users received successfully", 
            count: sortedUsers.length, 
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null,
            data: sortedUsers
        });
    } catch (error) {
        console.error("Get all users error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateUser = async (req, res) => {
	try {
        const userIdToUpdate = req.params.id;
        const currentUserId = req.user.id;

        const user = await userService.findById(userIdToUpdate);
        if (!user) {
            return res.status(404).json({ success: false, message: "Admin not found"});
        }

        // Authorization logic
        const isSuperAdmin = req.user.role === ADMIN_ROLES.SUPER_ADMIN;
        const isAdmin = req.user.role === ADMIN_ROLES.ADMIN;
        const isUpdatingSelf = currentUserId === userIdToUpdate;

        // Only allow:
        // 1. Super admin can update anyone
        // 2. Admin can update themselves
        if (!isSuperAdmin && !isUpdatingSelf) {
            return res.status(403).json({ success: false, message: "Not authorized to update" });
        }
        
        // Role change restrictions
        if (req.body.role) {
            // Only super admin can change roles
            if (!isSuperAdmin) {
                return res.status(403).json({ success: false, message: "Not authorized to change roles" });
            }

            // Validate role value
            if (!Object.values(USER_ROLES).includes(req.body.role)) {
                return res.status(400).json({ success: false, message: "Invalid role value" });
            }
        }

        let isUpdatingTokenValue = false;
        if (req.body.role && isUpdatingSelf) {
            isUpdatingTokenValue = true;
        }

        let updateData = { ...req.body };

        // Update the admin
        let updatedUser = await userService.updateById(userIdToUpdate, updateData);
        if (!updatedUser) {
            return res.status(400).json({ success: false, message: "Failed to update user"});
        }
        
        if (isUpdatingTokenValue) {
            const payload = {
                id: updatedUser.id,
                email: updatedUser.email,
                username: `${updatedUser.firstName} ${updatedUser.lastName}`,
                role: updatedUser.role,
            };

            generateToken(payload, res);
            console.log("New token created")
        }

        // remove password
        const { password, ...userWithoutPassword } = updatedUser;

        return res.status(200).json({ success: true, message: "User updated successfully", data: userWithoutPassword});
    } catch (error) {
        console.error("Update User error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteUser = async (req, res) => {
	try {
        const userToDeleteId = req.params.id;
        const currentAdminId = req.user.id;

        // Only allow users to delete their own profile unless admin
        if (req.user.role !== ADMIN_ROLES.SUPER_ADMIN && currentAdminId !== userToDeleteId) {
            return res.status(403).json({ success: false, message: "Not authorized to delete" });
        }

        const userToDelete = await userService.findById(userToDeleteId);
        if (!userToDelete) {
            return res.status(404).json({ success: false, message: "User not found"});
        }

        await userService.deleteById(userToDeleteId);
        
        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export { getUserById, getAllUsers, updateUser, deleteUser };