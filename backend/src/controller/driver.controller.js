import DriverService from "../services/driver.service.js";
import ADMIN_ROLES from '../enums/adminRoles.js';

const driverService = new DriverService();

const createDriver = async (req, res) => {
	try {
        const { email, phone } = req.body;

        const driverByEmail  = await driverService.findByEmail(email);
        const driverByPhone = await driverService.findByPhone(phone);

        if (driverByEmail || driverByPhone) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (req.body.password) {
            delete req.body.password;
        }

        if (req.body.profileImage) {
            delete req.body.profileImage;
        }

        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;

        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

        const driverData = {
            password: `DRI@${random}`,
            profileImage: randomAvatar,
            ...req.body
        }

        const driver = await driverService.create(driverData);

        // block password displaying
        const { password, ...driverWithoutPassword } = driver;

        return res.status(200).json({ 
            success: true, 
            message: "Driver created successfully",
            data: driverWithoutPassword
        });
    } catch (error) {
        console.error("Driver create error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllDrivers = async (req, res) => {
	try {
        const { isActive, isAvailable, isOnline, isDocumentVerified } = req.query;

        const drivers = await driverService.findAll();
        if (!drivers) {
            return res.status(400).json({ success: false, message: "Failed to get all drivers"});
        }
        
        let filteredDrivers = drivers;
        let filterDescription = [];

        if (isActive !== undefined) {
            const isActiveBoolean = isActive === 'true';
            filteredDrivers = filteredDrivers.filter(driver => driver.isActive === isActiveBoolean);
            filterDescription.push(`isActive: ${isActive}`);
        } 
        if (isAvailable !== undefined) {
            const isActiveBoolean = isAvailable === 'true';
            filteredDrivers = filteredDrivers.filter(driver => driver.isAvailable === isActiveBoolean);
            filterDescription.push(`isAvailable: ${isAvailable}`);
        }
        if (isOnline !== undefined) {
            const isActiveBoolean = isOnline === 'true';
            filteredDrivers = filteredDrivers.filter(driver => driver.isOnline === isActiveBoolean);
            filterDescription.push(`isOnline: ${isOnline}`);
        }
        if (isDocumentVerified !== undefined) {
            const isActiveBoolean = isDocumentVerified === 'true';
            filteredDrivers = filteredDrivers.filter(driver => driver.isDocumentVerified === isActiveBoolean);
            filterDescription.push(`isDocumentVerified: ${isDocumentVerified}`);
        }

        // Remove password field from each driver object
        const sanitizedDrivers = filteredDrivers.map(driver => {
            const { password, ...driverWithoutPassword } = driver;
            return driverWithoutPassword;
        });

        // Sort by createdAt in descending order (newest at first)
        const sortedDrivers = sanitizedDrivers.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        return res.status(200).json({ 
            success: true, 
            message: "Drivers fetched successfully",
            count: sortedDrivers.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null,
            data: sortedDrivers
        });
    } catch (error) {
        console.error("Fetch all drivers error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateDriver = async (req, res) => {
	try {
        const driverId = req.params.id;
        const currentUserId = req.user.id;

        const driver = await driverService.findById(driverId);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found"});
        }

        // Authorization logic
        const isSuperAdmin = req.user.role === ADMIN_ROLES.SUPER_ADMIN;
        const isAdmin = req.user.role === ADMIN_ROLES.ADMIN;
        const isUpdatingSelf = currentUserId === driverId;

        if ((!isSuperAdmin && !isAdmin) && !isUpdatingSelf) {
            return res.status(403).json({ success: false, message: "Not authorized to update" });
        }

        const driverData = { ...req.body };
        const updatedDriver = await driverService.updateById(driverId, driverData)

        const { password, ...driverWithoutPassword } = updatedDriver;

        return res.status(200).json({ success: true, message: "Driver updated successfully", data: driverWithoutPassword });
    } catch (error) {
        console.error("Update driver error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteDriver = async (req, res) => {
	try {
        const driverId = req.params.id;

        const driverToDelete = await driverService.findById(driverId);
        if (!driverToDelete) {
            return res.status(404).json({ success: false, message: "Driver not found"});
        }

        await driverService.deleteById(driverId);

        return res.status(200).json({ success: true, message: "Driver deleted successfully"});
    } catch (error) {
        console.error("Delete driver error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createDriver, getAllDrivers, updateDriver, deleteDriver};