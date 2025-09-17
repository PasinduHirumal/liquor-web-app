import UserService from '../services/users.service.js';
import USER_ROLES from '../enums/userRoles.js';
import getDateFromTimestamp from '../utils/convertFirestoreTimeStrapToDate.js';

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

        const filters = {}
        const filterDescription = [];

        if (isAccountCompleted !== undefined){
            const isBoolean = isAccountCompleted === 'true';
            filters.isAccountCompleted = isBoolean;
            filterDescription.push(`isAccountCompleted: ${isAccountCompleted}`);
        } 
        if (isActive !== undefined){
            const isBoolean = isActive === 'true';
            filters.isActive = isBoolean;
            filterDescription.push(`isActive: ${isActive}`);
        } 

        const users = Object.keys(filters).length > 0
            ? await userService.findWithFilters(filters)
            : await userService.findAll();

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
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            })
        : [];

        sortedUsers.forEach(user => {
            if (user.dateOfBirth) {
                user.dateOfBirth = getDateFromTimestamp(user.dateOfBirth);
            }
        });

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
        const userId = req.params.id;

        const user = await userService.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found"});
        }

        const updateData = { ...req.body };

        const updatedUser = await userService.updateById(userId, updateData);
        if (!updatedUser) {
            return res.status(400).json({ success: false, message: "Failed to update user"});
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
        const userId = req.params.id;

        const user = await userService.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found"});
        }

        const username = `${user.firstName} ${user.lastName}`;

        await userService.deleteById(userId);
        
        return res.status(200).json({ success: true, message: `User ${username} deleted successfully` });
    } catch (error) {
        console.error("Delete user error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export { getUserById, getAllUsers, updateUser, deleteUser };