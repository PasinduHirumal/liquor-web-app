import CategoryService from '../services/category.service.js';

const categoryService = new CategoryService();

const getAllCategories = async (req, res) => {
	try {
        const { is_active } = req.query;

        const categories = await categoryService.findAll();
        if (!categories) {
            return res.status(400).json({ success: false, message: "Failed to fetch categories"});
        }
        
        let filteredCategories;
        let filterDescription = [];
        if (is_active !== undefined) {
            // Convert string to boolean since query params are strings
            const isActiveBoolean = is_active === 'true';
            filteredCategories = categories.filter(category => category.is_active === isActiveBoolean);
            filterDescription.push(`isActive: ${is_active}`);
        } else {
            filteredCategories = categories;
        }

        return res.status(200).json({ 
            success: true, 
            message: "Fetching categories successful",
            count: filteredCategories.length,
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null, 
            data: filteredCategories
        });
    } catch (error) {
        console.error("Fetch categories error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getAllCategories, };