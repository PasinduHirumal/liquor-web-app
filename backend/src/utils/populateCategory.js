import CategoryService from '../services/category.service.js';
import ADMIN_ROLES from '../enums/adminRoles.js';

const categoryService = new CategoryService();

const populateCategory = async (data, role) => {
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
                        is_liquor: categoryData.is_liquor
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
        const populatedProducts = await Promise.all(data.map(populateOne));

        if (role === ADMIN_ROLES.ADMIN || role === ADMIN_ROLES.SUPER_ADMIN){
            return populatedProducts;
        }

        // Filter out products where category is inactive or null
        return populatedProducts.filter(product => 
            product.category_id && product.category_id.is_active === true
        );
    } else {
        const populatedProduct = await populateOne(data);

        if (role === ADMIN_ROLES.ADMIN || role === ADMIN_ROLES.SUPER_ADMIN){
            return populatedProduct;
        }

        // Return null if category is inactive or null
        return (populatedProduct.category_id && populatedProduct.category_id.is_active === true) 
            ? populatedProduct 
            : null;
    }
};

export default populateCategory;