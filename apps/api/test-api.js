const axios = require('axios');

// Test data for review submission
const testReview = {
  customerName: "Test User",
  customerEmail: "test@example.com",
  customerLocation: "Test City, Test State",
  trekId: "68d7da89f906c51f4deaa3e6", // Use an existing trek ID
  rating: 5,
  reviewText: "This is a test review to verify the API is working correctly. Great experience!"
};

// Test the review submission API
async function testReviewSubmission() {
  try {
    console.log('🧪 Testing Review Submission API...');
    
    const response = await axios.post('http://localhost:4000/api/reviews/submit', testReview);
    
    console.log('✅ Review submission successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Review submission failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Test getting reviews
async function testGetReviews() {
  try {
    console.log('\n🧪 Testing Get Reviews API...');
    
    const response = await axios.get('http://localhost:4000/api/reviews/public?limit=5');
    
    console.log('✅ Get reviews successful!');
    console.log(`Found ${response.data.data.length} reviews`);
    console.log('Sample review:', response.data.data[0]);
    
  } catch (error) {
    console.log('❌ Get reviews failed:');
    console.log('Error:', error.message);
  }
}

// Test getting stats
async function testGetStats() {
  try {
    console.log('\n🧪 Testing Get Stats API...');
    
    const response = await axios.get('http://localhost:4000/api/reviews/stats');
    
    console.log('✅ Get stats successful!');
    console.log('Stats:', response.data.data);
    
  } catch (error) {
    console.log('❌ Get stats failed:');
    console.log('Error:', error.message);
  }
}

// Run all tests
async function runTests() {
  await testGetStats();
  await testGetReviews();
  await testReviewSubmission();
  
  console.log('\n🎉 All API tests completed!');
}

runTests().catch(console.error);
