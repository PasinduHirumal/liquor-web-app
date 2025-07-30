import CompanyService from '../services/company.service.js';
import ADMIN_ROLES from '../enums/adminRoles.js';

const companyService = new CompanyService();

const getCompanyDetails = async (req, res) => {
	try {
        const allowedRoles = [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Forbidden" });
        }

        const details = await companyService.findAll();
        if (!details) {
            return res.status(400).json({ success: false, message: "Failed to fetch company details" });
        }

        if (details.length === 0) {
            return res.status(400).json({ success: false, message: "No company details found" });
        }

        let companyData = details[0];
        if (details.length > 0) {
            // Sort by created_at in ascending order (oldest first)
            const sortedDetails = details.sort((a, b) => {
                return new Date(a.created_at) - new Date(b.created_at);
            });

            companyData = sortedDetails[0];
        }
        
        return res.status(200).json({ 
            success: true, 
            message: "Company Details fetched successfully", 
            count: details.length, 
            data: companyData 
        });
    } catch (error) {
        console.error("Get company details error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getCompanyDetails };