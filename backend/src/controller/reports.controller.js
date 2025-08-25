import OrdersService from '../services/orders.service.js';
import DriverService from "../services/driver.service.js";
import ProductService from '../services/product.service.js';
import OtherProductService from '../services/otherProduct.service.js';
import ORDER_STATUS from '../enums/orderStatus.js';
import { generateOrdersPDF } from '../utils/generatePDF.js';
import getDateFromTimestamp from '../utils/convertFirestoreTimeStrapToDate.js';

const orderService = new OrdersService();
const driverService = new DriverService();
const liquorService = new ProductService();
const groceryService = new OtherProductService();

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
        const { status = ORDER_STATUS.DELIVERED, where_house_id, format, start_date, end_date } = req.query;

        const filters = {};
        const filterDescription = [];

        if (status !== undefined){
            if (status && !Object.values(ORDER_STATUS).includes(status)) {
                return res.status(400).json({ success: false, message: "Invalid status value" });
            }
            
            filters.status = status;
            filterDescription.push(`status: ${status}`);
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
        
        const completedOrders = await orderService.findWithFilters(filters);

        // Sort by created_at in ascending order (oldest first)
        const sortedOrders = completedOrders.sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });

        // Get all unique product IDs to minimize database calls
        const allProductIds = [...new Set(
            sortedOrders.flatMap(order => 
                order.items?.map(item => item.product_id) || []
            )
        )];

        // Fetch all product profits at once
        const productProfits = {};
        await Promise.all(
            allProductIds.map(async (productId) => {
                try {
                    let profit = 0;
                    profit = await groceryService.getProfitForProduct(productId);
                    if (!profit) {
                        profit = await liquorService.getProfitForProduct(productId);
                    }

                    productProfits[productId] = profit !== false ? profit : 0;
                } catch (error) {
                    console.error(`Error fetching profit for product ${productId}:`, error);
                    productProfits[productId] = 0;
                }
            })
        );

        let Total_Profit_From_Products = 0

        // Filter orders to include only specific fields
        const filteredOrderData = sortedOrders.map(order => {
            const processedItems = order.items?.map(item => {
                const unitProfit = productProfits[item.product_id] || 0;
                const unitPrice = parseFloat(item.unit_price || 0);
                
                return {
                    product_id: item.product_id,
                    product_name: item.product_name,
                    unit_price_of_product_selling: unitPrice,
                    unit_price_of_product_cost: unitPrice - unitProfit,
                    unit_profit_of_product: parseFloat(unitProfit.toFixed(2)),
                    quantity: item.quantity,
                    is_profit: unitProfit > 0,
                    total_price_for_products_selling: parseFloat((unitPrice * item.quantity).toFixed(2)),
                    total_price_for_products_cost: parseFloat(((unitPrice - unitProfit) * item.quantity).toFixed(2)),
                    total_profit_for_products: parseFloat((unitProfit * item.quantity).toFixed(2)),
                    
                };
            }) || [];

            // Calculate total profit from all products in this order
            const totalProfitFromProducts = processedItems.reduce((sum, item) => sum + item.total_profit_for_products, 0);
            Total_Profit_From_Products += totalProfitFromProducts;

            const deliveryFee = parseFloat(order.delivery_fee || 0);
            const taxAmount = parseFloat(order.tax_amount || 0);
            const subtotal = parseFloat(order.subtotal || 0);
            const totalAmount = parseFloat(order.total_amount || 0);

            return {
                order_id: order.order_id,
                order_number: order.order_number,
                order_date: getDateFromTimestamp(order.order_date),
                warehouse_id: order.warehouse_id,
                items: processedItems,
                income: {
                    profit_from_products: parseFloat(totalProfitFromProducts.toFixed(2)),
                    delivery_fee: parseFloat(deliveryFee.toFixed(2)),
                    service_charge: parseFloat(taxAmount.toFixed(2)),
                    total_income: parseFloat((totalProfitFromProducts + deliveryFee + taxAmount).toFixed(2))
                },
                total_cost: parseFloat((subtotal - totalProfitFromProducts).toFixed(2)),
                total_income: parseFloat((totalProfitFromProducts + deliveryFee + taxAmount).toFixed(2)),
                total_amount: parseFloat(totalAmount.toFixed(2)),
            };
        });

        const Income_Result = await orderService.getTotalIncomeValues(sortedOrders);

        const message = "Orders report fetched successfully";
        return res.status(200).json({ 
            success: true, 
            message: format === 'pdf'? `PDF created successfully & ${message}` : message,
            count: completedOrders.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            income : {
                total_delivery_charges: parseFloat(Income_Result.Total_Delivery_Fee || 0),
                total_tax_charges: parseFloat(Income_Result.Total_TAX || 0),
                total_profits_from_products: parseFloat(Total_Profit_From_Products.toFixed(2)),
            },
            total_balance: Income_Result.Total_Balance,
            data: filteredOrderData
        });
    } catch (error) {
        console.error("Get finance report error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export { getOrdersReport, getFinanceReport };