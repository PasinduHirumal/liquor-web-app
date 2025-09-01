import puppeteer from 'puppeteer';
import generateReportHTML from '../templates/ordersReportTemplate.js';
import generateDriverReportHTML from '../templates/driversReportTemplate.js';
import { formatFilters, calculateTotalOrders, formatDriverFilters, calculateDriverStats } from './generatePDF_helpers.js';

// Order's PDF Generation Function
const generateOrdersPDF = async (data, filters = {}) => {
    let browser;
    
    try {
        // Launch puppeteer browser
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Set page format and margins
        await page.setViewport({ width: 1200, height: 800 });
        
        // Prepare template data
        const templateData = {
            title: 'Orders Report',
            generatedDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            filters: formatFilters(filters),
            warehouseData: data.warehouse_report || { count: 0, data: [] },
            supermarketData: data.supermarket_report || { count: 0, data: [] },
            totalOrders: calculateTotalOrders(data)
        };

        // Generate HTML from template
        const htmlContent = generateReportHTML(templateData);
        
        // Set HTML content
        await page.setContent(htmlContent, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            },
            printBackground: true,
            preferCSSPageSize: true
        });

        return pdfBuffer;

    } catch (error) {
        console.error('PDF generation error:', error);
        throw new Error('Failed to generate PDF report');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

// Driver's PDF Generation Function
const generateDriversPDF = async (data, filters = {}) => {
    let browser;
    
    try {
        // Launch puppeteer browser
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Set page format and margins
        await page.setViewport({ width: 1200, height: 800 });
        
        // Prepare template data
        const templateData = {
            title: 'Drivers Report',
            generatedDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            filters: formatDriverFilters(filters),
            drivers: data,
            count: data.length,
            stats: calculateDriverStats(data)
        };

        // Generate HTML from template
        const htmlContent = generateDriverReportHTML(templateData);
        
        // Set HTML content
        await page.setContent(htmlContent, { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            },
            printBackground: true,
            preferCSSPageSize: true
        });

        return pdfBuffer;

    } catch (error) {
        console.error('Driver PDF generation error:', error);
        throw new Error('Failed to generate driver PDF report');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};


export { generateOrdersPDF, generateDriversPDF };