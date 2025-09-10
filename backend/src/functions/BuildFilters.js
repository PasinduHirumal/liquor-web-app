import ORDER_STATUS from "../enums/orderStatus.js";
import CompanyService from '../services/company.service.js';

const warehouseService = new CompanyService();

function validateStatus(status, filters, filterDescription) {
    if (status !== undefined) {
        if (status && !Object.values(ORDER_STATUS).includes(status)) {
            return "Invalid status value";
        }
        filters.status = status;
        filterDescription.push(`status: ${status}`);
    }
    return null;
}

async function validateWarehouse(where_house_id, filters, filterDescription) {
    if (where_house_id !== undefined) {
        try {
            const where_house = await warehouseService.findById(where_house_id);
            if (!where_house) {
                return "Invalid warehouse id";
            }
            filters.where_house_id = where_house_id;
            filterDescription.push(`warehouse_id: ${where_house_id}`);
        } catch (error) {
            return "Error validating warehouse id";
        }
    }
    return null;
}

function validateDateRange(start_date, end_date, filters, filterDescription) {
    if (start_date !== undefined || end_date !== undefined) {
        if (!start_date || !end_date) {
            return "Both start_date and end_date are required for date filtering";
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return "Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY";
        }
        
        if (startDate > endDate) {
            return "Start date must be before or equal to end date";
        }
        
        // Set time to beginning and end of day
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        
        filters.dateRange = { start: startDate, end: endDate };
        filterDescription.push(`date range: ${start_date} to ${end_date}`);
    }
    return null;
}

// Helper function to build and validate filters for finance report
async function buildFiltersForFinanceReport({ status, where_house_id, start_date, end_date }) {
    const filters = {};
    const filterDescription = [];
    let validationError = null;

    // Status validation
    validationError = validateStatus(status, filters, filterDescription);
    if (validationError) {
        return { filters, filterDescription, validationError };
    }

    // Warehouse validation - now using the extracted function
    validationError = await validateWarehouse(where_house_id, filters, filterDescription);
    if (validationError) {
        return { filters, filterDescription, validationError };
    }

    // Date range validation
    validationError = validateDateRange(start_date, end_date, filters, filterDescription);
    if (validationError) {
        return { filters, filterDescription, validationError };
    }

    return { filters, filterDescription, validationError };
}

async function buildFiltersForOrdersReport({ status, start_date, end_date }) {
    const filters = {};
    const filterDescription = [];
    let validationError = null;

    // Status validation
    validationError = validateStatus(status, filters, filterDescription);
    if (validationError) {
        return { filters, filterDescription, validationError };
    }

    // Date range validation
    validationError = validateDateRange(start_date, end_date, filters, filterDescription);
    if (validationError) {
        return { filters, filterDescription, validationError };
    }

    return { filters, filterDescription, validationError };
}

async function buildFiltersForWithdrawCash({ status }) {
    const filters = {};
    const filterDescription = [];
    let validationError = null;

    // Status validation
    validationError = validateStatus(status, filters, filterDescription);
    if (validationError) {
        return { filters, filterDescription, validationError };
    }

    return { filters, filterDescription, validationError };
}

export { buildFiltersForFinanceReport, buildFiltersForOrdersReport, buildFiltersForWithdrawCash };