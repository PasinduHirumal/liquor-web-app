import ProductService from '../services/product.service.js';
import StockHistoryService from '../services/stockHistory.service.js';
import SuperMarketService from '../services/superMarket.service.js';
import CategoryService from '../services/category.service.js';
import populateCategory from '../utils/populateCategory.js';
import { deleteImages, uploadImages, uploadSingleImage } from '../utils/firebaseStorage.js';
import { validateStockOperation } from '../utils/stockCalculator.js';
import { validatePriceOperation } from '../utils/priceCalculator.js';
import { createStockHistory } from './stockHistory.controller.js';

const productService = new ProductService();
const categoryService = new CategoryService();
const stockHistoryService = new StockHistoryService();
const marketService = new SuperMarketService();

const createProduct = async (req, res) => {
	try {
        const { marked_price, discount_percentage, category_id, main_image, images, superMarket_id } = req.body;

        const category = await categoryService.findById(category_id);
        if (!category) {
            return res.status(400).json({ success: false, message: "Invalid category"});
        }

        const productData = {};

        if (superMarket_id !== undefined) {
            if (superMarket_id === null) {
                productData.product_from = "N/A";
            } else {
                const superMarket = await marketService.findById(superMarket_id);
                if (!superMarket) {
                    return res.status(404).json({ success: false, message: "Super market not found"});
                }

                if (!superMarket.isActive) {
                    return res.status(400).json({ success: false, message: "Super market not in active"});
                }
                
                productData.product_from = `${superMarket.superMarket_Name} - ${superMarket.city}`;
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

        if (main_image !== undefined) {
            try {
                const imageUrls = await uploadSingleImage(main_image, 'products');
                req.body.main_image = imageUrls;
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

        Object.assign(productData, { 
            price: updatedPrices.newPrice,
            selling_price: updatedPrices.newPrice,
            discount_amount: updatedPrices.discount,
            ...req.body 
        });

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

        if (product.stock_quantity <= 0) {
            updateData.is_in_stock = false;
        }

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
        const { is_active, is_in_stock, is_liquor, category_id } = req.query;
        const userRole = req.user? req.user.role : null;

        const filters = {};
        const filterDescription = [];

        if (is_active !== undefined) {
            const isBoolean = is_active === 'true';
            filters.is_active = isBoolean;
            filterDescription.push(`is_active: ${is_active}`);
        } 
        if (is_in_stock !== undefined) {
            const isBoolean = is_in_stock === 'true';
            filters.is_in_stock = isBoolean;
            filterDescription.push(`is_in_stock: ${is_in_stock}`);
        }
        if (is_liquor !== undefined) {
            const isBoolean = is_liquor === 'true';
            filters.is_liquor = isBoolean;
            filterDescription.push(`is_liquor: ${is_liquor}`);
        }
        if (category_id !== undefined){
            const category = await categoryService.findById(category_id);
            if (!category) {
                return res.status(404).json({ success: false, message: "Filter error. Category not found"});
            }

            filters.category_id = category_id;
            filterDescription.push(`category_id: ${category_id}-${category.name}`);
        }

        const filteredProducts = Object.keys(filters).length > 0 
            ? await productService.findWithFilters(filters)
            : await productService.findAll();

        const populatedProducts = await populateCategory(filteredProducts, userRole);
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
        const userRole = req.user? req.user.role : null;

        const product = await productService.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found"});
        }

        const populatedProduct = await populateCategory(product, userRole);

        return res.status(200).json({ success: true, message: "Product fetched successfully", data: populatedProduct });
    } catch (error) {
        console.error("Get product by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateProduct = async (req, res) => {
	try {
        const productId = req.params.id;
        const { marked_price, discount_percentage, add_quantity, withdraw_quantity, category_id, images, main_image, superMarket_id } = req.body;

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

        const updateData = {};

        if (superMarket_id !== undefined) {
            const superMarket = await marketService.findById(superMarket_id);
            if (!superMarket) {
                return res.status(404).json({ success: false, message: "Super market not found"});
            }

            if (!superMarket.isActive) {
                return res.status(400).json({ success: false, message: "Super market not in active"});
            }
            
            updateData.product_from = `${superMarket.superMarket_Name} - ${superMarket.city}`;
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

        if (main_image !== undefined) {
            try {
                const imageUrls = await uploadSingleImage(main_image, 'products');
                req.body.main_image = imageUrls;
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

        Object.assign(updateData, { 
            price: updatedPrices.newPrice,
            selling_price: updatedPrices.newPrice,
            discount_amount: updatedPrices.discount,
            stock_quantity: stockValidation.newStock,
            ...req.body 
        });

        if (updateData.stock_quantity <= 0) {
            updateData.is_in_stock = false;
        }

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
        
        try {
            await deleteImages(product.images);
            await deleteImages(product.main_image);
        } catch (imageError) {
            console.error("Failed to delete banner images:", imageError.message);
            return res.status(500).json({ success: false, message: "Server Error" });
        }

        await productService.deleteById(productId);

        return res.status(200).json({ success: true, message: "Product deleted successfully"});
    } catch (error) {
        console.error("Delete product error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateActiveToggle = async (req, res) => {
	try {
        const { is_active } = req.body;

        const products = await productService.findByFilter('is_liquor', '==', true);
        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: "Failed to fetch liquor products"});
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
            return res.status(500).json({
                success: false,
                message: `Failed to update ${failedUpdates.length} products`
            });
        }

        // Update App-Info data
        

        const updatedProducts = await productService.findByFilter('is_liquor', '==', true);
        
        return res.status(200).json({ 
            success: true, 
            message: `Successfully updated is_active to ${is_active} for all liquor products`, 
            before_count: products.length,
            updated_count: updatedProducts.length,
            data: updatedProducts 
        });
    } catch (error) {
        console.error("Update active toggle error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, updateActiveToggle};