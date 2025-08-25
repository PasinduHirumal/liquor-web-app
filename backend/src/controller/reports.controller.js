import OrdersService from '../services/orders.service.js';
import DriverService from "../services/driver.service.js";
import ORDER_STATUS from '../enums/orderStatus.js';
import { generateOrdersPDF } from '../utils/generatePDF.js';

const orderService = new OrdersService();
const driverService = new DriverService();

const getOrdersReport = async (req, res) => {
	try {
        const { status, is_driver_accepted, where_house_id, format, start_date, end_date } = req.query;

        const filters = {};
        const filterDescription = [];

        if (status !== undefined){
            if (status && !Object.values(ORDER_STATUS).includes(status)) {
                return res.status(400).json({ success: false, message: "Invalid status value" });
            }
            
            filters.status = status;
            filterDescription.push(`status: ${status}`);
        }
        if (is_driver_accepted !== undefined) {
            const isBoolean = is_driver_accepted === 'true';
            filters.is_driver_accepted = isBoolean;
            filterDescription.push(`is_driver_accepted: ${is_driver_accepted}`);
        } 
        if (where_house_id !== undefined) {
            const where_house = await companyService.findById(where_house_id);
            if (!where_house) {
                return res.status(400).json({ success: false, message: "Invalid where house id" });
            }
            
            filters.where_house_id = where_house_id;
            filterDescription.push(`where_house_id: ${where_house_id}`);
        }
        if (start_date !== undefined || end_date !== undefined) {
            if (start_date && end_date) {
                const startDate = new Date(start_date);
                const endDate = new Date(end_date);
                
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY" 
                    });
                }
                
                if (startDate > endDate) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "Start date must be before or equal to end date" 
                    });
                }
                
                // Set time to beginning and end of day
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                
                filters.dateRange = { start: startDate, end: endDate };
                filterDescription.push(`date range: ${start_date} to ${end_date}`);
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: "Both start_date and end_date are required for date filtering" 
                });
            }
        }
        if (format !== undefined && format !== 'pdf') {
            return res.status(400).json({ success: false, message: "Invalid format"});
        }

        const filteredOrders = Object.keys(filters).length > 0 
            ? await orderService.findWithFilters(filters)
            : await orderService.findAll();

        // Sort by created_at in ascending order (oldest first)
        const sortedOrders = filteredOrders.sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });

        if (format === 'pdf') {
            try {
                const pdfBuffer = await generateOrdersPDF(sortedOrders, filterDescription);
                
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="orders-report.pdf"');
                return res.send(pdfBuffer);
            } catch (pdfError) {
                console.error("PDF generation error:", pdfError);
                return res.status(500).json({ success: false, message: "Failed to generate PDF" });
            }
        }
        
        const message = "Orders report fetched successfully";

        return res.status(200).json({ 
            success: true, 
            message: format === 'pdf'? `PDF created successfully & ${message}` : message,
            count: sortedOrders.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: sortedOrders
        });
    } catch (error) {
        console.error("Create orders report error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getFinanceReport = async (req, res) => {
	try {
        const { where_house_id, format, start_date, end_date } = req.query;

        const filters = {};
        const filterDescription = [];

        filters.status = ORDER_STATUS.PROCESSING;
        filterDescription.push(`status: ${ORDER_STATUS.DELIVERED}`);

        if (where_house_id !== undefined) {
            const where_house = await companyService.findById(where_house_id);
            if (!where_house) {
                return res.status(400).json({ success: false, message: "Invalid where house id" });
            }
            
            filters.where_house_id = where_house_id;
            filterDescription.push(`where_house_id: ${where_house_id}`);
        }
        if (start_date !== undefined || end_date !== undefined) {
            if (start_date && end_date) {
                const startDate = new Date(start_date);
                const endDate = new Date(end_date);
                
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY" 
                    });
                }
                
                if (startDate > endDate) {
                    return res.status(400).json({ 
                        success: false, 
                        message: "Start date must be before or equal to end date" 
                    });
                }
                
                // Set time to beginning and end of day
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                
                filters.dateRange = { start: startDate, end: endDate };
                filterDescription.push(`date range: ${start_date} to ${end_date}`);
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: "Both start_date and end_date are required for date filtering" 
                });
            }
        }
        
        const completedOrders = await orderService.findWithFilters(filters);

        // Sort by created_at in ascending order (oldest first)
        const sortedOrders = completedOrders.sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });

        const Income_Result = await orderService.getTotalIncomeValues(sortedOrders);

        const message = "Orders report fetched successfully";
        return res.status(200).json({ 
            success: true, 
            message: format === 'pdf'? `PDF created successfully & ${message}` : message,
            count: completedOrders.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            income : {
                total_delivery_charges: Income_Result.Total_Delivery_Fee,
                total_tax_charges: Income_Result.Total_TAX
            },
            data: sortedOrders
        });
    } catch (error) {
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export { getOrdersReport, getFinanceReport };