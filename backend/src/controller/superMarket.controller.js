import SuperMarketService from "../services/superMarket.service.js";
import OtherProductService from "../services/otherProduct.service.js";
import ProductService from "../services/product.service.js";
import ADMIN_ROLES from "../enums/adminRoles.js";

const marketService = new SuperMarketService();
const groceryService = new OtherProductService();
const liquorService = new ProductService();

const createMarket = async (req, res) => {
	try {
        const { location, orders_count } = req.body;

        const existingSuperMarket = await marketService.findByLocation(location);
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

        const { searchTokens, ...supermarketWithoutSearchTokens } = superMarket;

        return res.status(200).json({ success: true, message: "Super market fetched successfully", data: supermarketWithoutSearchTokens });
    } catch (error) {
        console.error("Get super market by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllMarkets = async (req, res) => {
	try {
        const { isActive, city, state, country } = req.query;

        const filters = {};
        const filterDescription = [];
        const sortDescription = [];

        if (isActive !== undefined) {
            const isBoolean = isActive === 'true';
            filters.isActive = isBoolean;
            filterDescription.push(`isActive: ${isActive}`);
        }
        if (city !== undefined) {
            filters.city = city;
            filterDescription.push(`city: ${city}`);
        }
        if (state !== undefined) {
            filters.state = state;
            filterDescription.push(`state: ${state}`);
        }
        if (country !== undefined) {
            filters.country = country;
            filterDescription.push(`country: ${country}`);
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

        // Remove searchTokens field from each supermarket object
        const sanitizedSupermarkets = sortedMarkets.map(supermarket => {
            const { searchTokens, ...supermarketsWithoutSearchTokens } = supermarket;
            return supermarketsWithoutSearchTokens;
        });
        
        return res.status(200).json({ 
            success: true, 
            message: "Super Markets fetched successfully", 
            count: filteredMarkets.length, 
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            sorted: sortDescription.length > 0 ? sortDescription.join(', ') : null, 
            data: sanitizedSupermarkets 
        });
    } catch (error) {
        console.error("Get all supermarkets error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllMarketsList = async (req, res) => {
	try {
        const superMarkets = await marketService.findAll();

        const sanitizedResults = superMarkets.map(market => ({
            superMarket_id: market.id,
            superMarket_name: `${market.superMarket_Name} - ${market.city}`,
            streetAddress: market.streetAddress
        }));

        return res.status(200).json({ 
            success: true, 
            message: "Super markets list fetched successfully",
            count: superMarkets.length,
            data: sanitizedResults
        });
    } catch (error) {
        console.error("Get all super market list error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const searchMarketsAdvanced = async (req, res) => {
    try {
        const { 
            q: searchTerm,
            multiWord = 'false', // Enable multi-word search
            city,
            state,
            country,
            isActive,
            limit,
            offset
        } = req.query;
        
        if (!searchTerm || searchTerm.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: "Search term is required" 
            });
        }
        
        let results;
        
        if (multiWord === 'true') {
            results = await marketService.searchMarketsMultiWord(searchTerm);
        } else {
            results = await marketService.searchMarkets(searchTerm);
        }
        
        // Apply additional filters
        const filters = {};
        if (city) filters.city = city;
        if (state) filters.state = state;
        if (country) filters.country = country;
        if (isActive !== undefined) filters.isActive = isActive === 'true';
        
        if (Object.keys(filters).length > 0) {
            results = results.filter(market => {
                return Object.entries(filters).every(([field, value]) => {
                    if (value === undefined || value === null || value === '') {
                        return true;
                    }
                    return market[field] === value;
                });
            });
        }
        
        // Apply pagination
        const totalCount = results.length;
        let paginatedResults = results;
        
        if (limit) {
            const limitNum = parseInt(limit);
            const offsetNum = parseInt(offset) || 0;
            paginatedResults = results.slice(offsetNum, offsetNum + limitNum);
        }

        const sanitizedResults = paginatedResults.map(market => ({
            superMarket_id: market.id,
            superMarket_name: `${market.superMarket_Name} - ${market.city}`,
            streetAddress: market.streetAddress
        }));

        return res.status(200).json({
            success: true,
            message: "Search completed successfully",
            searchTerm,
            multiWord: multiWord === 'true',
            total: totalCount,
            count: sanitizedResults.length,
            data: sanitizedResults,
            pagination: limit ? {
                limit: parseInt(limit),
                offset: parseInt(offset) || 0,
                hasMore: (parseInt(offset) || 0) + sanitizedResults.length < totalCount
            } : null
        });
    } catch (error) {
        console.error("Advanced search error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Migration endpoint (call this once to update existing data)
const migrateSearchTokens = async (req, res) => {
    try {
        const result = await marketService.addSearchTokensToExistingDocuments();
        
        return res.status(200).json({
            success: true,
            message: "Search tokens migration completed",
            ...result
        });
    } catch (error) {
        console.error("Migration error:", error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Migration failed",
            error: error.message 
        });
    }
};

const updateMarketById = async (req, res) => {
	try {
        const superMarketId = req.params.id;
        const { isActive, location } = req.body;
        const user_role = req.user?.role ?? null;

        const superMarket = await marketService.findById(superMarketId);
        if (!superMarket) {
            return res.status(404).json({ success: false, message: "Super Market not found"});
        }

        const is_SuperAdmin = ADMIN_ROLES.SUPER_ADMIN;
        if (isActive !== undefined && user_role !== is_SuperAdmin) {
            return res.status(403).json({ message: "Access Forbidden" });
        }

        if (location !== undefined) {
            const existingSuperMarket = await marketService.findByLocation(location);
            if (existingSuperMarket) {
                return res.status(400).json({ success: false, message: "Super Market already exists"});
            }
        }

        const updateData = { ...req.body };

        const updatedMarket = await marketService.updateById(superMarketId, updateData);
        if (!updatedMarket) {
            return res.status(500).json({ success: false, message: "Server Error" });
        }
        
        const { searchTokens, ...supermarketWithoutSearchTokens } = updatedMarket;

        return res.status(200).json({ success: true, message: "Super market updated successfully", data: supermarketWithoutSearchTokens });
    } catch (error) {
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteSuperMarketById = async (req, res) => {
	try {
        const superMarket_id = req.params.id;
        
        const superMarket = await marketService.findById(superMarket_id);
        if (!superMarket) {
            return res.status(404).json({ success: false, message: "Super market not found"});
        }

        const groceryProducts = await groceryService.findAllBySuperMarket(superMarket_id);
        const liquorProducts = await liquorService.findAllBySuperMarket(superMarket_id);

        const TotalProducts = groceryProducts.length + liquorProducts.length;

        if (TotalProducts > 0) {
            return res.status(400).json({ success: false, message: `Can't delete Super Market. It has ${TotalProducts} products` });
        }
        
        await marketService.deleteById(superMarket_id);

        return res.status(200).json({ success: true, message: "Super Market deleted successfully"});
    } catch (error) {
        console.error("Delete super market error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createMarket, getMarketById, getAllMarkets, updateMarketById, searchMarketsAdvanced, migrateSearchTokens, getAllMarketsList, deleteSuperMarketById};