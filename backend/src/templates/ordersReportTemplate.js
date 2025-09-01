
// HTML template generator
const generateReportHTML = (data) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orders Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
        }

        .container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0" stop-color="rgba(255,255,255,.1)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>') repeat;
            opacity: 0.1;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            position: relative;
            z-index: 1;
        }

        .header-info {
            position: relative;
            z-index: 1;
            opacity: 0.9;
        }

        .metadata {
            background: #f1f5f9;
            padding: 1.5rem;
            border-left: 4px solid #667eea;
            margin-bottom: 2rem;
        }

        .metadata-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }

        .metadata-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .metadata-label {
            font-weight: 600;
            color: #475569;
        }

        .metadata-value {
            color: #64748b;
        }

        .summary-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            color: #64748b;
            font-weight: 500;
        }

        .section {
            margin-bottom: 2rem;
        }

        .section-header {
            background: linear-gradient(90deg, #667eea, #764ba2);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px 8px 0 0;
            font-size: 1.25rem;
            font-weight: 600;
        }

        .table-container {
            background: white;
            border-radius: 0 0 8px 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #f8fafc;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: top;
        }

        tr:hover {
            background: #f8fafc;
        }

        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .status-active {
            background: #dcfce7;
            color: #166534;
        }

        .status-inactive {
            background: #fee2e2;
            color: #991b1b;
        }

        .order-count {
            font-weight: 600;
            color: #667eea;
            font-size: 1.1rem;
        }

        .address {
            color: #64748b;
            font-size: 0.9rem;
            max-width: 250px;
        }

        .no-data {
            text-align: center;
            padding: 3rem;
            color: #64748b;
            font-style: italic;
        }

        .footer {
            margin-top: 3rem;
            text-align: center;
            padding: 2rem;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 0.9rem;
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
            margin: 2rem 0;
        }

        @media print {
            .container {
                box-shadow: none;
            }
            
            .section {
                page-break-inside: avoid;
            }
            
            .table-container {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Orders Report</h1>
            <div class="header-info">
                <p>Comprehensive analysis of warehouse and supermarket orders</p>
            </div>
        </div>

        <div style="padding: 2rem;">
            <div class="metadata">
                <div class="metadata-grid">
                    <div class="metadata-item">
                        <span class="metadata-label">📅 Generated:</span>
                        <span class="metadata-value">${data.generatedDate}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">🔍 Filters:</span>
                        <span class="metadata-value">${data.filters}</span>
                    </div>
                    <div class="metadata-item">
                        <span class="metadata-label">📈 Total Orders:</span>
                        <span class="metadata-value">${data.totalOrders}</span>
                    </div>
                </div>
            </div>

            <div class="summary-stats">
                <div class="stat-card">
                    <div class="stat-number">${data.warehouseData.count}</div>
                    <div class="stat-label">Total Warehouses</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.supermarketData.count}</div>
                    <div class="stat-label">Total Supermarkets</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.totalOrders}</div>
                    <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${data.warehouseData.data.filter(w => w.isActive).length}</div>
                    <div class="stat-label">Active Warehouses</div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">
                    🏭 Warehouse Report
                </div>
                <div class="table-container">
                    ${data.warehouseData.data.length > 0 ? `
                        <table>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Warehouse Name</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                    <th>Liquor Service</th>
                                    <th>Order Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.warehouseData.data.map(warehouse => `
                                    <tr>
                                        <td><strong>${warehouse.where_house_code}</strong></td>
                                        <td>${warehouse.where_house_name}</td>
                                        <td class="address">${warehouse.address}</td>
                                        <td>
                                            <span class="status-badge ${warehouse.isActive ? 'status-active' : 'status-inactive'}">
                                                ${warehouse.isActive ? '✅ Active' : '❌ Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="status-badge ${warehouse.isLiquorActive ? 'status-active' : 'status-inactive'}">
                                                ${warehouse.isLiquorActive ? '🍷 Yes' : '🚫 No'}
                                            </span>
                                        </td>
                                        <td class="order-count">${warehouse.order_count}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="no-data">
                            📭 No warehouse data available
                        </div>
                    `}
                </div>
            </div>

            <div class="divider"></div>

            <div class="section">
                <div class="section-header">
                    🏪 Supermarket Report
                </div>
                <div class="table-container">
                    ${data.supermarketData.data.length > 0 ? `
                        <table>
                            <thead>
                                <tr>
                                    <th>Supermarket Name</th>
                                    <th>Address</th>
                                    <th>Status</th>
                                    <th>Order Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.supermarketData.data.map(supermarket => `
                                    <tr>
                                        <td><strong>${supermarket.name}</strong></td>
                                        <td class="address">${supermarket.streetAddress}</td>
                                        <td>
                                            <span class="status-badge ${supermarket.isActive ? 'status-active' : 'status-inactive'}">
                                                ${supermarket.isActive ? '✅ Active' : '❌ Inactive'}
                                            </span>
                                        </td>
                                        <td class="order-count">${supermarket.orders_count}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="no-data">
                            📭 No supermarket data available
                        </div>
                    `}
                </div>
            </div>

            <div class="footer">
                <p>Generated automatically by Orders Management System</p>
                <p>This report contains ${data.totalOrders} total orders across ${data.warehouseData.count} warehouses and ${data.supermarketData.count} supermarkets</p>
            </div>
        </div>
    </div>
</body>
</html>`;
};

export default generateReportHTML;