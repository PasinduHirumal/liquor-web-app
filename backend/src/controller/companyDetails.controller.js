import CompanyService from '../services/company.service.js';
import SystemService from '../services/system.service.js';
import DriverService from '../services/driver.service.js';
import AdminUserService from '../services/adminUsers.service.js';

const companyService = new CompanyService();
const systemService = new SystemService();
const driverService = new DriverService();
const adminService = new AdminUserService();

const createWareHouse = async (req, res) => {
	try {
        const { where_house_name, where_house_location } = req.body;

        const existingWarehouseByName  = await companyService.findByWarehouseName(where_house_name);
        if (existingWarehouseByName) {
            return res.status(400).json({ success: false, message: "Warehouse already exists"});
        }
        const existingWarehouseByLocation  = await companyService.findByWarehouseLocation(where_house_location);
        if (existingWarehouseByLocation) {
            return res.status(400).json({ success: false, message: "Warehouse already exists"});
        }

        const count = await companyService.count();
        let where_house_code;
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            const timestamp = Date.now().toString().slice(-4);
            where_house_code = `B-${(count + 1).toString().padStart(2, '0')}${timestamp}`;
            
            const existing = await companyService.findByWarehouseCode(where_house_code);
            if (!existing) {
                isUnique = true;
            } else {
                attempts++;
                // Small delay to ensure different timestamp
                await new Promise(resolve => setTimeout(resolve, 1));
            }
        }

        if (!isUnique) {
            return res.status(500).json({ success: false, message: "Unable to generate unique warehouse code" });
        }

        const where_house_data = {
            where_house_code,
            ...req.body
        };

        const new_where_house = await companyService.create(where_house_data);
        if (!new_where_house) {
            return res.status(500).json({ success: false, message: "Server Error", reason: "Error in creating"});
        }
        
        return res.status(200).json({ success: true, message: "Warehouse created successfully", data: new_where_house });
    } catch (error) {
        console.error("Create where house error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllWarehouses = async (req, res) => {
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

const updateWarehouseById = async (req, res) => {
	try {
        const warehouse_id = req.params.id;
        const { where_house_name, where_house_location } = req.body;

        const warehouse = await companyService.findById(warehouse_id);
        if (!warehouse) {
            return res.status(404).json({ success: false, message: "Warehouse not found" });
        }

        if (where_house_name !== undefined){
            const existingWarehouseByName  = await companyService.findByWarehouseName(where_house_name);
            if (existingWarehouseByName && existingWarehouseByName.id !== warehouse.id) {
                return res.status(400).json({ success: false, message: "Can't update name. Warehouse already exists"});
            }
        }

        if (where_house_location !== undefined) {
            const existingWarehouseByLocation  = await companyService.findByWarehouseLocation(where_house_location);
            if (existingWarehouseByLocation && existingWarehouseByLocation.id !== warehouse.id) {
                return res.status(400).json({ success: false, message: "Can't update location. Warehouse already exists"});
            }
        }

        const updateData = { ...req.body };

        const updatedWarehouse = await companyService.updateById(warehouse_id, updateData);
        if (!updatedWarehouse) {
            return res.status(500).json({ success: false, message: "Failed to update Warehouse"});
        }

        return res.status(200).json({ success: true, message: "Warehouse updated successfully", data: updatedWarehouse });
    } catch (error) {
        console.error("Update Warehouse error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteWarehouseById = async (req, res) => {
	try {
        const warehouse_id = req.params.id;

        const warehouse = await companyService.findById(warehouse_id);
        if (!warehouse) {
            return res.status(404).json({ success: false, message: "Warehouse not found" });
        }

        await companyService.deleteById(warehouse_id);

        return res.status(200).json({ success: true, message: "Warehouse deleted successfully"});
    } catch (error) {
        console.error("Delete warehouse error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createWareHouse, getAllWarehouses, updateWarehouseById, deleteWarehouseById };