import puppeteer from 'puppeteer';
import { loadHtmlTemplate } from '../utils/templateLoader.js';
import { generateOrderRows, replaceTemplatePlaceholders, calculateTotalAmount } from './generatePDF_helpers.js';

// Order's PDF Generation Function
const generateOrdersPDF = async (orders, filters) => {
    let browser;
    
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Helps with memory issues
                '--disable-extensions',
                '--disable-gpu'
            ]
        });
        
        const page = await browser.newPage();
        
        // Load HTML template from external file using utility
        const htmlTemplate = await loadHtmlTemplate('orders-report');
        
        // Replace placeholders with actual data
        const htmlContent = replaceTemplatePlaceholders(htmlTemplate, {
            generationDate: new Date().toLocaleString(),
            filters: filters.length > 0 ? `<p>Filters Applied: ${filters.join(', ')}</p>` : '',
            orderRows: generateOrderRows(orders),
            totalOrders: orders.length,
            totalAmount: calculateTotalAmount(orders)
        });
        
        await page.setContent(htmlContent, { 
            waitUntil: 'networkidle0' // Wait for any potential resources to load
        });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            printBackground: true, // Include background colors
            preferCSSPageSize: true
        });
        
        return pdfBuffer;
        
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};


export { generateOrdersPDF };