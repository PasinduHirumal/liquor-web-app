// Fallback template (same as your original)
const getDefaultTemplate = () => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Orders Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .filters { background: #f5f5f5; padding: 10px; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .status { padding: 4px 8px; border-radius: 4px; color: white; }
                .status-pending { background-color: #ffc107; }
                .status-confirmed { background-color: #28a745; }
                .status-delivered { background-color: #17a2b8; }
                .status-cancelled { background-color: #dc3545; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Orders Report</h1>
                <p>Generated on: {{GENERATION_DATE}}</p>
                {{FILTERS}}
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Total Amount</th>
                        <th>Created Date</th>
                        <th>Driver</th>
                    </tr>
                </thead>
                <tbody>
                    {{ORDER_ROWS}}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Total Orders: {{TOTAL_ORDERS}}</p>
            </div>
        </body>
        </html>
    `;
};

export { getDefaultTemplate };