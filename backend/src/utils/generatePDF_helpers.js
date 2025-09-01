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

// Helper function to format filters for display
const formatDriverFilters = (filters) => {
    const filterStrings = [];
    
    if (filters.where_house_id) {
        filterStrings.push(`Warehouse ID: ${filters.where_house_id}`);
    }
    
    return filterStrings.length > 0 ? filterStrings.join(' | ') : 'All drivers';
};

// Helper function to calculate driver statistics
const calculateDriverStats = (drivers) => {
    const stats = {
        totalDrivers: drivers.length,
        activeDrivers: drivers.filter(d => d.isActive).length,
        verifiedDrivers: drivers.filter(d => d.isDocumentVerified).length,
        approvedDrivers: drivers.filter(d => d.backgroundCheckStatus === 'approved').length,
        totalDeliveries: drivers.reduce((sum, d) => sum + d.totalDeliveries, 0),
        ongoingDeliveries: drivers.reduce((sum, d) => sum + d.onGoingDeliveries, 0),
        completedDeliveries: drivers.reduce((sum, d) => sum + d.completedDeliveries, 0),
        cancelledDeliveries: drivers.reduce((sum, d) => sum + d.cancelledDeliveries, 0),
        warehouseDistribution: getWarehouseDistribution(drivers)
    };
    
    stats.inactiveDrivers = stats.totalDrivers - stats.activeDrivers;
    stats.unverifiedDrivers = stats.totalDrivers - stats.verifiedDrivers;
    stats.completionRate = stats.totalDeliveries > 0 ? 
        ((stats.completedDeliveries / stats.totalDeliveries) * 100).toFixed(1) : 0;
    
    return stats;
};

// Helper function to get warehouse distribution
const getWarehouseDistribution = (drivers) => {
    const distribution = {};
    drivers.forEach(driver => {
        if (driver.warehouse_id) {
            const warehouseName = driver.warehouse_id.name;
            distribution[warehouseName] = (distribution[warehouseName] || 0) + 1;
        }
    });
    return distribution;
};

export { formatFilters, calculateTotalOrders, formatDriverFilters, calculateDriverStats };