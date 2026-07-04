const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { uploadImages } = require("../middleware/uploadMiddleware");
const { uploadMediaImages, deleteMediaImage } = require("../controllers/mediaController");

// Uploads consume Cloudinary credits — keep a tighter lid than the global limiter.
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { success: false, message: "Too many upload requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin-only: media management
router.post("/images", authMiddleware, uploadLimiter, uploadImages, uploadMediaImages);
router.delete("/images", authMiddleware, deleteMediaImage);

module.exports = router;
