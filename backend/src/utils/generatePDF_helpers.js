
// Generate order rows HTML
const generateOrderRows = (orders) => {
    return orders.map(order => `
        <tr>
            <td>${order.id || order._id}</td>
            <td>${order.user?.name || 'N/A'}</td>
            <td>
                <span class="status status-${order.status}">
                    ${order.status}
                </span>
            </td>
            <td>$${Number(order.total_amount || 0).toFixed(2)}</td>
            <td>${new Date(order.created_at).toLocaleDateString()}</td>
            <td>${order.driver?.name || 'Unassigned'}</td>
        </tr>
    `).join('');
};

// Replace template placeholders with actual data
const replaceTemplatePlaceholders = (template, data) => {
    return template
        .replace('{{GENERATION_DATE}}', data.generationDate)
        .replace('{{FILTERS}}', data.filters)
        .replace('{{ORDER_ROWS}}', data.orderRows)
        .replace('{{TOTAL_ORDERS}}', data.totalOrders)
        .replace('{{TOTAL_AMOUNT}}', data.totalAmount || '0.00');
};

// Calculate total amount from orders
const calculateTotalAmount = (orders) => {
    const total = orders.reduce((sum, order) => {
        return sum + (parseFloat(order.total_amount) || 0);
    }, 0);
    
    return total.toFixed(2);
};

export { generateOrderRows, replaceTemplatePlaceholders, calculateTotalAmount };