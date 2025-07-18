
const calculateNewStock = (currentStock, addQuantity, withdrawQuantity) => {
    const add = addQuantity || 0;
    const withdraw = withdrawQuantity || 0;
    
    return currentStock + add - withdraw;
};


const validateStockOperation = (currentStock, addQuantity, withdrawQuantity) => {
    const newStock = calculateNewStock(currentStock, addQuantity, withdrawQuantity);
    
    if (newStock < 0) {
        return {
            isValid: false,
            newStock: currentStock,
            error: "Insufficient stock for withdrawal operation"
        };
    }
    
    return {
        isValid: true,
        newStock
    };
};

export { calculateNewStock, validateStockOperation };