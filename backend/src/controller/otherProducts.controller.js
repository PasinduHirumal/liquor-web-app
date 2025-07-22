import OtherProductService from '../services/otherProduct.service.js';
import StockHistoryService from '../services/stockHistory.service.js';
import CategoryService from '../services/category.service.js';
import populateCategory from '../utils/populateCategory.js';
import { uploadImages } from '../utils/firebaseStorage.js';
import { validateStockOperation } from '../utils/stockCalculator.js';
import { validatePriceOperation } from '../utils/priceCalculator.js';
import { createStockHistory } from './stockHistory.controller.js';

const categoryService = new CategoryService();
const productService = new OtherProductService();
const stockHistoryService = new StockHistoryService();

const createProduct = async (req, res) => {
	try {
        const { marked_price, discount_percentage, category_id, images } = req.body;

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

        // calculate price
        const markedPrice = marked_price ?? 0;
        const discountPercentage = discount_percentage ?? 0;

        const updatedPrices = validatePriceOperation(markedPrice, discountPercentage);
        if (!updatedPrices.isValid) {
            return res.status(400).json({ success: false, message: stockValidation.error });
        }

        if (req.body.selling_price || req.body.discount_amount) {
            if (req.body.selling_price) delete req.body.selling_price;
            if (req.body.discount_amount) delete req.body.discount_amount;
        }

        const productData = { 
            selling_price: updatedPrices.newPrice,
            discount_amount: updatedPrices.discount,
            ...req.body,
        };

        const product = await productService.create(productData);
        if (!product) {
            return res.status(400).json({ success: false, message: "Failed to create product"});
        }

        const stockHistoryData = {
            type: "default create item",
            quantity: product.stock_quantity,
            productId: product.product_id,
            userId: req.user.id
        }

        const stockHistory = await stockHistoryService.create(stockHistoryData);
        if (!stockHistory) {
            return res.status(400).json({ success: false, message: "Failed to create stock history"});
        }

        // update stock history array
        const currentStockHistory = product.stockHistory || [];
        const updatedStockHistory = [...currentStockHistory, stockHistory.id];

        const updateData = { };
        updateData.stockHistory = updatedStockHistory;

        const updatedProduct = await productService.updateById(product.product_id, updateData);
        if (!updatedProduct) {
            return res.status(400).json({ success: false, message: "Failed to update stock history array"});
        }

        const populatedProduct = await populateCategory(updatedProduct);

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

        // Sort by stock_quantity in ascending order (lowest at first)
        const sortedProducts = populatedProducts.sort((a, b) => {
            return new Date(a.stock_quantity) - new Date(b.stock_quantity);
        });

        return res.status(200).json({ 
            success: true, 
            message: "Fetching products successful",
            count: sortedProducts.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: sortedProducts
        });
    } catch (error) {
        console.error("Fetch products error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getProductById = async (req, res) => {
	try {
        const productId = req.params.id;

        const product = await productService.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found"});
        }

        const populatedProduct = await populateCategory(product);

        return res.status(200).json({ success: true, message: "Product fetched successfully", data: populatedProduct });
    } catch (error) {
        console.error("Get product by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateProduct = async (req, res) => {
	try {
        const productId = req.params.id;
        const { marked_price, discount_percentage, category_id, images, add_quantity, withdraw_quantity } = req.body;

        const product = await productService.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found"});
        } 

        if (category_id !== undefined) {
            const category = await categoryService.findById(category_id);
            if (!category) {
                return res.status(400).json({ success: false, message: "Invalid category"});
            }
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

        // update price
        const markedPrice = marked_price ?? product.marked_price;
        const discountPercentage = discount_percentage ?? product.discount_percentage;

        const updatedPrices = validatePriceOperation(markedPrice, discountPercentage);
        if (!updatedPrices.isValid) {
            return res.status(400).json({ success: false, message: stockValidation.error });
        }

        // quantity update
        const stockValidation = validateStockOperation(
            product.stock_quantity, 
            add_quantity, 
            withdraw_quantity
        );

        if (!stockValidation.isValid) {
            return res.status(400).json({ success: false, message: stockValidation.error });
        }

        // update history 
        let historyId = '';
        if (add_quantity !== undefined || withdraw_quantity !== undefined) {
            const stockUpdateResult  = await createStockHistory({ 
                addQuantity: add_quantity,
                withdrawQuantity: withdraw_quantity,
                productId: productId,
                userId: req.user.id
            });

            if (!stockUpdateResult.shouldCreateHistory) {
                return res.status(400).json({ success: false, message: stockUpdateResult.error });
            }
            historyId = stockUpdateResult.historyId;
        }

        if (req.body.selling_price || req.body.discount_amount) {
            if (req.body.selling_price) delete req.body.selling_price;
            if (req.body.discount_amount) delete req.body.discount_amount;
        }

        const updateData = { 
            selling_price: updatedPrices.newPrice,
            discount_amount: updatedPrices.discount,
            stock_quantity: stockValidation.newStock,
            ...req.body
        };
        
        if (historyId !== '') {
            const currentStockHistory = product.stockHistory || [];
            const updatedStockHistory = [...currentStockHistory, historyId];

            updateData.stockHistory = updatedStockHistory;
        }

        const updatedProduct = await productService.updateById(productId, updateData);
        if (!updatedProduct) {
            return res.status(400).json({ success: false, message: "Failed to update product"});
        }

        const populatedProduct = await populateCategory(updatedProduct);

        return res.status(201).json({ success: true, message: "Product updated successfully", data: populatedProduct });
    } catch (error) {
        console.error("Update product error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteProduct = async (req, res) => {
	try {
        const productId = req.params.id;

        const product = await productService.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found"});
        }
        
        await productService.deleteById(productId);

        return res.status(200).json({ success: true, message: "Product deleted successfully"});
    } catch (error) {
        console.error("Delete product error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };