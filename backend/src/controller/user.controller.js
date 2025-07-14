import UserService from '../services/users.service.js';
import generateToken from '../utils/createToken.js';
import User_ROLES from '../enums/userRoles.js';

const userService = new UserService();

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
            [User_ROLES.USER]: 1
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


export { getAllUsers, };