import AdminUserService from '../services/adminUsers.service.js';

const adminService = new AdminUserService();

const populateAdmin = async (data) => {
    const populateOne = async (category) => {
        // Handle both string ID and object with ID
        const authorId = typeof category.userId === 'string' 
            ? category.userId 
            : category?.userId?.id;
            
        if (authorId) {
            try {
                const user = await adminService.findById(authorId);
                if (user) {
                    category.userId = {
                        id: user.id,
                        email: user.email,
                        username: `${user.firstName} ${user.lastName}`
                    };
                } else {
                    category.userId = null;
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                category.userId = null;
            }
        }
        return category;
    };

    if (Array.isArray(data)) {
        return Promise.all(data.map(populateOne));
    } else {
        return populateOne(data);
    }
};

export default populateAdmin;
