import CompanyService from '../services/company.service.js';
import SystemService from '../services/system.service.js';
import ADMIN_ROLES from '../enums/adminRoles.js';
import DriverService from '../services/driver.service.js';
import AdminUserService from '../services/adminUsers.service.js';

const companyService = new CompanyService();
const systemService = new SystemService();
const driverService = new DriverService();
const adminService = new AdminUserService();

const createWhereHouse = async (req, res) => {
	try {
        const { where_house_name } = req.body;

        const whereHouse = await companyService.findByFilter('where_house_name', '==', where_house_name);
        if (whereHouse && whereHouse.length > 0) {
            return res.status(400).json({ success: false, message: "Where House already exists"});
        }

        const whereHouses = await companyService.findAll();
        if (!whereHouses) {
            return res.status(500).json({ success: false, message: "Server Error", reason: "Error in fetching"});
        }

        // Sort by created_at in descending order (newest first)
        const sortedWhereHouses = whereHouses.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });

        const recent_code = sortedWhereHouses[0].where_house_code;
        const numericPart = recent_code.split('-')[1]; // "B-000001" -> "000001"
        const incrementedNumber = parseInt(numericPart, 10) + 1; // Convert to number, increment by 1,
        const code = incrementedNumber.toString().padStart(6, '0'); // pad with zeros to maintain 6 digits

        const where_house_data = {
            where_house_code: `B-${code}`,
            ...req.body
        };

        const new_where_house = await companyService.create(where_house_data);
        if (!new_where_house) {
            return res.status(500).json({ success: false, message: "Server Error", reason: "Error in creating"});
        }
        
        return res.status(200).json({ success: true, message: "Where House created successfully", data: new_where_house });
    } catch (error) {
        console.error("Create where house error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getCompanyDetails = async (req, res) => {
	try {
        const { isActive } = req.query;

        const filters = {};
        const filterDescription = [];

        if (isActive !== undefined) {
            const isBoolean = isActive === 'true';
            filters.isActive = isBoolean;
            filterDescription.push(`isActive: ${isActive}`);
        } 

        const details = Object.keys(filters).length > 0 
            ? await systemService.findWithFilters(filters)
            : await systemService.findAll();
        
        // Sort by created_at in ascending order (oldest first)
        const sortedDetails = details.sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });

        // Admins & Drivers
        const drivers = await driverService.findAll();
        const admins = await adminService.findAll();

        // Add staff information to each warehouse
        const detailsWithStaff = sortedDetails.map(warehouse => {
            // Filter admins for this warehouse
            const warehouseAdmins = admins.filter(admin => admin.where_house_id === warehouse.id);
            
            // Filter drivers for this warehouse
            const warehouseDrivers = drivers.filter(driver => driver.where_house_id === warehouse.id);

            // Format admin data
            const formattedAdmins = warehouseAdmins.map(admin => ({
                id: admin.id,
                email: admin.email,
                name: `${admin.firstName} ${admin.lastName}`
            }));

            // Format driver data
            const formattedDrivers = warehouseDrivers.map(driver => ({
                id: driver.id,
                email: driver.email,
                name: `${driver.firstName} ${driver.lastName}`
            }));

            return {
                ...warehouse,
                staff: {
                    admin_count: warehouseAdmins.length,
                    drivers_count: warehouseDrivers.length,
                    admins: formattedAdmins,
                    drivers: formattedDrivers
                }
            };
        });
        
        return res.status(200).json({ 
            success: true, 
            message: "System Details fetched successfully", 
            count: details.length, 
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: detailsWithStaff  
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

export { createWhereHouse, getCompanyDetails, updateCompanyDetailById };