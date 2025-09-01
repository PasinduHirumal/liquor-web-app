// Helper function to format filters for display
const formatFilters = (filters) => {
    const filterStrings = [];
    
    if (filters.status) {
        filterStrings.push(`Status: ${filters.status.replace(/_/g, ' ').toUpperCase()}`);
    }
    
    if (filters.dateRange) {
        const startDate = filters.dateRange.start.toLocaleDateString();
        const endDate = filters.dateRange.end.toLocaleDateString();
        filterStrings.push(`Date Range: ${startDate} - ${endDate}`);
    }
    
    return filterStrings.length > 0 ? filterStrings.join(' | ') : 'No filters applied';
};

// Helper function to calculate total orders
const calculateTotalOrders = (data) => {
    const warehouseTotal = data.warehouse_report?.data?.reduce((sum, warehouse) => sum + warehouse.order_count, 0) || 0;
    const supermarketTotal = data.supermarket_report?.data?.reduce((sum, supermarket) => sum + supermarket.orders_count, 0) || 0;
    return warehouseTotal + supermarketTotal;
};

export { formatFilters, calculateTotalOrders };