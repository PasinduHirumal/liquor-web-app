import ProductService from '../services/product.service.js';
import CategoryService from '../services/category.service.js';
import populateCategory from '../utils/populateCategory.js';
import { uploadImages } from '../utils/firebaseStorage.js';

const productService = new ProductService();
const categoryService = new CategoryService();

const createProduct = async (req, res) => {
	try {
        const { category_id, images } = req.body;

        const category = await categoryService.findById(category_id);
        if (!category) {
            return res.status(400).json({ success: false, message: "Invalid category"});
        }

        if (images !== undefined) {
            try {
                const imageUrls = await uploadImages(images, 'products');
                req.body.images = imageUrls;
                console.log('✅ Images uploaded successfully:', imageUrls);
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload images" 
                });
            }
        }

        const productData = { ...req.body };
        const product = await productService.create(productData);
        if (!product) {
            return res.status(400).json({ success: false, message: "Failed to create product"});
        }

        const populatedProduct = await populateCategory(product);

        return res.status(201).json({ success: true, message: "Product created successfully", data: populatedProduct });
    } catch (error) {
        console.error("Create product error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

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

const updateProduct = async (req, res) => {
	try {
        //return res.status(400).json({ success: false, message: ""});
        return res.status(200).json({ success: true, message: ""});
    } catch (error) {
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getAllProducts, createProduct, };