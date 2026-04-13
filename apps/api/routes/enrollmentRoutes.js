const express = require("express");
const router = express.Router();
const {
    sendOtp,
    verifyOtp,
    enrollInTrek,
    getUserEnrollments,
    getEnrollmentById,
    updateEnrollment,
    cancelEnrollment,
    getTrekEnrollments,
    getEnrollmentStats,
    getAllEnrollments
} = require("../controllers/enrollmentController");
const authMiddleware = require("../middleware/authMiddleware");
const { optionalAuth } = require("../middleware/authMiddleware");

// OTP verification (public, no auth)
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Enroll in trek (no login required; requires OTP verification token for guests; optional auth for logged-in users)
router.post("/", optionalAuth, enrollInTrek);
router.get("/my-enrollments", authMiddleware, getUserEnrollments);
router.get("/:id", authMiddleware, getEnrollmentById);
router.delete("/:id/cancel", authMiddleware, cancelEnrollment);

// Admin routes (authentication required)
router.put("/:id", authMiddleware, updateEnrollment);
router.get("/trek/:trekId", authMiddleware, getTrekEnrollments);
router.get("/admin/stats", authMiddleware, getEnrollmentStats);
router.get("/admin/all", authMiddleware, getAllEnrollments);

module.exports = router;
