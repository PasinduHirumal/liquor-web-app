
// HTML template generator for drivers report
const generateDriverReportHTML = (data) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drivers Report</title>
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
            background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
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
            background: linear-gradient(90deg, #ecfdf5, #f0fdf4);
            padding: 1.5rem;
            border-left: 4px solid #10b981;
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
            color: #047857;
        }

        .metadata-value {
            color: #065f46;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
            transition: transform 0.2s;
        }

        .stat-card.primary {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }

        .stat-card.success {
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
        }

        .stat-card.warning {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
        }

        .stat-card.danger {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-weight: 500;
            opacity: 0.9;
        }

        .section {
            margin-bottom: 2rem;
        }

        .section-header {
            background: linear-gradient(90deg, #10b981, #059669);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px 8px 0 0;
            font-size: 1.25rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .drivers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 1.5rem;
            padding: 1.5rem;
            background: #f8fafc;
        }

        .driver-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }

        .driver-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f1f5f9;
        }

        .driver-name {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.25rem;
        }

        .driver-id {
            font-size: 0.875rem;
            color: #6b7280;
            font-family: monospace;
        }

        .driver-status {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            align-items: flex-end;
        }

        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-active { background: #dcfce7; color: #166534; }
        .status-inactive { background: #fee2e2; color: #991b1b; }
        .status-verified { background: #dbeafe; color: #1e40af; }
        .status-unverified { background: #fef3c7; color: #92400e; }
        .status-approved { background: #ecfdf5; color: #065f46; }
        .status-pending { background: #fef2f2; color: #b91c1c; }

        .driver-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            margin-bottom: 1rem;
        }

        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .detail-label {
            font-size: 0.75rem;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .detail-value {
            font-weight: 500;
            color: #374151;
        }

        .warehouse-info {
            background: #f8fafc;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
        }

        .warehouse-name {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.25rem;
        }

        .warehouse-code {
            font-size: 0.875rem;
            color: #6b7280;
            font-family: monospace;
        }

        .delivery-stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
        }

        .delivery-stat {
            text-align: center;
            padding: 0.75rem;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }

        .delivery-stat-number {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }

        .delivery-stat-label {
            font-size: 0.75rem;
            color: #6b7280;
            font-weight: 500;
        }

        .delivery-stat.completed .delivery-stat-number { color: #059669; }
        .delivery-stat.ongoing .delivery-stat-number { color: #0891b2; }
        .delivery-stat.cancelled .delivery-stat-number { color: #dc2626; }
        .delivery-stat.total .delivery-stat-number { color: #7c3aed; }

        .earnings-section {
            margin-top: 5px;
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #0891b2;
        }

        .earnings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 1rem;
            text-align: center;
        }

        .earnings-item {
            background: white;
            padding: 0.75rem;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .earnings-amount {
            font-size: 1.1rem;
            font-weight: 700;
            color: #0891b2;
        }

        .earnings-label {
            font-size: 0.75rem;
            color: #64748b;
            margin-top: 0.25rem;
        }

        .warehouse-distribution {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
            margin-bottom: 2rem;
        }

        .distribution-header {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .distribution-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            margin-bottom: 0.5rem;
            background: #f8fafc;
            border-radius: 6px;
            border-left: 4px solid #10b981;
        }

        .distribution-name {
            font-weight: 500;
            color: #374151;
        }

        .distribution-count {
            font-weight: 700;
            color: #059669;
            background: #ecfdf5;
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
        }

        .no-data {
            text-align: center;
            padding: 3rem;
            color: #64748b;
            font-style: italic;
            background: #f8fafc;
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
            
            .driver-card {
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            .stats-grid {
                page-break-inside: avoid;
            }
        }

        @page {
            size: A4;
            margin: 20mm 15mm;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚗 Drivers Report</h1>
            <div class="header-info">
                <p>Comprehensive driver performance and status analysis</p>
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
                        <span class="metadata-label">👥 Total Drivers:</span>
                        <span class="metadata-value">${data.count}</span>
                    </div>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card primary">
                    <div class="stat-number">${data.stats.totalDrivers}</div>
                    <div class="stat-label">Total Drivers</div>
                </div>
                <div class="stat-card success">
                    <div class="stat-number">${data.stats.activeDrivers}</div>
                    <div class="stat-label">Active Drivers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #6366f1;">${data.stats.verifiedDrivers}</div>
                    <div class="stat-label" style="color: #6366f1;">Verified Drivers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #8b5cf6;">${data.stats.totalDeliveries}</div>
                    <div class="stat-label" style="color: #8b5cf6;">Total Deliveries</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #06b6d4;">${data.stats.ongoingDeliveries}</div>
                    <div class="stat-label" style="color: #06b6d4;">Ongoing Deliveries</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #10b981;">${data.stats.completedDeliveries}</div>
                    <div class="stat-label" style="color: #10b981;">Completed Deliveries</div>
                </div>
            </div>

            ${Object.keys(data.stats.warehouseDistribution).length > 0 ? `
                <div class="warehouse-distribution">
                    <div class="distribution-header">
                        🏭 Driver Distribution by Warehouse
                    </div>
                    ${Object.entries(data.stats.warehouseDistribution).map(([warehouse, count]) => `
                        <div class="distribution-item">
                            <span class="distribution-name">${warehouse}</span>
                            <span class="distribution-count">${count} driver${count !== 1 ? 's' : ''}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <div class="section">
                <div class="section-header">
                    👨‍💼 Driver Details
                </div>
                ${data.drivers.length > 0 ? `
                    <div class="drivers-grid">
                        ${data.drivers.map(driver => `
                            <div class="driver-card">
                                <div class="driver-header">
                                    <div>
                                        <div class="driver-name">${driver.full_name}</div>
                                        <div class="driver-id">ID: ${driver.driver_id}</div>
                                    </div>
                                    <div class="driver-status">
                                        <span class="status-badge ${driver.isActive ? 'status-active' : 'status-inactive'}">
                                            ${driver.isActive ? '✅ Active' : '❌ Inactive'}
                                        </span>
                                        <span class="status-badge ${driver.isDocumentVerified ? 'status-verified' : 'status-unverified'}">
                                            ${driver.isDocumentVerified ? '📋 Verified' : '📋 Unverified'}
                                        </span>
                                        <span class="status-badge ${driver.backgroundCheckStatus === 'approved' ? 'status-approved' : 'status-pending'}">
                                            ${driver.backgroundCheckStatus === 'approved' ? '✅ Approved' : '⏳ Pending'}
                                        </span>
                                    </div>
                                </div>

                                <div class="driver-details">
                                    <div class="detail-item">
                                        <span class="detail-label">📧 Email</span>
                                        <span class="detail-value">${driver.email}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">📱 Phone</span>
                                        <span class="detail-value">${driver.phone}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">🆔 NIC Number</span>
                                        <span class="detail-value">${driver.nic_number}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">🪪 License Number</span>
                                        <span class="detail-value">${driver.license_number}</span>
                                    </div>
                                </div>

                                ${driver.warehouse_id ? `
                                    <div class="warehouse-info">
                                        <div class="warehouse-name">🏭 ${driver.warehouse_id.name}</div>
                                        <div class="warehouse-code">Code: ${driver.warehouse_id.code}</div>
                                    </div>
                                ` : `
                                    <div class="warehouse-info">
                                        <div class="warehouse-name">🏭 No warehouse assigned</div>
                                    </div>
                                `}

                                <div class="delivery-stats">
                                    <div class="delivery-stat completed">
                                        <div class="delivery-stat-number">${driver.completedDeliveries}</div>
                                        <div class="delivery-stat-label">Completed</div>
                                    </div>
                                    <div class="delivery-stat ongoing">
                                        <div class="delivery-stat-number">${driver.onGoingDeliveries}</div>
                                        <div class="delivery-stat-label">Ongoing</div>
                                    </div>
                                    <div class="delivery-stat cancelled">
                                        <div class="delivery-stat-number">${driver.cancelledDeliveries}</div>
                                        <div class="delivery-stat-label">Cancelled</div>
                                    </div>
                                    <div class="delivery-stat total">
                                        <div class="delivery-stat-number">${driver.totalDeliveries}</div>
                                        <div class="delivery-stat-label">Total</div>
                                    </div>
                                </div>

                                <div class="earnings-section">
                                    <div class="earnings-grid">
                                        <div class="earnings-item">
                                            <div class="earnings-amount">${driver.totalEarnings}</div>
                                            <div class="earnings-label">Total Earnings</div>
                                        </div>
                                        <div class="earnings-item">
                                            <div class="earnings-amount">${driver.totalWithdraws}</div>
                                            <div class="earnings-label">Total Withdraws</div>
                                        </div>
                                        <div class="earnings-item">
                                            <div class="earnings-amount">${driver.currentBalance}</div>
                                            <div class="earnings-label">Current Balance</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="no-data">
                        🚗 No driver data available
                    </div>
                `}
            </div>

            <div class="footer">
                <p>Generated automatically by Driver Management System</p>
                <p>This report contains ${data.count} drivers with ${data.stats.totalDeliveries} total deliveries</p>
                <p>Overall completion rate: ${data.stats.completionRate}%</p>
            </div>
        </div>
    </div>
</body>
</html>`;
};

export default generateDriverReportHTML;