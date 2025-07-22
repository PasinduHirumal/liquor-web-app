import CategoryService from '../services/category.service.js';

const categoryService = new CategoryService();

const createCategory = async (req, res) => {
	try {
        const { name, is_liquor } = req.body;

        const categories = await categoryService.findByFilter('name', '==', name);
        if (categories.length !== 0) {
            const filtered = categories.filter(category => category.is_liquor === is_liquor);
            if (filtered.length !== 0) {
                return res.status(400).json({ success: false, message: "Category already created"});
            }
        }

        const categoryData = { ...req.body };
        const newCategory = await categoryService.create(categoryData);

        return res.status(201).json({ success: true, message: "Category created successfully", data: newCategory });
    } catch (error) {
        console.error("Create category error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getCategoryById = async (req, res) => {
	try {
        const categoryId = req.params.id;

        const category = await categoryService.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found"});
        }

        return res.status(200).json({ success: true, message: "Category fetched successfully", data: category });
    } catch (error) {
        console.error("Get category by id error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllCategories = async (req, res) => {
	try {
        const { is_active, is_liquor } = req.query;

        const categories = await categoryService.findAll();
        if (!categories) {
            return res.status(400).json({ success: false, message: "Failed to fetch categories"});
        }
        
        let filteredCategories = categories;
        let filterDescription = [];

        if (is_active !== undefined) {
            const isActiveBoolean = is_active === 'true';
            filteredCategories = filteredCategories.filter(category => category.is_active === isActiveBoolean);
            filterDescription.push(`isActive: ${is_active}`);
        }
        if (is_liquor !== undefined) {
            const isActiveBoolean = is_liquor === 'true';
            filteredCategories = filteredCategories.filter(category => category.is_liquor === isActiveBoolean);
            filterDescription.push(`is_liquor: ${is_liquor}`);
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

const updateCategory = async (req, res) => {
	try {
        const categoryId = req.params.id;

        const category = await categoryService.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found"});
        }
        
        const categoryData = { ...req.body };

        const updatedCategory = await categoryService.updateById(categoryId, categoryData);

        return res.status(200).json({ success: true, message: "Category updated successfully", data: updatedCategory });
    } catch (error) {
        console.error("Update category error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteCategory = async (req, res) => {
	try {
        const categoryId = req.params.id;

        const category = await categoryService.findById(categoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found"});
        }
        
        await categoryService.deleteById(categoryId);

        return res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.error("Delete category error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createCategory, getCategoryById, getAllCategories, updateCategory, deleteCategory };