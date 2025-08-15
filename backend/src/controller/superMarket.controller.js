import SuperMarketService from "../services/superMarket.service.js";
import ADMIN_ROLES from "../enums/adminRoles.js";

const marketService = new SuperMarketService();

const createMarket = async (req, res) => {
	try {
        const { streetAddress, orders_count } = req.body;

        const existingSuperMarket = await marketService.findByStreetAddress(streetAddress);
        if (existingSuperMarket) {
            return res.status(400).json({ success: false, message: "Super Market already exists"});
        }

        if (orders_count !== undefined) {
            req.body.orders_count = 0;
        }

        const superMarket = await marketService.create(req.body);
        if (!superMarket) {
            return res.status(500).json({ success: false, message: "Server Error" });
        }
        
        return res.status(201).json({ success: true, message: "Super market created successfully", data: superMarket });
    } catch (error) {
        console.error("Create super market error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getMarketById = async (req, res) => {
	try {
        const superMarketId = req.params.id;

        const superMarket = await marketService.findById(superMarketId);
        if (!superMarket) {
            return res.status(404).json({ success: false, message: "Super Market not found"});
        }
        
        return res.status(200).json({ success: true, message: "Super market fetched successfully", data: superMarket });
    } catch (error) {
        console.error("Get super market by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllMarkets = async (req, res) => {
	try {
        const { isActive } = req.query;

        const filters = {};
        const filterDescription = [];
        const sortDescription = [];

        if (isActive !== undefined) {
            const isBoolean = isActive === 'true';
            filters.isActive = isBoolean;
            filterDescription.push(`isActive: ${isActive}`);
        } 

        const filteredMarkets = Object.keys(filters).length > 0 
            ? await marketService.findWithFilters(filters)
            : await marketService.findAll();

        // Sort by created_at in descending order (newest first)
        const sortedMarkets = filteredMarkets.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        if (sortedMarkets) {
            sortDescription.push("by date: createdAt descending (newest first)");
        }
        
        return res.status(200).json({ 
            success: true, 
            message: "Super Markets fetched successfully", 
            count: filteredMarkets.length, 
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            sorted: sortDescription.length > 0 ? sortDescription.join(', ') : null, 
            data: sortedMarkets 
        });
    } catch (error) {
        console.error("Get all supermarkets error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllMarketsList = async (req, res) => {
	try {
        const superMarkets = await marketService.findAll();

        const sanitizedMarkets = superMarkets.map(market => ({
            superMarket_id: market.id,
            superMarket_name: `${market.superMarket_Name} - ${market.city}`
        }));
        
        return res.status(200).json({ 
            success: true, 
            message: "Super Markets list fetched successfully", 
            count: superMarkets.length, 
            data: sanitizedMarkets 
        });
    } catch (error) {
        console.error("Get all supermarkets list error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateMarketById = async (req, res) => {
	try {
        const superMarketId = req.params.id;
        const { isActive } = req.body;
        const user_role = req.user? req.user.role : null;

        const superMarket = await marketService.findById(superMarketId);
        if (!superMarket) {
            return res.status(404).json({ success: false, message: "Super Market not found"});
        }

        const is_SuperAdmin = ADMIN_ROLES.SUPER_ADMIN;
        if (isActive !== undefined && user_role !== is_SuperAdmin) {
            return res.status(403).json({ message: "Access Forbidden" });
        }

        const updateData = { ...req.body };

        const updatedMarket = await marketService.updateById(superMarketId, updateData);
        if (!updatedMarket) {
            return res.status(500).json({ success: false, message: "Server Error" });
        }
        
        return res.status(200).json({ success: true, message: "Super market updated successfully", data: updatedMarket });
    } catch (error) {
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createMarket, getMarketById, getAllMarkets, updateMarketById, getAllMarketsList };