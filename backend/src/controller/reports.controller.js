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
import { calculateCashSummary } from '../utils/calculateCashSummary.js';

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
        const { status = ORDER_STATUS_FOR_REPORT, format, start_date, end_date } = req.query;

        const { filters, filterDescription, validationError } = await buildFiltersForFinanceReport({
            status,
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

            const deliveryFee = parseFloat(order.delivery_fee || 0);
            const taxAmount = parseFloat(order.tax_amount || 0);
            const serviceCharge = parseFloat(order.service_charge || 0);
            const subtotal = parseFloat(order.subtotal || 0);
            const totalAmount = parseFloat(order.total_amount || 0);
            const total_income = totalProfitFromProducts + deliveryFee + taxAmount + serviceCharge;

            return {
                order_id: order.order_id,
                order_number: order.order_number,
                order_date: getDateFromTimestamp(order.order_date),
                warehouse_id: order.warehouse_id,
                items: processedItems,
                income: {
                    profit_from_products: parseFloat(totalProfitFromProducts.toFixed(2)),
                    delivery_fee: parseFloat(deliveryFee.toFixed(2)),
                    tax_amount: parseFloat(taxAmount.toFixed(2)),
                    service_charge: parseFloat(serviceCharge.toFixed(2)),
                    total_income: parseFloat(total_income.toFixed(2)),
                },
                total_cost: parseFloat((subtotal - totalProfitFromProducts).toFixed(2)),
                total_income: parseFloat(total_income.toFixed(2)),
                total_amount: parseFloat(totalAmount.toFixed(2)),
            };
        });

        const Cash_Summery_Result = await calculateCashSummary(sortedOrders);

        const message = "Finance report fetched successfully";
        return res.status(200).json({ 
            success: true, 
            message: format === 'pdf'? `PDF created successfully & ${message}` : message,
            count: completedOrders.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            income : {
                total_delivery_charges: Cash_Summery_Result.total_delivery_fee,
                total_tax_charges: Cash_Summery_Result.total_TAX,
                total_service_charges: Cash_Summery_Result.total_service_charge,
                total_profits_from_products: Cash_Summery_Result.total_profit_from_products,
                total_income: Cash_Summery_Result.total_income,
                total_payments_for_drivers: Cash_Summery_Result.total_payment_for_drivers,
                total_company_withdraws: Cash_Summery_Result.total_company_withdraws,
                total_income_balance: Cash_Summery_Result.available_balance,
            },
            total_income_balance: Cash_Summery_Result.available_balance,
            total_cost: Cash_Summery_Result.extra.total_cost,
            total_balance: Cash_Summery_Result.extra.total_balance,
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