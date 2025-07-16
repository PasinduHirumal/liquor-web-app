import CategoryService from '../services/category.service.js';

const categoryService = new CategoryService();

const populateCategory = async (data) => {
    const populateOne = async (product) => {
        // Handle both string ID and object with ID
        const categoryId = typeof product.category_id === 'string' 
            ? product.category_id 
            : product?.category_id?.id;
            
        if (categoryId) {
            try {
                const categoryData = await categoryService.findById(categoryId);
                if (categoryData) {
                    product.category_id = {
                        id: categoryData.category_id || categoryId,
                        name: categoryData.name,
                        description: categoryData.description,
                        is_active: categoryData.is_active,
                    };
                } else {
                    product.category_id = null;
                }
            } catch (error) {
                console.error('Error fetching category:', error);
                product.category_id = null;
            }
        }
        return product;
    };

    if (Array.isArray(data)) {
        return Promise.all(data.map(populateOne));
    } else {
        return populateOne(data);
    }
};

export default populateCategory;