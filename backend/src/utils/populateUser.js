import UserService from '../services/users.service.js';

const userService = new UserService();

const populateUser = async (data) => {
    const populateOne = async (category) => {
        // Check for both userId and user_id field names
        const userIdField = category.hasOwnProperty('userId') ? 'userId' : 'user_id';
        const userIdValue = category[userIdField];
        
        // Handle both string ID and object with ID
        const authorId = typeof userIdValue === 'string' 
            ? userIdValue 
            : userIdValue?.id;
            
        if (authorId) {
            try {
                const user = await userService.findById(authorId);
                if (user) {
                    category[userIdField] = {
                        id: user.user_id,
                        email: user.email,
                        username: `${user.firstName} ${user.lastName}`
                    };
                } else {
                    category[userIdField] = null;
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                category[userIdField] = null;
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

export default populateUser;