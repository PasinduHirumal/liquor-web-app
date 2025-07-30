import CompanyService from '../services/company.service.js';
import ADMIN_ROLES from '../enums/adminRoles.js';

const companyService = new CompanyService();

const getCompanyDetails = async (req, res) => {
	try {
        const allowedRoles = [ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN];
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Access Forbidden" });
        }

        const details = await companyService.findAll();
        if (!details) {
            return res.status(400).json({ success: false, message: "Failed to fetch System details" });
        }

        if (details.length === 0) {
            return res.status(400).json({ success: false, message: "No System details found" });
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
            message: "System Details fetched successfully", 
            count: details.length, 
            data: companyData 
        });
    } catch (error) {
        console.error("Get System details error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateCompanyDetailById = async (req, res) => {
	try {
        const companyDetailId = req.params.id;
        const userRole = req.user.role;

        if (!companyDetailId) {
            return res.status(400).json({ message: "System detail ID is required" });
        }

        const allowedRoles = [ADMIN_ROLES.SUPER_ADMIN];
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ success: false, message: "Access Forbidden" });
        }

        const systemDetail = await companyService.findById(companyDetailId);
        if (!systemDetail) {
            return res.status(404).json({ success: false, message: "System Detail not found" });
        }

        const updateData = { ...req.body };

        const updatedData = await companyService.updateById(companyDetailId, updateData);
        if (!updatedData) {
            return res.status(500).json({ success: false, message: "Failed to update System Details"});
        }

        return res.status(200).json({ success: true, message: "System Details updated successfully", data: updatedData });
    } catch (error) {
        console.error("Update company details error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getCompanyDetails, updateCompanyDetailById };