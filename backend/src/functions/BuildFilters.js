import ORDER_STATUS from "../enums/orderStatus.js";
import CompanyService from '../services/company.service.js';

const warehouseService = new CompanyService();

// Helper function to build and validate filters
async function buildFiltersForFinanceReport({ status, where_house_id, start_date, end_date }) {
    const filters = {};
    const filterDescription = [];
    let validationError = null;

    // Status validation
    if (status !== undefined) {
        if (status && !Object.values(ORDER_STATUS).includes(status)) {
            validationError = "Invalid status value";
            return { filters, filterDescription, validationError };
        }
        filters.status = status;
        filterDescription.push(`status: ${status}`);
    }

    // Warehouse validation
    if (where_house_id !== undefined) {
        try {
            const where_house = await warehouseService.findById(where_house_id);
            if (!where_house) {
                validationError = "Invalid warehouse id";
                return { filters, filterDescription, validationError };
            }
            filters.where_house_id = where_house_id;
            filterDescription.push(`warehouse_id: ${where_house_id}`);
        } catch (error) {
            validationError = "Error validating warehouse id";
            return { filters, filterDescription, validationError };
        }
    }

    // Date range validation
    if (start_date !== undefined || end_date !== undefined) {
        if (!start_date || !end_date) {
            validationError = "Both start_date and end_date are required for date filtering";
            return { filters, filterDescription, validationError };
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            validationError = "Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY";
            return { filters, filterDescription, validationError };
        }
        
        if (startDate > endDate) {
            validationError = "Start date must be before or equal to end date";
            return { filters, filterDescription, validationError };
        }
        
        // Set time to beginning and end of day
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        filters.dateRange = { start: startDate, end: endDate };
        filterDescription.push(`date range: ${start_date} to ${end_date}`);
    }

    return { filters, filterDescription, validationError };
}

export { buildFiltersForFinanceReport };