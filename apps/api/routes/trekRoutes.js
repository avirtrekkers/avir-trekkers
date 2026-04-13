const express = require("express");
const router = express.Router();
const {
    getAllTreks,
    getFeaturedTreks,
    getTreksByCategory,
    getTreksByCategoryGroup,
    getCategories,
    getTrekById,
    createTrek,
    updateTrek,
    deleteTrek,
    toggleTrekStatus,
    getTrekStats,
    getAllTreksForAdmin
} = require("../controllers/trekController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes (no authentication required)
router.get("/", getAllTreks);
router.get("/featured", getFeaturedTreks);
router.get("/categories", getCategories);
router.get("/category-group", getTreksByCategoryGroup);
router.get("/category/:category", getTreksByCategory);
router.get("/:id", getTrekById);

// Admin routes (authentication required)
router.post("/", authMiddleware, createTrek);
router.put("/:id", authMiddleware, updateTrek);
router.delete("/:id", authMiddleware, deleteTrek);
router.patch("/:id/status", authMiddleware, toggleTrekStatus);
router.get("/admin/stats", authMiddleware, getTrekStats);
router.get("/admin/all", authMiddleware, getAllTreksForAdmin);

module.exports = router;
