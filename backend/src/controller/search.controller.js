import OtherProductService from "../services/otherProduct.service.js";
import ProductService from "../services/product.service.js";
import populateCategory from "../utils/populateCategory.js";

const groceryService = new OtherProductService();
const liquorService = new ProductService();

const searchProductAdvanced = async (req, res) => {
    try {
        const { q: searchTerm, multiWord = 'false', is_active, is_in_stock, is_liquor, limit, offset } = req.query;
        const userRole = req.user?.role ?? null;
        
        if (!searchTerm || searchTerm.trim() === '') {
            return res.status(400).json({ success: false, message: "Search term is required" });
        }
        
        let results_liquor = [];
        let results_grocery = [];
        
        if (multiWord === 'true') {
            results_liquor = await liquorService.searchMultiWords(searchTerm);
            results_grocery = await groceryService.searchMultiWords(searchTerm);
        } else {
            results_liquor = await liquorService.search(searchTerm);
            results_grocery = await groceryService.search(searchTerm);
        }

        let results = [ ...results_liquor, ...results_grocery];

        // Apply additional filters
        const filters = {};
        const filterDescription = [];
        
        if (is_active !== undefined) {
            const isBoolean = is_active === 'true';
            filters.is_active = isBoolean;
            filterDescription.push(`is_active: ${is_active}`);
        } 
        if (is_in_stock !== undefined) {
            const isBoolean = is_in_stock === 'true';
            filters.is_in_stock = isBoolean;
            filterDescription.push(`is_in_stock: ${is_in_stock}`);
        }
        if (is_liquor !== undefined) {
            const isBoolean = is_liquor === 'true';
            filters.is_liquor = isBoolean;
            filterDescription.push(`is_liquor: ${is_liquor}`);
        }
        
        if (Object.keys(filters).length > 0) {
            results = results.filter(product => {
                return Object.entries(filters).every(([field, value]) => {
                    if (value === undefined || value === null || value === '') {
                        return true;
                    }
                    return product[field] === value;
                });
            });
        }
        
        const totalCount = results.length;
        
        // Apply pagination
        let paginatedResults = results;
        
        if (limit) {
            const limitNum = parseInt(limit);
            const offsetNum = parseInt(offset) || 0;

            // Validate pagination parameters
            if (isNaN(limitNum) || limitNum <= 0) {
                return res.status(400).json({ success: false, message: "Invalid limit parameter" });
            }
            if (isNaN(offsetNum) || offsetNum < 0) {
                return res.status(400).json({ success: false, message: "Invalid offset parameter" });
            }

            paginatedResults = results.slice(offsetNum, offsetNum + limitNum);
        }

        const populatedResults = await populateCategory(paginatedResults, userRole);

        if (populatedResults.length < paginatedResults.length) {
            filterDescription.push('category.isActive: true');
        }

        // Remove searchTokens field from each product object
        const sanitizedResults = populatedResults.map(product => {
            const { searchTokens, ...productsWithoutSearchTokens } = product;
            return productsWithoutSearchTokens;
        });

        return res.status(200).json({
            success: true,
            message: "Search completed successfully",
            searchTerm,
            multiWord: multiWord === 'true',
            total: totalCount,
            count: sanitizedResults.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
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

export { searchProductAdvanced };