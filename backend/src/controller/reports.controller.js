import OrdersService from '../services/orders.service.js';
import DriverService from "../services/driver.service.js";
import OrderItemsService from '../services/orderItems.service.js';
import CompanyService from '../services/company.service.js';
import SuperMarketService from '../services/superMarket.service.js';
import ORDER_STATUS from '../enums/orderStatus.js';
import getDateFromTimestamp from '../utils/convertFirestoreTimeStrapToDate.js';
import populateWhereHouse from '../utils/populateWhere_House.js';
import { generateOrdersPDF } from '../utils/generatePDF.js';

const orderService = new OrdersService();
const driverService = new DriverService();
const orderItemsService = new OrderItemsService();
const warehouseService = new CompanyService();
const superMarketService = new SuperMarketService();

const getOrdersReportWithPDF = async (req, res) => {
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

const getOrdersReport = async (req, res) => {
	try {
        const { status = ORDER_STATUS.DELIVERED, start_date, end_date } = req.query;

        const filters = {};
        const filterDescription = [];

        if (status !== undefined){
            if (status && !Object.values(ORDER_STATUS).includes(status)) {
                return res.status(400).json({ success: false, message: "Invalid status value" });
            }
            
            filters.status = status;
            filterDescription.push(`status: ${status}`);
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

        const warehouses = await warehouseService.findAll();
        const warehouseReportData = await Promise.all(warehouses.map(async (warehouse) => {
            filters.warehouse_id = warehouse.id;
            const orderCount = await orderService.getOrdersCountForWarehouse(filters);
            
            // Destructure to exclude unwanted fields
            const { 
                delivery_charge_for_1KM, 
                service_charge, 
                where_house_location, 
                created_at, 
                updated_at, 
                ...filteredWarehouse 
            } = warehouse;

            return {
                ...filteredWarehouse,
                order_count: orderCount
            };
        }));

        const supermarkets = await superMarketService.findAll();
        const supermarketReportData = await Promise.all(supermarkets.map(async (supermarket) => {
            //filters.warehouse_id = supermarket.id;
            //const orderCount = await orderService.getOrdersCountForWarehouse(filters);

            return {
                id: supermarket.id,
                name: `${supermarket.superMarket_Name} - ${supermarket.city}`,
                streetAddress: supermarket.streetAddress,
                isActive: supermarket.isActive,
                orders_count: supermarket.orders_count
            };
        }));
        
        return res.status(200).json({ 
            success: true, 
            message: "Orders report fetched successfully",
            data: {
                warehouse_report: {
                    count: warehouseReportData.length,
                    data: warehouseReportData
                },
                supermarket_report: {
                    count: supermarketReportData.length,
                    data: supermarketReportData
                }
            }
        });
    } catch (error) {
        console.error("Get orders report error:", error.message);
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

        // Get order IDs for order items fetching
        const orderIds = sortedOrders.map(order => order.order_id);

        let orderItemsMapping = {};

        try {
            orderItemsMapping = await orderItemsService.getOrderItemsMapping(orderIds);
        } catch (error) {
            console.error('Error fetching order items mapping:', error);
            // Continue with empty mapping as fallback
        }

        let Total_Profit_From_Products = 0

        // Filter orders to include only specific fields
        const filteredOrderData = sortedOrders.map(order => {
            const processedItems = order.items?.map(item => {
                const orderItemData = orderItemsMapping[order.order_id]?.[item.product_id];
                
                if (orderItemData) {
                    // Use data directly from OrderItems table
                    const quantity = orderItemData.product_quantity || item.quantity;
                    const unitSellingPrice = orderItemData.unit_selling_price;
                    const unitCostPrice = orderItemData.unit_cost_price;
                    const unitProfitValue = orderItemData.unit_profit_value;
                    
                    return {
                        product_id: item.product_id,
                        product_name: orderItemData.product_name,
                        unit_price_of_product_selling: parseFloat(unitSellingPrice.toFixed(2)),
                        unit_price_of_product_cost: parseFloat(unitCostPrice.toFixed(2)),
                        unit_profit_of_product: parseFloat(unitProfitValue.toFixed(2)),
                        quantity: quantity,
                        is_profit: unitProfitValue > 0,
                        total_price_for_products_selling: parseFloat((unitSellingPrice * quantity).toFixed(2)),
                        total_price_for_products_cost: parseFloat((unitCostPrice * quantity).toFixed(2)),
                        total_profit_for_products: parseFloat((unitProfitValue * quantity).toFixed(2)),
                    };
                } else {
                    // Fallback to original logic if order item not found
                    const unitPrice = parseFloat(item.unit_price || 0);
                    const unitProfit = 0; // Default to 0 if no order item data
                    
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
                }
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

        const Total_Income = (Income_Result.Total_TAX + Income_Result.Total_Delivery_Fee + Total_Profit_From_Products) || 0;

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
                total_income: parseFloat(Total_Income.toFixed(2)),
            },
            total_balance: Income_Result.Total_Balance,
            data: filteredOrderData
        });
    } catch (error) {
        console.error("Get finance report error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getDriversReport = async (req, res) => {
	try {
        const { where_house_id } = req.query;

        const filters = {};
        const filterDescription = [];

        if (where_house_id !== undefined) {
            const warehouse = await warehouseService.findById(where_house_id);
            if (!warehouse) {
                return res.status(404).json({ success: false, message: "Warehouse not found"});
            }

            filters.where_house_id = where_house_id;
            filterDescription.push(`warehouse_id: ${where_house_id}`);
        }

        const filteredDrivers = Object.keys(filters).length > 0 
            ? await driverService.findWithFilters(filters)
            : await driverService.findAll();

        // Sort by created_at in ascending order (oldest first)
        const sortedDrivers = filteredDrivers.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        const driversReportData = await Promise.all(sortedDrivers.map(async (driver) => {
            const deliveryOverviewResult = await orderService.getDeliveryStats(driver.id);

            return {
                driver_id: driver.id,
                email: driver.email,
                full_name: `${driver.firstName} ${driver.lastName}`,
                phone: driver.phone,
                nic_number: driver.nic_number,
                license_number: driver.license_number,
                warehouse_id: driver.where_house_id,
                backgroundCheckStatus: driver.backgroundCheckStatus,
                isActive: driver.isActive,
                isDocumentVerified: driver.isDocumentVerified,
                notAcceptedDeliveries: deliveryOverviewResult.notAccepted,
                onGoingDeliveries: deliveryOverviewResult.onGoing,
                completedDeliveries: deliveryOverviewResult.completed,
                cancelledDeliveries: deliveryOverviewResult.cancelled,
                totalDeliveries: deliveryOverviewResult.total,
            };
        }));

        const populatedDrivers = await populateWhereHouse(driversReportData);
        
        return res.status(200).json({ 
            success: true, 
            message: "Drivers report fetched successfully", 
            count: driversReportData.length,
            data: populatedDrivers
        });
    } catch (error) {
        console.error("Drivers report error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export { getOrdersReport, getFinanceReport, getDriversReport };