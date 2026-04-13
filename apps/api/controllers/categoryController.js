const Category = require("../Models/CategoryModel");

// GET: Get all categories
const getAllCategories = async (req, res) => {
    try {
        const { active } = req.query;
        
        const filter = {};
        if (active === 'true') {
            filter.isActive = true;
        }
        
        const categories = await Category.find(filter)
            .sort({ sortOrder: 1, createdAt: 1 })
            .lean();

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, error: "Failed to fetch categories" });
    }
};

// GET: Get single category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const category = await Category.findById(id).lean();

        if (!category) {
            return res.status(404).json({ 
                success: false, 
                error: "Category not found" 
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ success: false, error: "Failed to fetch category" });
    }
};

// POST: Create new category (Admin only)
const createCategory = async (req, res) => {
    try {
        const categoryData = {
            ...req.body,
            updatedAt: new Date()
        };

        const category = new Category(categoryData);
        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        console.error("Error creating category:", error);
        if (error.code === 11000) {
            res.status(400).json({ 
                success: false, 
                error: "Category name already exists" 
            });
        } else {
            res.status(500).json({ success: false, error: "Failed to create category" });
        }
    }
};

// PUT: Update category (Admin only)
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        const category = await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ 
                success: false, 
                error: "Category not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });
    } catch (error) {
        console.error("Error updating category:", error);
        if (error.code === 11000) {
            res.status(400).json({ 
                success: false, 
                error: "Category name already exists" 
            });
        } else {
            res.status(500).json({ success: false, error: "Failed to update category" });
        }
    }
};

// DELETE: Delete category (Admin only)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if category is being used by any treks
        const Trek = require("../Models/TrekModel");
        const trekCount = await Trek.countDocuments({ category: id });
        
        if (trekCount > 0) {
            return res.status(400).json({
                success: false,
                error: `Cannot delete category. It is being used by ${trekCount} trek(s). Consider deactivating instead.`
            });
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ 
                success: false, 
                error: "Category not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ success: false, error: "Failed to delete category" });
    }
};

// PATCH: Toggle category status (Admin only)
const toggleCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const category = await Category.findByIdAndUpdate(
            id,
            { isActive, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ 
                success: false, 
                error: "Category not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: `Category ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: category
        });
    } catch (error) {
        console.error("Error updating category status:", error);
        res.status(500).json({ success: false, error: "Failed to update category status" });
    }
};

// PATCH: Update category sort order (Admin only)
const updateCategoryOrder = async (req, res) => {
    try {
        const { categories } = req.body; // Array of {id, sortOrder}

        const updatePromises = categories.map(({ id, sortOrder }) =>
            Category.findByIdAndUpdate(id, { sortOrder, updatedAt: new Date() })
        );

        await Promise.all(updatePromises);

        res.status(200).json({
            success: true,
            message: "Category order updated successfully"
        });
    } catch (error) {
        console.error("Error updating category order:", error);
        res.status(500).json({ success: false, error: "Failed to update category order" });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    updateCategoryOrder
};
