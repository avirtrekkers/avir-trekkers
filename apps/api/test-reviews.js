const mongoose = require('mongoose');
const Review = require('./Models/ReviewModel');
const Trek = require('./Models/TrekModel');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample reviews data
const sampleReviews = [
  {
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@email.com",
    customerLocation: "Mumbai, Maharashtra",
    trekName: "Himalayan Base Camp Trek",
    rating: 5,
    reviewText: "Absolutely incredible experience! The Himalayan Base Camp trek was challenging but the views were breathtaking. Our guide was knowledgeable and the group was amazing. Highly recommend for anyone looking for an adventure of a lifetime.",
    customerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
    isApproved: true,
    isFeatured: true
  },
  {
    customerName: "Arjun Patel",
    customerEmail: "arjun.patel@email.com",
    customerLocation: "Bangalore, Karnataka",
    trekName: "Western Ghats Monsoon Trek",
    rating: 5,
    reviewText: "The monsoon trek through Western Ghats was magical! The lush greenery, waterfalls, and misty mountains created an unforgettable experience. Perfect for nature lovers and photography enthusiasts.",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    isApproved: true,
    isFeatured: true
  },
  {
    customerName: "Sneha Reddy",
    customerEmail: "sneha.reddy@email.com",
    customerLocation: "Hyderabad, Telangana",
    trekName: "Kerala Backwaters Trek",
    rating: 4,
    reviewText: "A unique trekking experience through Kerala's backwaters. The combination of water bodies and forest trails was refreshing. Great for beginners and those who want a different kind of adventure.",
    customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    isApproved: true,
    isFeatured: false
  },
  {
    customerName: "Rahul Singh",
    customerEmail: "rahul.singh@email.com",
    customerLocation: "Delhi, NCR",
    trekName: "Ladakh High Altitude Trek",
    rating: 5,
    reviewText: "Challenging but absolutely rewarding! The high altitude trek in Ladakh tested our limits but the panoramic views of snow-capped peaks were worth every step. Professional team and excellent safety measures.",
    customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    isApproved: true,
    isFeatured: true
  },
  {
    customerName: "Meera Joshi",
    customerEmail: "meera.joshi@email.com",
    customerLocation: "Pune, Maharashtra",
    trekName: "Sahyadri Weekend Trek",
    rating: 5,
    reviewText: "Perfect weekend getaway! The Sahyadri trek was well-organized with beautiful fort views and great company. Ideal for working professionals who want to escape city life for a day.",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    isApproved: true,
    isFeatured: false
  },
  {
    customerName: "Vikram Kumar",
    customerEmail: "vikram.kumar@email.com",
    customerLocation: "Chennai, Tamil Nadu",
    trekName: "Nilgiri Hills Trek",
    rating: 4,
    reviewText: "Beautiful trek through tea plantations and misty hills. The Nilgiri Hills offered stunning landscapes and peaceful moments. Great for those seeking tranquility and natural beauty.",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    isApproved: true,
    isFeatured: false
  },
  {
    customerName: "Anita Desai",
    customerEmail: "anita.desai@email.com",
    customerLocation: "Ahmedabad, Gujarat",
    trekName: "Rajasthan Desert Trek",
    rating: 4,
    reviewText: "Unique desert trekking experience! The sand dunes and camel rides were amazing. The night sky was incredible. Good for those who want to try something different from mountain treks.",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    isApproved: false, // Pending approval
    isFeatured: false
  },
  {
    customerName: "Rajesh Gupta",
    customerEmail: "rajesh.gupta@email.com",
    customerLocation: "Kolkata, West Bengal",
    trekName: "Darjeeling Tea Garden Trek",
    rating: 5,
    reviewText: "Amazing trek through tea gardens with stunning mountain views. The local culture and hospitality were wonderful. Perfect blend of adventure and cultural experience.",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    isApproved: false, // Pending approval
    isFeatured: false
  }
];

// Function to add sample reviews
const addSampleReviews = async () => {
  try {
    console.log('Adding sample reviews...');
    
    // First, get some existing treks to associate reviews with
    const treks = await Trek.find().limit(5);
    if (treks.length === 0) {
      console.log('No treks found in database. Please add some treks first.');
      return;
    }
    
    console.log(`Found ${treks.length} treks in database`);
    
    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Cleared existing reviews');
    
    // Add sample reviews
    for (let i = 0; i < sampleReviews.length; i++) {
      const reviewData = sampleReviews[i];
      const trek = treks[i % treks.length]; // Cycle through available treks
      
      const review = new Review({
        customerName: reviewData.customerName,
        customerEmail: reviewData.customerEmail,
        customerLocation: reviewData.customerLocation,
        trekId: trek._id,
        trekName: trek.name || reviewData.trekName, // Use trek name from database or fallback
        rating: reviewData.rating,
        reviewText: reviewData.reviewText,
        customerAvatar: reviewData.customerAvatar,
        isApproved: reviewData.isApproved,
        isFeatured: reviewData.isFeatured,
        submissionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
      });
      
      await review.save();
      console.log(`Added review ${i + 1}: ${reviewData.customerName} - ${reviewData.trekName}`);
    }
    
    console.log(`Successfully added ${sampleReviews.length} sample reviews!`);
    
    // Display summary
    const totalReviews = await Review.countDocuments();
    const approvedReviews = await Review.countDocuments({ isApproved: true });
    const pendingReviews = await Review.countDocuments({ isApproved: false });
    const featuredReviews = await Review.countDocuments({ isFeatured: true });
    
    console.log('\n📊 Review Summary:');
    console.log(`Total Reviews: ${totalReviews}`);
    console.log(`Approved Reviews: ${approvedReviews}`);
    console.log(`Pending Reviews: ${pendingReviews}`);
    console.log(`Featured Reviews: ${featuredReviews}`);
    
  } catch (error) {
    console.error('Error adding sample reviews:', error);
  }
};

// Function to test API endpoints
const testAPIEndpoints = async () => {
  console.log('\n🧪 Testing API Endpoints...');
  
  try {
    // Test getting reviews
    const reviews = await Review.find({ isApproved: true }).limit(3);
    console.log(`✅ Found ${reviews.length} approved reviews`);
    
    // Test getting stats
    const totalReviews = await Review.countDocuments();
    const approvedReviews = await Review.countDocuments({ isApproved: true });
    const pendingReviews = await Review.countDocuments({ isApproved: false });
    const featuredReviews = await Review.countDocuments({ isFeatured: true });
    
    console.log('✅ Review Statistics:');
    console.log(`   Total: ${totalReviews}`);
    console.log(`   Approved: ${approvedReviews}`);
    console.log(`   Pending: ${pendingReviews}`);
    console.log(`   Featured: ${featuredReviews}`);
    
    // Test average rating calculation
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
    
    if (ratingStats.length > 0) {
      console.log(`✅ Average Rating: ${Math.round(ratingStats[0].averageRating * 10) / 10}/5`);
      console.log(`✅ Total Ratings: ${ratingStats[0].totalRatings}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing API endpoints:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await addSampleReviews();
  await testAPIEndpoints();
  
  console.log('\n🎉 Sample data setup complete!');
  console.log('\n📡 Available API Endpoints:');
  console.log('GET  /api/reviews/public - Get approved reviews');
  console.log('POST /api/reviews/submit - Submit new review');
  console.log('GET  /api/reviews/stats - Get review statistics');
  console.log('GET  /api/reviews/admin - Get all reviews (admin)');
  console.log('PUT  /api/reviews/admin/:id/status - Update review status (admin)');
  console.log('DELETE /api/reviews/admin/:id - Delete review (admin)');
  
  process.exit(0);
};

// Run the script
main().catch(console.error);
