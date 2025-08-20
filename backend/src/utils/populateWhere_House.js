import CompanyService from '../services/company.service.js';

const companyService = new CompanyService();

const populateWhereHouse = async (data) => {
    const populateOne = async (category) => {
        // Check for both userId and user_id field names
        const userIdField = category.hasOwnProperty('where_house_id') ? 'where_house_id' : 'warehouse_id';
        const userIdValue = category[userIdField];
        
        // Handle both string ID and object with ID
        const authorId = typeof userIdValue === 'string' 
            ? userIdValue 
            : userIdValue?.id;
            
        if (authorId) {
            try {
                const whereHouse = await companyService.findById(authorId);
                if (whereHouse) {
                    category[userIdField] = {
                        id: whereHouse.id,
                        code: whereHouse.where_house_code,
                        name: whereHouse.where_house_name,
                        location: whereHouse.where_house_location
                    };
                } else {
                    category[userIdField] = null;
                }
            } catch (error) {
                console.error('Error populate where house:', error);
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

export default populateWhereHouse;