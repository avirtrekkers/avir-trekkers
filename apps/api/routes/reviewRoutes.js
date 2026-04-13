const express = require('express');
const router = express.Router();
const {
  getApprovedReviews,
  submitReview,
  getReviewsForAdmin,
  updateReviewStatus,
  deleteReview,
  getReviewStats
} = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/public', getApprovedReviews);
router.post('/submit', submitReview);
router.get('/stats', getReviewStats);

// Admin routes (protected)
router.get('/admin', authMiddleware, getReviewsForAdmin);
router.put('/admin/:reviewId/status', authMiddleware, updateReviewStatus);
router.delete('/admin/:reviewId', authMiddleware, deleteReview);

module.exports = router;
