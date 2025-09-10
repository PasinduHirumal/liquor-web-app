import OrdersService from '../services/orders.service.js';
import DriverService from "../services/driver.service.js";
import CompanyService from '../services/company.service.js';
import SuperMarketService from '../services/superMarket.service.js';
import DriverEarningsService from '../services/driverEarnings.service.js';
import DriverPaymentService from '../services/driverPayment.service.js';
import getDateFromTimestamp from '../utils/convertFirestoreTimeStrapToDate.js';
import populateWhereHouse from '../utils/populateWhere_House.js';
import { generateOrdersPDF, generateDriversPDF } from '../utils/generatePDF.js';
import { buildFiltersForFinanceReport, buildFiltersForOrdersReport } from '../functions/BuildFilters.js';
import { ORDER_STATUS_FOR_REPORT } from '../data/OrderStatus.js';


const orderService = new OrdersService();
const driverService = new DriverService();
const warehouseService = new CompanyService();
const superMarketService = new SuperMarketService();
const driverEarningsService = new DriverEarningsService();
const driverPaymentService = new DriverPaymentService();


const getOrdersReport = async (req, res) => {
	try {
        const { status = ORDER_STATUS_FOR_REPORT, format, start_date, end_date } = req.query;

        const { filters, filterDescription, validationError } = await buildFiltersForOrdersReport({
            status,
            start_date,
            end_date
        });

        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
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

        delete filters.warehouse_id;

        const supermarkets = await superMarketService.findAll();
        const supermarketReportData = await Promise.all(supermarkets.map(async (supermarket) => {
            const orderCount = await orderService.getOrdersCountForSuperMarket(supermarket.id, filters);

            return {
                id: supermarket.id,
                name: `${supermarket.superMarket_Name} - ${supermarket.city}`,
                streetAddress: supermarket.streetAddress,
                isActive: supermarket.isActive,
                orders_count: orderCount
            };
        }));

        // Report data structure
        const reportData = {
            warehouse_report: {
                count: warehouseReportData.length,
                data: warehouseReportData
            },
            supermarket_report: {
                count: supermarketReportData.length,
                data: supermarketReportData
            }
        };

        // Handle PDF generation for both warehouses and supermarkets
        if (format !== undefined && (format === 'warehouses-pdf' || format === 'supermarkets-pdf' || format === 'pdf')) {
            try {
                let pdfData;
                let filename;
                
                if (format === 'warehouses-pdf') { // Generate PDF with only warehouse data
                    pdfData = {
                        warehouse_report: reportData.warehouse_report,
                        supermarket_report: { count: 0, data: [] }
                    };
                    filename = 'warehouses-orders-report.pdf';
                } else if (format === 'supermarkets-pdf') { // Generate PDF with only supermarket data
                    pdfData = {
                        warehouse_report: { count: 0, data: [] },
                        supermarket_report: reportData.supermarket_report
                    };
                    filename = 'supermarkets-orders-report.pdf';
                } else { // Generate PDF with both warehouse and supermarket data
                    pdfData = reportData;
                    filename = 'complete-orders-report.pdf';
                }

                const pdfBuffer = await generateOrdersPDF(pdfData, filters);

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                return res.send(pdfBuffer);
            } catch (pdfError) {
                console.error("PDF generation error:", pdfError);
                return res.status(500).json({ success: false, message: "Failed to generate PDF" });
            }
        }
        
        return res.status(200).json({ 
            success: true, 
            message: "Orders report fetched successfully",
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: reportData
        });
    } catch (error) {
        console.error("Get orders report error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getFinanceReport = async (req, res) => {
    try {
        const { status = ORDER_STATUS_FOR_REPORT, where_house_id, format, start_date, end_date } = req.query;

        const { filters, filterDescription, validationError } = await buildFiltersForFinanceReport({
            status,
            where_house_id,
            start_date,
            end_date
        });

        if (validationError) {
            return res.status(400).json({ success: false, message: validationError });
        }
        
        const completedOrders = Object.keys(filters).length > 0
            ? await orderService.findWithFilters(filters)
            : await orderService.findAll();

        // Sort by created_at in ascending order (oldest first)
        const sortedOrders = completedOrders.sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });

        let Total_Profit_From_Products = 0

        // Filter orders to include only specific fields
        const filteredOrderData = sortedOrders.map(order => {
            const processedItems = order.items?.map(item => {

                const quantity = item.quantity;
                const unitSellingPrice = item.unit_price;
                const unitCostPrice = item.unitCostPrice;
                const unitProfitValue = unitSellingPrice - unitCostPrice;

                return {
                    product_id: item.product_id,
                    product_name: item.product_name,
                    unit_price_of_product_selling: parseFloat(unitSellingPrice.toFixed(2)),
                    unit_price_of_product_cost: parseFloat(unitCostPrice.toFixed(2)),
                    unit_profit_of_product: parseFloat(unitProfitValue.toFixed(2)),
                    quantity: quantity,
                    is_profit: unitProfitValue > 0,
                    total_price_for_products_selling: parseFloat((unitSellingPrice * quantity).toFixed(2)),
                    total_price_for_products_cost: parseFloat((unitCostPrice * quantity).toFixed(2)),
                    total_profit_for_products: parseFloat((unitProfitValue * quantity).toFixed(2)),
                };
                
            }) || [];

            // Calculate total profit from all products in this order
            const totalProfitFromProducts = processedItems.reduce((sum, item) => sum + item.total_profit_for_products, 0);
            Total_Profit_From_Products += totalProfitFromProducts;

            const deliveryFee = parseFloat(order.delivery_fee || 0);
            const taxAmount = parseFloat(order.tax_amount || 0);
            const subtotal = parseFloat(order.subtotal || 0);
            const totalAmount = parseFloat(order.total_amount || 0);
            const total_income = totalProfitFromProducts + deliveryFee + taxAmount;

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
                    total_income: parseFloat(total_income.toFixed(2)),
                },
                total_cost: parseFloat((subtotal - totalProfitFromProducts).toFixed(2)),
                total_income: parseFloat(total_income.toFixed(2)),
                total_amount: parseFloat(totalAmount.toFixed(2)),
            };
        });

        // calculate income
        const Income_Result = await orderService.getTotalIncomeValues(sortedOrders);

        const Total_Delivery_Charges = parseFloat(Income_Result.Total_Delivery_Fee || 0);
        const Total_Tax_Charges = parseFloat(Income_Result.Total_TAX || 0);
        const Total_Profits_From_Products = parseFloat(Total_Profit_From_Products.toFixed(2));
        const Total_Income = parseFloat((Total_Tax_Charges + Total_Delivery_Charges + Total_Profits_From_Products).toFixed(2));

        const Total_Payments_For_Drivers = await driverPaymentService.getTotalPaymentForAllDrivers();
        const Total_Income_balance = parseFloat((Total_Income - Total_Payments_For_Drivers).toFixed(2));
        
        const Total_Cost_Value = await orderService.getTotalCostForAllOrders(ORDER_STATUS_FOR_REPORT);
        const Total_Cost = parseFloat(Total_Cost_Value.toFixed(2));
        //const Total_Balance = parseFloat((Income_Result.Total_Balance - Total_Payments_For_Drivers).toFixed(2));
        const Total_Balance = parseFloat((Total_Income_balance + Total_Cost).toFixed(2));

        const message = "Finance report fetched successfully";
        return res.status(200).json({ 
            success: true, 
            message: format === 'pdf'? `PDF created successfully & ${message}` : message,
            count: completedOrders.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            income : {
                total_delivery_charges: Total_Delivery_Charges,
                total_tax_charges: Total_Tax_Charges,
                total_profits_from_products: Total_Profits_From_Products,
                total_income: Total_Income,
                total_payments_for_drivers: Total_Payments_For_Drivers,
                total_income_balance: Total_Income_balance,
            },
            total_income_balance: Total_Income_balance,
            total_cost: Total_Cost,
            total_balance: Total_Balance,
            data: filteredOrderData
        });
    } catch (error) {
        console.error("Get finance report error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getDriversReport = async (req, res) => {
	try {
        const { where_house_id, format } = req.query;

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
            const Total_Earnings = await driverEarningsService.getTotalEarningForDriver(driver.id);
            const Total_Withdraws = await driverPaymentService.getTotalPaymentsForDriver(driver.id);
            const Current_Balance = Total_Earnings - Total_Withdraws;

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
                totalEarnings: Total_Earnings,
                totalWithdraws: Total_Withdraws,
                currentBalance: Current_Balance,
            };
        }));

        const populatedDrivers = await populateWhereHouse(driversReportData);
        
        if (format !== undefined && format === 'pdf') {
            try {
                const pdfBuffer = await generateDriversPDF(populatedDrivers, filters);

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="drivers-report.pdf"');
                return res.send(pdfBuffer);
            } catch (pdfError) {
                console.error("PDF generation error:", pdfError);
                return res.status(500).json({ success: false, message: "Failed to generate PDF" });
            }
        }

        return res.status(200).json({ 
            success: true, 
            message: "Drivers report fetched successfully", 
            count: driversReportData.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: populatedDrivers
        });
    } catch (error) {
        console.error("Drivers report error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export { getOrdersReport, getFinanceReport, getDriversReport };