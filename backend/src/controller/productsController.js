import ProductService from '../services/product.service.js';
import populateCategory from '../utils/populateCategory.js';

const productService = new ProductService();

const getAllProducts = async (req, res) => {
	try {
        const { is_active, is_in_stock, is_liquor } = req.query;

        const products = await productService.findAll();
        if (!products) {
            return res.status(400).json({ success: false, message: "Failed to fetch products"});
        }
        
        let filteredProducts = products;
        let filterDescription = [];
        if (is_active !== undefined) {
            // Convert string to boolean since query params are strings
            const isActiveBoolean = is_active === 'true';
            filteredProducts = filteredProducts.filter(product => product.is_active === isActiveBoolean);
            filterDescription.push(`isActive: ${is_active}`);
        } 
        
        if (is_in_stock !== undefined){
            const isActiveBoolean = is_in_stock === 'true';
            filteredProducts = filteredProducts.filter(product => product.is_in_stock === isActiveBoolean);
            filterDescription.push(`is_in_stock: ${is_in_stock}`);
        }

        if (is_liquor !== undefined){
            const isActiveBoolean = is_liquor === 'true';
            filteredProducts = filteredProducts.filter(product => product.is_liquor === isActiveBoolean);
            filterDescription.push(`is_liquor: ${is_liquor}`);
        }

        const populatedProducts = await populateCategory(filteredProducts);
        if (!populatedProducts) {
            return res.status(400).json({ success: false, message: "Error in populate products"});
        }

        // Add filter description for category filtering
        if (populatedProducts.length < filteredProducts.length) {
            filterDescription.push('category.isActive: true');
        }

        return res.status(200).json({ 
            success: true, 
            message: "Fetching products successful",
            count: populatedProducts.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: populatedProducts
        });
    } catch (error) {
        console.error("Fetch products error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getAllProducts, };