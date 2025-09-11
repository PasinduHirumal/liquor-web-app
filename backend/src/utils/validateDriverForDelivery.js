
// Validate if driver can be assigned to an order
const validateDriverForDuty = (driver, order) => {
    const failedChecks = [];
    
    if (!driver.isDocumentVerified) failedChecks.push("Documents not verified");
    if (!driver.isAccountVerified) failedChecks.push("Account not verified");
    if (!driver.isAvailable) failedChecks.push("Not available");
    if (!driver.isActive) failedChecks.push("Account not active");
    if (driver.backgroundCheckStatus !== "approved") {
        failedChecks.push(`Background check ${driver.backgroundCheckStatus} (must be approved)`);
    }
    if (driver.where_house_id !== order.warehouse_id) {
        failedChecks.push("Can't get this order (driver & order must be same where house)");
    }

    return {
        isValid: failedChecks.length === 0,
        errors: failedChecks
    };
};

export { validateDriverForDuty };