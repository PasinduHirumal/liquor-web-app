import OtherProductService from '../services/otherProduct.service.js';
import StockHistoryService from '../services/stockHistory.service.js';
import SuperMarketService from '../services/superMarket.service.js';
import CategoryService from '../services/category.service.js';
import OrdersService from '../services/orders.service.js';
import populateCategory from '../utils/populateCategory.js';
import ORDER_STATUS from '../enums/orderStatus.js';
import { deleteImages, uploadImages, uploadSingleImage } from '../utils/firebaseStorage.js';
import { validateStockOperation } from '../utils/stockCalculator.js';
import { validatePriceOperation } from '../utils/priceCalculator.js';
import { createStockHistory } from './stockHistory.controller.js';

const categoryService = new CategoryService();
const productService = new OtherProductService();
const stockHistoryService = new StockHistoryService();
const marketService = new SuperMarketService();
const ordersService = new OrdersService();

const createProduct = async (req, res) => {
	try {
        const { cost_price, marked_price, discount_percentage, category_id, images, main_image, superMarket_id } = req.body;

        const category = await categoryService.findById(category_id);
        if (!category) {
            return res.status(400).json({ success: false, message: "Invalid category"});
        }

        const productData = {};

        if (superMarket_id !== undefined) {
            const superMarket = await marketService.findById(superMarket_id);
            if (!superMarket) {
                return res.status(404).json({ success: false, message: "Super market not found"});
            }

            if (!superMarket.isActive) {
                return res.status(400).json({ success: false, message: "Super market not in active"});
            }
            
            productData.product_from = `${superMarket.superMarket_Name} - ${superMarket.city}`;
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
            return res.status(400).json({ success: false, message: updatedPrices.error });
        }

        if (req.body.selling_price || req.body.discount_amount) {
            if (req.body.selling_price) delete req.body.selling_price;
            if (req.body.discount_amount) delete req.body.discount_amount;
        }

        const profit = updatedPrices.newPrice - cost_price || 0;

        Object.assign(productData, {
            selling_price: updatedPrices.newPrice,
            discount_amount: updatedPrices.discount,
            profit_value: profit,
            isProfit: profit > 0,
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
        };

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

        // Remove searchTokens field from each product object
        const sanitizedProducts = sortedProducts.map(product => {
            const { searchTokens, ...productsWithoutSearchTokens } = product;
            return productsWithoutSearchTokens;
        });

        return res.status(200).json({ 
            success: true, 
            message: "Fetching products successful",
            count: sortedProducts.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: sanitizedProducts
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

        const { searchTokens, ...productWithoutSearchTokens } = populatedProduct;

        return res.status(200).json({ success: true, message: "Product fetched successfully", data: productWithoutSearchTokens });
    } catch (error) {
        console.error("Get product by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateProductById = async (req, res) => {
	try {
        const productId = req.params.id;
        const { category_id, images, main_image } = req.body;

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

        const updateData = {  ...req.body };
        
        const updatedProduct = await productService.updateById(productId, updateData);
        if (!updatedProduct) {
            return res.status(400).json({ success: false, message: "Failed to update product"});
        }

        const populatedProduct = await populateCategory(updatedProduct);

        const { searchTokens, ...productWithoutSearchTokens } = populatedProduct;

        return res.status(201).json({ success: true, message: "Product updated successfully", data: productWithoutSearchTokens });
    } catch (error) {
        console.error("Update product error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updatePriceById = async (req, res) => {
	try {
        const productId = req.params.id;
        const { cost_price, marked_price, discount_percentage, superMarket_id } = req.body;

        const product = await productService.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found"});
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

        const markedPrice = marked_price ?? product.marked_price;
        const discountPercentage = discount_percentage ?? product.discount_percentage;
        const costPrice = cost_price ?? product.cost_price;

        const updatedPrices = validatePriceOperation(markedPrice, discountPercentage);
        if (!updatedPrices.isValid) {
            return res.status(400).json({ success: false, message: stockValidation.error });
        }

        const profit = updatedPrices.newPrice - costPrice || 0;

        Object.assign(updateData, {
            price: updatedPrices.newPrice,
            selling_price: updatedPrices.newPrice,
            discount_amount: updatedPrices.discount,
            profit_value: profit,
            isProfit: profit > 0,
            ...req.body
        });

        const updatedProduct = await productService.updateById(productId, updateData);
        if (!updatedProduct) {
            return res.status(400).json({ success: false, message: "Failed to update product"});
        }

        const populatedProduct = await populateCategory(updatedProduct);

        const { searchTokens, ...productWithoutSearchTokens } = populatedProduct;

        return res.status(200).json({ success: true, message: "Price updated successfully", data: productWithoutSearchTokens});
    } catch (error) {
        console.error("Update Price error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateStockById = async (req, res) => {
	try {
        const productId = req.params.id;
        const { add_quantity, withdraw_quantity } = req.body;

        const product = await productService.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found"});
        }

        const stockQuantity = product.stock_quantity;
        const addQuantity = add_quantity ?? 0;
        const removeQuantity = withdraw_quantity ?? 0;

        const stockValidation = validateStockOperation(
            stockQuantity, 
            addQuantity, 
            removeQuantity
        );

        if (!stockValidation.isValid) {
            return res.status(400).json({ success: false, message: stockValidation.error });
        }

        const stockUpdateResult  = await createStockHistory({ 
            addQuantity: add_quantity,
            withdrawQuantity: withdraw_quantity,
            productId: productId,
            userId: req.user.id
        });

        if (!stockUpdateResult.shouldCreateHistory) {
            return res.status(400).json({ success: false, message: stockUpdateResult.error });
        }

        const updateData = {
            stock_quantity: stockValidation.newStock,
            is_in_stock: stockValidation.newStock <= 0,
            ...req.body 
        }

        const currentStockHistory = product.stockHistory || [];
        const updatedStockHistory = [...currentStockHistory, stockUpdateResult.historyId];

        updateData.stockHistory = updatedStockHistory;

        const updatedProduct = await productService.updateById(productId, updateData);
        if (!updatedProduct) {
            return res.status(400).json({ success: false, message: "Failed to update product"});
        }

        const populatedProduct = await populateCategory(updatedProduct);

        const { searchTokens, ...productWithoutSearchTokens } = populatedProduct;
        
        return res.status(200).json({ success: true, message: "Product stock updated successfully", data: productWithoutSearchTokens});
    } catch (error) {
        console.error("Product stock update error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteProductById = async (req, res) => {
	try {
        const productId = req.params.id;

        const product = await productService.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found"});
        }

        const orders_pending = await ordersService.findAllByProductId(productId, ORDER_STATUS.PENDING);
        const orders_processing = await ordersService.findAllByProductId(productId, ORDER_STATUS.PROCESSING);
        const orders_out_for_delivery = await ordersService.findAllByProductId(productId, ORDER_STATUS.OUT_FOR_DELIVERY);

        const TotalOrders = orders_pending.length + orders_processing.length + orders_out_for_delivery.length;

        if (TotalOrders > 0) {
            return res.status(404).json({ success: false, message: `Can't delete product. Product has ${TotalOrders} orders in on going`});
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

// Migration endpoint (call this once to update existing data)
const migrateSearchTokens = async (req, res) => {
    try {
        const result = await productService.addSearchTokensToExistingDocuments();
        
        return res.status(200).json({
            success: true,
            message: "Search tokens migration completed",
            ...result
        });
    } catch (error) {
        console.error("Migration error:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Migration failed",
            error: error.message 
        });
    }
};


export { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProductById,
    updateStockById,
    updatePriceById,
    deleteProductById, 
    migrateSearchTokens 
};