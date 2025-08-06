import OrdersService from '../services/orders.service.js';
import DriverService from "../services/driver.service.js";
import ORDER_STATUS from '../enums/orderStatus.js';
import { generateOrdersPDF } from '../utils/generatePDF.js';

const orderService = new OrdersService();
const driverService = new DriverService();

const getOrdersReport = async (req, res) => {
	try {
        const { status, is_driver_accepted, where_house_id, format } = req.query;

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
        if (format !== undefined && format !== 'pdf') {
            return res.status(400).json({ success: false, message: "Invalid format"});
        }

        const filteredOrders = Object.keys(filters).length > 0 
            ? await orderService.findWithFilters(filters)
            : await orderService.findAll();

        // Sort by created_at in descending order (newest first)
        const sortedOrders = filteredOrders.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
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


export { getOrdersReport };