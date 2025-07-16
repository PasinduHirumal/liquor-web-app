import ProductService from '../services/product.service.js';
import populateCategory from '../utils/populateCategory.js';

const productService = new ProductService();

const getAllProducts = async (req, res) => {
	try {
        const { is_active } = req.query;

        const products = await productService.findAll();
        if (!products) {
            return res.status(400).json({ success: false, message: "Failed to fetch products"});
        }
        
        let filteredProducts;
        let filterDescription = [];
        if (is_active !== undefined) {
            // Convert string to boolean since query params are strings
            const isActiveBoolean = is_active === 'true';
            filteredProducts = products.filter(product => product.is_active === isActiveBoolean);
            filterDescription.push(`isActive: ${is_active}`);
        } else {
            filteredProducts = products;
        }

        const populatedProducts = await populateCategory(filteredProducts);
        if (!populatedProducts) {
            return res.status(400).json({ success: false, message: "Error in populate products"});
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