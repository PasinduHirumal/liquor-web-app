import DriverService from "../services/driver.service.js";
import CompanyService from "../services/company.service.js";
import ADMIN_ROLES from '../enums/adminRoles.js';
import BACKGROUND_STATUS from "../enums/driverBackgroundStatus.js";
import populateWhereHouse from "../utils/populateWhere_House.js";
import { uploadImages, uploadSingleImage } from '../utils/firebaseStorage.js';

const driverService = new DriverService();
const companyService = new CompanyService();

const createDriver = async (req, res) => {
	try {
        const { email, phone, profileImage, where_house_id } = req.body;

        const existingDriver  = 
            (email && await driverService.findByEmail(email)) || 
            (phone && await driverService.findByPhone(phone));

        if (existingDriver) {
            return res.status(400).json({ success: false, message: "Driver already exists" });
        }

        const where_house = await companyService.findById(where_house_id);
        if (!where_house) {
            return res.status(400).json({ success: false, message: "Invalid where house id" });
        }
        
        if (profileImage !== undefined) {
            try {
                const imageUrl = await uploadSingleImage(profileImage, 'driver_profile_images');
                req.body.profileImage = imageUrl || null;
                console.log('✅ Images uploaded successfully:', imageUrl);
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload images" 
                });
            }
        } 

        if (req.body.profileImage === null || req.body.profileImage === undefined) {
            const index = Math.floor(Math.random() * 100) + 1;
            const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;

            req.body.profileImage = randomAvatar;
        }

        const driverData = { ...req.body };

        // random password
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        driverData.password = `DRI@${random}`;

        const driver = await driverService.create(driverData);

        // block password displaying
        const { password, ...driverWithoutPassword } = driver;

        return res.status(200).json({ 
            success: true, 
            message: "Driver created successfully",
            password: `DRI@${random}`,
            data: driverWithoutPassword
        });
    } catch (error) {
        console.error("Driver create error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllDrivers = async (req, res) => {
	try {
        const { isActive, isAvailable, isOnline, isDocumentVerified, backgroundCheckStatus, where_house_id } = req.query;

        const filters = {};
        const filterDescription = [];

        if (isActive !== undefined) {
            const isBoolean = isActive === 'true';
            filters.isActive = isBoolean;
            filterDescription.push(`isActive: ${isActive}`);
        } 
        if (isAvailable !== undefined) {
            const isBoolean = isAvailable === 'true';
            filters.isAvailable = isBoolean;
            filterDescription.push(`isAvailable: ${isAvailable}`);
        }
        if (isOnline !== undefined) {
            const isBoolean = isOnline === 'true';
            filters.isOnline = isBoolean;
            filterDescription.push(`isOnline: ${isOnline}`);
        }
        if (isDocumentVerified !== undefined) {
            const isBoolean = isDocumentVerified === 'true';
            filters.isDocumentVerified = isBoolean;
            filterDescription.push(`isDocumentVerified: ${isDocumentVerified}`);
        }
        if (backgroundCheckStatus !== undefined) {
            if (backgroundCheckStatus && !Object.values(BACKGROUND_STATUS).includes(backgroundCheckStatus)) {
                return res.status(400).json({ success: false, message: "Invalid status value" });
            }
            
            filters.backgroundCheckStatus = backgroundCheckStatus;
            filterDescription.push(`backgroundCheckStatus: ${backgroundCheckStatus}`);
        }
        if (where_house_id !== undefined) {
            const where_house = await companyService.findById(where_house_id);
            if (!where_house) {
                return res.status(400).json({ success: false, message: "Invalid where house id" });
            }
            
            filters.where_house_id = where_house_id;
            filterDescription.push(`where_house_id: ${where_house_id}`);
        }

        const filteredDrivers = Object.keys(filters).length > 0 
            ? await driverService.findWithFilters(filters)
            : await driverService.findAll();

        const populatedDrivers = await populateWhereHouse(filteredDrivers);

        // Remove password field from each driver object
        const sanitizedDrivers = populatedDrivers.map(driver => {
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

const getDriverById = async (req, res) => {
	try {
        const driverId = req.params.id;

        const driver = await driverService.findById(driverId);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found"});
        }

        let populatedDriver = null;
        try {
            populatedDriver = await populateWhereHouse(driver);
        } catch (error) {
            console.error("Error populating where house:", error);
            return res.status(500).json({ success: false, message: "Failed to populate where house" });
        }
        
        // Remove password before sending 
        const { password, ...driverWithoutPassword } = populatedDriver;

        return res.status(200).json({ success: true, message: "Driver fetched successfully", data: driverWithoutPassword });
    } catch (error) {
        console.error("Get driver by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateDriver = async (req, res) => {
	try {
        const driverId = req.params.id;
        const currentUserId = req.user.id;
        const { email, phone, profileImage, documents, isActive, isDocumentVerified, isAccountVerified, where_house_id } = req.body;

        const driver = await driverService.findById(driverId);
        if (!driver) {
            return res.status(404).json({ success: false, message: "Driver not found"});
        }

        if (where_house_id !== undefined) {
            const where_house = await companyService.findById(where_house_id);
            if (!where_house) {
                return res.status(400).json({ success: false, message: "Invalid where house id" });
            }
        }

        // Authorization logic
        const isSuperAdmin = req.user.role === ADMIN_ROLES.SUPER_ADMIN;
        const isAdmin = req.user.role === ADMIN_ROLES.ADMIN;
        const isUpdatingSelf = currentUserId === driverId;

        if ((!isSuperAdmin && !isAdmin) && !isUpdatingSelf) {
            return res.status(403).json({ success: false, message: "Not authorized to update" });
        }

        // Only super admin can change these
        if (isActive || isDocumentVerified || isAccountVerified || where_house_id) {
            if (!isSuperAdmin) {
                return res.status(403).json({ success: false, message: "Not authorized to update" });
            }
        }

        // handle profile image uploading
        if (profileImage !== undefined) {
            try {
                const imageUrl = await uploadSingleImage(profileImage, 'driver_profile_images');
                req.body.profileImage = imageUrl || null;
                console.log('✅ Images uploaded successfully:', imageUrl);
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload images" 
                });
            }
        }

        // Handle document uploads
        if (documents && typeof documents === 'object') {
            try {
                const updatedDocuments = { ...documents };
                
                // Process each document type that might contain images
                const documentTypes = ['licenseImage', 'nicImage', 'vehicleRegistrationImage', 'insuranceImage', 'bankStatementImage'];
                
                for (const docType of documentTypes) {
                    if (updatedDocuments[docType] !== undefined) {
                        // If it's null or empty, keep as is (for deletion)
                        if (updatedDocuments[docType] === null || updatedDocuments[docType] === '') {
                            updatedDocuments[docType] = null;
                        } else {
                            // Upload the document image
                            const docImageUrls = await uploadImages(updatedDocuments[docType], 'driver_documents', docType);
                            updatedDocuments[docType] = docImageUrls[0] || null; // Take first image
                            console.log(`✅ ${docType} uploaded successfully:`, docImageUrls[0]);
                        }
                    }
                }
                
                req.body.documents = updatedDocuments;
            } catch (uploadError) {
                console.error('Document upload failed:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload documents" 
                });
            }
        }

        const updateData = { ...req.body };

        if (email !== undefined || phone !== undefined) {
            updateData.isAccountVerified = false;
        }

        // If documents are updated, mark as unverified for re-verification
        if (documents && typeof documents === 'object') {
            updateData.isDocumentVerified = false;
        }

        const updatedDriver = await driverService.updateById(driverId, updateData);
        if (!updatedDriver) {
            return res.status(500).json({ success: false, message: "Failed to update driver" });
        }

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

export { createDriver, getAllDrivers, getDriverById, updateDriver, deleteDriver};