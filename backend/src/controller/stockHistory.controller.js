import StockHistoryService from '../services/stockHistory.service.js';

const stockHistoryService = new StockHistoryService();

const createStockHistory = async ({ addQuantity, withdrawQuantity, productId, userId }) => {
	try {
        let stockType = "none";
        let stockAmount = 0;

        if (addQuantity !== undefined) {
            stockType = "add";
            stockAmount = addQuantity;
        }
        if (withdrawQuantity !== undefined) {
            stockType = "withdraw";
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

export { createStockHistory, };