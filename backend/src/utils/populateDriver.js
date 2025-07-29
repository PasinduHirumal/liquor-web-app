import DriverService from "../services/driver.service.js";

const driverService = new DriverService();

const populateDriver = async (data) => {
    const populateOne = async (category) => {
        // Check for both userId and user_id field names
        const userIdField = category.hasOwnProperty('assigned_driver_id') ? 'assigned_driver_id' : 'driver_id';
        const userIdValue = category[userIdField];
        
        // Handle both string ID and object with ID
        const authorId = typeof userIdValue === 'string' 
            ? userIdValue 
            : userIdValue?.id;
            
        if (authorId) {
            try {
                const driver = await driverService.findById(authorId);
                if (driver) {
                    category[userIdField] = {
                        id: driver.id,
                        email: driver.email,
                        username: `${driver.firstName} ${driver.lastName}`
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

export default populateDriver;