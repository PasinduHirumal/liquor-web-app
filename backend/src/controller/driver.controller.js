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

export { createDriver, deleteDriver};