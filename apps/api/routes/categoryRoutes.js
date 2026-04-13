const express = require("express");
const router = express.Router();
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    updateCategoryOrder
} = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes (no authentication required)
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Admin routes (authentication required)
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);
router.patch("/:id/status", authMiddleware, toggleCategoryStatus);
router.patch("/order", authMiddleware, updateCategoryOrder);

module.exports = router;
