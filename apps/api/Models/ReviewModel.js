const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  customerLocation: {
    type: String,
    required: [true, 'Customer location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  trekId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trek',
    required: [true, 'Trek ID is required']
  },
  trekName: {
    type: String,
    required: [true, 'Trek name is required'],
    trim: true,
    maxlength: [200, 'Trek name cannot exceed 200 characters']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number'
    }
  },
  reviewText: {
    type: String,
    required: [true, 'Review text is required'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters long'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  customerAvatar: {
    type: String,
    default: null
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  approvedDate: {
    type: Date,
    default: null
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for better query performance
reviewSchema.index({ trekId: 1, isApproved: 1 });
reviewSchema.index({ isApproved: 1, isFeatured: 1 });
reviewSchema.index({ submissionDate: -1 });

// Virtual for formatted submission date
reviewSchema.virtual('formattedSubmissionDate').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.submissionDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
});

// Method to get public review data (without sensitive info)
reviewSchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    customerName: this.customerName,
    customerLocation: this.customerLocation,
    trekName: this.trekName,
    rating: this.rating,
    reviewText: this.reviewText,
    customerAvatar: this.customerAvatar,
    submissionDate: this.submissionDate,
    formattedSubmissionDate: this.formattedSubmissionDate
  };
};

module.exports = mongoose.model('Review', reviewSchema);
