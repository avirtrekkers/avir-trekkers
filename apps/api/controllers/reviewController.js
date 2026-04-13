const Review = require('../Models/ReviewModel');
const Trek = require('../Models/TrekModel');

// Get all approved reviews for public display
const getApprovedReviews = async (req, res) => {
  try {
    const { limit = 10, page = 1, trekId, featured } = req.query;
    
    const query = { isApproved: true };
    
    if (trekId) {
      query.trekId = trekId;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    const reviews = await Review.find(query)
      .populate('trekId', 'name category')
      .sort({ isFeatured: -1, submissionDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const totalReviews = await Review.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: reviews.map(review => review.getPublicData()),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews,
        hasNext: parseInt(page) * parseInt(limit) < totalReviews,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Submit a new review
const submitReview = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerLocation,
      trekId,
      trekName,
      rating,
      reviewText,
      customerAvatar
    } = req.body;
    
    // Validate required fields
    if (!customerName || !customerEmail || !customerLocation || !trekId || !rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a whole number between 1 and 5'
      });
    }
    
    // Check if trek exists
    const trek = await Trek.findById(trekId);
    if (!trek) {
      return res.status(404).json({
        success: false,
        message: 'Trek not found'
      });
    }
    
    // Check if user has already reviewed this trek
    const existingReview = await Review.findOne({
      customerEmail,
      trekId,
      isApproved: { $ne: false }
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this trek'
      });
    }
    
    // Create new review
    const review = new Review({
      customerName,
      customerEmail,
      customerLocation,
      trekId,
      trekName: trekName || trek.name,
      rating: parseInt(rating),
      reviewText,
      customerAvatar
    });
    
    await review.save();
    
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! It will be published after admin approval.',
      data: {
        reviewId: review._id,
        status: 'pending_approval'
      }
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message
    });
  }
};

// Get reviews for admin management
const getReviewsForAdmin = async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    }
    
    const reviews = await Review.find(query)
      .populate('trekId', 'name category')
      .sort({ submissionDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const totalReviews = await Review.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalReviews / parseInt(limit)),
        totalReviews,
        hasNext: parseInt(page) * parseInt(limit) < totalReviews,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reviews for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews for admin',
      error: error.message
    });
  }
};

// Approve/reject review (Admin only)
const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved, isFeatured, adminNotes } = req.body;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    const updateData = {};
    
    if (typeof isApproved === 'boolean') {
      updateData.isApproved = isApproved;
      if (isApproved) {
        updateData.approvedDate = new Date();
      }
    }
    
    if (typeof isFeatured === 'boolean') {
      updateData.isFeatured = isFeatured;
    }
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updateData,
      { new: true, runValidators: true }
    ).populate('trekId', 'name category');
    
    res.status(200).json({
      success: true,
      message: 'Review status updated successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review status',
      error: error.message
    });
  }
};

// Delete review (Admin only)
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    await Review.findByIdAndDelete(reviewId);
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// Get review statistics
const getReviewStats = async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const approvedReviews = await Review.countDocuments({ isApproved: true });
    const pendingReviews = await Review.countDocuments({ isApproved: false });
    const featuredReviews = await Review.countDocuments({ isFeatured: true });
    
    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);
    
    const averageRating = ratingStats.length > 0 ? ratingStats[0].averageRating : 0;
    
    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        approvedReviews,
        pendingReviews,
        featuredReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratingStats.length > 0 ? ratingStats[0].totalRatings : 0
      }
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review statistics',
      error: error.message
    });
  }
};

module.exports = {
  getApprovedReviews,
  submitReview,
  getReviewsForAdmin,
  updateReviewStatus,
  deleteReview,
  getReviewStats
};
