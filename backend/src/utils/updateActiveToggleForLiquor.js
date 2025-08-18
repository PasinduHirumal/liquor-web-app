import ProductService from '../services/product.service.js';

const productService = new ProductService();

const updateLiquorProductsActiveStatus = async (is_active) => {
    try {
        // Fetch all liquor products
        const products = await productService.findByFilter('is_liquor', '==', true);
        if (!products || products.length === 0) {
            throw new Error("No liquor products found");
        }

        // Update each product's is_active status
        const updatePromises = products.map(async (product) => {
            const updateData = {
                is_active: is_active,
            };
            
            return await productService.updateById(product.product_id, updateData);
        });
        
        // Wait for all updates to complete
        const updateResults = await Promise.all(updatePromises);
        
        // Check if all updates were successful
        const failedUpdates = updateResults.filter(result => !result);
        if (failedUpdates.length > 0) {
            throw new Error(`Failed to update ${failedUpdates.length} products`);
        }

        // Fetch updated products
        const updatedProducts = await productService.findByFilter('is_liquor', '==', true);
        
        return {
            success: true,
            message: `Successfully updated is_active to ${is_active} for all liquor products`, 
            before_count: products.length,
            updated_count: updatedProducts.length,
            data: updatedProducts
        };
    } catch (error) {
        throw error; // Re-throw to let the controller handle it
    }
};

export default updateLiquorProductsActiveStatus;