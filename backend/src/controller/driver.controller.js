import DriverService from "../services/driver.service.js";

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
        const { isActive, isAvailable } = req.query;

        if (isAvailable !== undefined && isActive !== undefined) {
            return res.status(400).json({ success: false, message: "Pass only one query parameter at a time"});
        }

        const drivers = await driverService.findAll();
        if (!drivers) {
            return res.status(400).json({ success: false, message: "Failed to get all drivers"});
        }
        
        let filteredDrivers;
        let filterDescription = [];
        if (isActive !== undefined) {
            const isActiveBoolean = isActive === 'true';
            filteredDrivers = drivers.filter(driver => driver.isActive === isActiveBoolean);
            filterDescription.push(`isActive: ${isActive}`);
        } else if (isAvailable !== undefined) {
            const isActiveBoolean = isAvailable === 'true';
            filteredDrivers = drivers.filter(driver => driver.isAvailable === isActiveBoolean);
            filterDescription.push(`isAvailable: ${isAvailable}`);
        } else {
            filteredDrivers = drivers;
        }
        return res.status(200).json({ 
            success: true, 
            message: "Drivers fetched successfully",
            count: filteredDrivers.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null,
            data: filteredDrivers
        });
    } catch (error) {
        console.error("Fetch all drivers error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateDriver = async (req, res) => {
	try {
        return res.status(400).json({ success: false, message: ""});
        return res.status(200).json({ success: true, message: ""});
    } catch (error) {
        console.error("Method_name error:", error.message);
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

export { createDriver, getAllDrivers, deleteDriver};