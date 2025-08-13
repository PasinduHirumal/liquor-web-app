import BannerService from "../services/banner.service.js";
import { deleteImages, uploadSingleImage } from "../utils/firebaseStorage.js";

const bannerService = new BannerService();

const createBanner = async (req, res) => {
	try {
        const { image } = req.body;

        if (image !== undefined) {
            try {
                const imageUrl = await uploadSingleImage(image, 'banner');
                req.body.image = imageUrl;
                console.log('✅ Image uploaded successfully:', imageUrl);
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload image" 
                });
            }
        }

        const bannerData = { ...req.body };

        const banner = await bannerService.create(bannerData);
        if (!banner) {
            return res.status(400).json({ success: false, message: "Failed to create banner"});
        }

        return res.status(201).json({ success: true, message: "Banner created successfully", data: banner });
    } catch (error) {
        console.error("Create banner error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllBanners = async (req, res) => {
	try {
        const { isActive, isLiquor } = req.query;

        const filters = {};
        const filterDescription = [];

        if (isActive !== undefined) {
            const isBoolean = isActive === 'true';
            filters.isActive = isBoolean;
            filterDescription.push(`isActive: ${isActive}`);
        }
        if (isLiquor !== undefined) {
            const isBoolean = isLiquor === 'true';
            filters.isLiquor = isBoolean;
            filterDescription.push(`isLiquor: ${isLiquor}`);
        }

        const filteredBanners = Object.keys(filters).length > 0 
            ? await bannerService.findWithFilters(filters)
            : await bannerService.findAll(); 

        // Sort by createdAt in ascending order (oldest first)
        const sortedBanners = filteredBanners.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        
        return res.status(200).json({ 
            success: true, 
            message: "Banners fetched successfully",
            count: filteredBanners.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null,
            data: sortedBanners
        });
    } catch (error) {
        console.error("Get all banners error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getBannerById = async (req, res) => {
	try {
        const banner_id = req.params.id;

        const banner = await bannerService.findById(banner_id);
        if (!banner) {
            return res.status(404).json({ success: false, message: "Banner not found"});
        }
        
        return res.status(200).json({ success: true, message: "Banner fetched successfully", data: banner });
    } catch (error) {
        console.error("Get banner by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateBannerById = async (req, res) => {
	try {
        const banner_id = req.params.id;
        const { image } = req.body;

        const banner = await bannerService.findById(banner_id);
        if (!banner) {
            return res.status(404).json({ success: false, message: "Banner not found"});
        }

        if (image !== undefined) {
            try {
                const imageUrl = await uploadSingleImage(image, 'banner');
                req.body.image = imageUrl;
                console.log('✅ Image uploaded successfully:', imageUrl);
            } catch (uploadError) {
                console.error('Image upload failed:', uploadError);
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload image" 
                });
            }
        }

        const updateData = { ...req.body };

        const updatedBanner = await bannerService.updateById(banner_id, updateData);

        return res.status(200).json({ success: true, message: "Banner updated successfully", data: updatedBanner });
    } catch (error) {
        console.error("Update banner error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteBannerById = async (req, res) => {
	try {
        const banner_id = req.params.id;

        const banner = await bannerService.findById(banner_id);
        if (!banner) {
            return res.status(404).json({ success: false, message: "Banner not found"});
        }

        try {
            await deleteImages(banner.image);
        } catch (imageError) {
            console.error("Failed to delete banner images:", imageError.message);
            return res.status(500).json({ success: false, message: "Server Error" });
        }

        const response = await bannerService.deleteById(banner_id);

        return res.status(200).json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        console.error("Delete banner error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


export { createBanner, getAllBanners, getBannerById, updateBannerById, deleteBannerById };