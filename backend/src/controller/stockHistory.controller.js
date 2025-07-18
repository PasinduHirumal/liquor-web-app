import StockHistoryService from '../services/stockHistory.service.js';
import OtherProductService from '../services/otherProduct.service.js';
import ProductService from '../services/product.service.js';
import populateUser from '../utils/populateUser.js';

const stockHistoryService = new StockHistoryService();
const otherProductService = new OtherProductService();
const productService = new ProductService();

const createStockHistory = async ({ addQuantity, withdrawQuantity, productId, userId }) => {
	try {
        let stockType = "none";
        let stockAmount = 0;

        if (addQuantity !== undefined) {
            stockType = "add items";
            stockAmount = addQuantity;
        }
        if (withdrawQuantity !== undefined) {
            stockType = "withdraw items";
            stockAmount = withdrawQuantity;
        }

        const stockHistoryData = {
            type: stockType,
            quantity: stockAmount,
            productId: productId,
            userId: userId
        }

        const stockHistory = await stockHistoryService.create(stockHistoryData);
        if (!stockHistory) {
            return { 
                shouldCreateHistory: false, 
                error: "Failed to create stock history" 
            };
        }
        
        return { 
            shouldCreateHistory: true, 
            historyId: stockHistory.id 
        };
    } catch (error) {
        console.error('Stock history creation error:', error);
        return { 
            shouldCreateHistory: false, 
            error: "Failed to create stock history" 
        };
    }
};

const getStockHistoryByProductId = async (req, res) => {
	try {
        const productId = req.params.id;

        const product = await productService.findById(productId);
        const otherProduct = await otherProductService.findById(productId)

        if (!product && !otherProduct) {
            return res.status(404).json({ success: false, message: "No product found"});
        }

        const history = await stockHistoryService.findByFilter('productId', '==', productId);
        if (!history) {
            return res.status(400).json({ success: false, message: "Failed to find stock history"});
        }
        
        const populatedHistory = await populateUser(history);

        // Sort by createdAt in ascending order (oldest first)
        const sortedHistory = populatedHistory.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });

        return res.status(200).json({ success: true, message: "Stock history fetched successfully", count: sortedHistory.length, data: sortedHistory });
    } catch (error) {
        console.error("Get stock history by product id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createStockHistory, getStockHistoryByProductId };