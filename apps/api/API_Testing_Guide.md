# Avirr Trekkers API Testing Guide

## 📋 Postman Collection Overview

This comprehensive Postman collection includes all the APIs for the Avirr Trekkers platform, organized into logical folders for easy testing and management.

## 🚀 Quick Start

### 1. Import the Collection
1. Open Postman
2. Click "Import" button
3. Select the `Avirr_Trekkers_API_Collection.postman_collection.json` file
4. The collection will be imported with all requests organized in folders

### 2. Set Up Environment Variables
The collection uses these variables (automatically set during testing):
- `baseUrl`: http://localhost:4000
- `authToken`: JWT token (set automatically after login)
- `userId`: User ID (set automatically after login)
- `trekId`: Trek ID (set automatically when creating/viewing treks)
- `categoryId`: Category ID (set automatically when creating/viewing categories)
- `enrollmentId`: Enrollment ID (set automatically when enrolling)
- `reviewId`: Review ID (set automatically when submitting reviews)

## 📁 Collection Structure

### 1. Health Check
- **GET /health** - Check if server is running

### 2. Authentication
- **POST /api/auth/registration** - User registration
- **POST /api/auth/login** - User login
- **POST /api/auth/registration** - Admin registration
- **POST /api/auth/login** - Admin login

### 3. Application Forms
- **GET /api/auth/** - Get home page data
- **POST /api/auth/application** - Submit trek application
- **GET /api/auth/getApplication** - Get application details
- **POST /api/auth/updateApplication** - Update application status
- **POST /api/auth/deleteApplication** - Delete application

### 4. Treks
- **GET /api/treks** - Get all treks (with pagination)
- **GET /api/treks/featured** - Get featured treks
- **GET /api/treks/:id** - Get trek by ID
- **GET /api/treks/category/:category** - Get treks by category
- **GET /api/treks/category-group** - Get treks grouped by category
- **POST /api/treks** - Create trek (Admin)
- **PUT /api/treks/:id** - Update trek (Admin)
- **DELETE /api/treks/:id** - Delete trek (Admin)
- **PATCH /api/treks/:id/status** - Toggle trek status (Admin)
- **GET /api/treks/admin/stats** - Get trek stats (Admin)

### 5. Categories
- **GET /api/categories** - Get all categories
- **GET /api/categories/:id** - Get category by ID
- **POST /api/categories** - Create category (Admin)
- **PUT /api/categories/:id** - Update category (Admin)
- **DELETE /api/categories/:id** - Delete category (Admin)
- **PATCH /api/categories/:id/status** - Toggle category status (Admin)
- **PATCH /api/categories/order** - Update category order (Admin)

### 6. Enrollments
- **POST /api/enrollments** - Enroll in trek
- **GET /api/enrollments/my-enrollments** - Get user enrollments
- **GET /api/enrollments/:id** - Get enrollment by ID
- **DELETE /api/enrollments/:id/cancel** - Cancel enrollment
- **PUT /api/enrollments/:id** - Update enrollment (Admin)
- **GET /api/enrollments/trek/:trekId** - Get trek enrollments (Admin)
- **GET /api/enrollments/admin/stats** - Get enrollment stats (Admin)
- **GET /api/enrollments/admin/all** - Get all enrollments (Admin)

### 7. Reviews
- **GET /api/reviews/public** - Get approved reviews
- **GET /api/reviews/public?featured=true** - Get featured reviews
- **POST /api/reviews/submit** - Submit review
- **GET /api/reviews/stats** - Get review statistics
- **GET /api/reviews/admin** - Get all reviews (Admin)
- **PUT /api/reviews/admin/:reviewId/status** - Update review status (Admin)
- **DELETE /api/reviews/admin/:reviewId** - Delete review (Admin)

## 🔧 Testing Workflow

### Step 1: Health Check
1. Run the "Health Check" request
2. Verify server is running (should return 200 OK)

### Step 2: Authentication
1. **Register a new user:**
   - Use "User Registration" request
   - Update the JSON body with your details
   - Should return 201 Created

2. **Login as user:**
   - Use "User Login" request
   - The `authToken` and `userId` will be automatically set
   - Should return 200 OK with token

3. **Register an admin (optional):**
   - Use "Admin Registration" request
   - Update the JSON body with admin details
   - Should return 201 Created

4. **Login as admin:**
   - Use "Admin Login" request
   - The `authToken` and `userId` will be automatically set
   - Should return 200 OK with token

### Step 3: Test Public APIs
1. **Get all treks:**
   - Run "Get All Treks" request
   - Should return list of treks

2. **Get categories:**
   - Run "Get All Categories" request
   - Should return list of categories

3. **Get reviews:**
   - Run "Get Approved Reviews" request
   - Should return approved reviews

### Step 4: Test Admin APIs (requires admin token)
1. **Create a category:**
   - Run "Create Category (Admin)" request
   - Update the JSON body with category details
   - Should return 201 Created
   - `categoryId` will be automatically set

2. **Create a trek:**
   - Run "Create Trek (Admin)" request
   - Update the JSON body with trek details
   - Use the `categoryId` from previous step
   - Should return 201 Created
   - `trekId` will be automatically set

3. **Get trek stats:**
   - Run "Get Trek Stats (Admin)" request
   - Should return statistics

### Step 5: Test User APIs
1. **Enroll in trek:**
   - Run "Enroll in Trek" request
   - Update the JSON body with enrollment details
   - Use the `trekId` from previous step
   - Should return 201 Created
   - `enrollmentId` will be automatically set

2. **Get my enrollments:**
   - Run "Get My Enrollments" request
   - Should return user's enrollments

3. **Submit a review:**
   - Run "Submit Review" request
   - Update the JSON body with review details
   - Use the `trekId` from previous step
   - Should return 201 Created
   - `reviewId` will be automatically set

### Step 6: Test Admin Management APIs
1. **Update enrollment status:**
   - Run "Update Enrollment (Admin)" request
   - Update the JSON body with new status
   - Should return 200 OK

2. **Update review status:**
   - Run "Update Review Status (Admin)" request
   - Update the JSON body with approval status
   - Should return 200 OK

3. **Get all enrollments:**
   - Run "Get All Enrollments (Admin)" request
   - Should return all enrollments with pagination

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## 🔐 Authentication

### JWT Token Usage
- Tokens are automatically extracted and stored in `authToken` variable
- Admin routes require admin role in the JWT token
- User routes require valid JWT token

### Token Format
```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "user|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 🧪 Test Scenarios

### 1. Complete User Journey
1. Register → Login → Browse Treks → Enroll → Submit Review

### 2. Admin Management Flow
1. Admin Login → Create Category → Create Trek → Manage Enrollments → Manage Reviews

### 3. Error Handling
1. Test with invalid tokens
2. Test with missing required fields
3. Test with invalid IDs
4. Test unauthorized access

### 4. Edge Cases
1. Empty result sets
2. Large data sets (pagination)
3. Concurrent requests
4. Invalid JSON payloads

## 📝 Sample Data

### User Registration
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "age": 25,
  "emergencyContact": "+1234567891",
  "medicalConditions": "None",
  "previousExperience": "Beginner"
}
```

### Trek Creation
```json
{
  "name": "Himalayan Base Camp Trek",
  "description": "An amazing trek to the base camp of Mount Everest",
  "location": "Nepal",
  "duration": 14,
  "difficulty": "Hard",
  "maxParticipants": 20,
  "price": 1500,
  "category": "himalayan",
  "startDate": "2024-06-01",
  "endDate": "2024-06-14",
  "highlights": ["Mountain views", "Cultural experience", "Adventure"],
  "included": ["Guide", "Accommodation", "Meals"],
  "notIncluded": ["Personal gear", "Insurance"],
  "requirements": ["Good fitness level", "Medical certificate"],
  "isActive": true,
  "isFeatured": true
}
```

### Review Submission
```json
{
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com",
  "customerLocation": "New York, USA",
  "trekId": "trek_id_here",
  "trekName": "Himalayan Base Camp Trek",
  "rating": 5,
  "reviewText": "Amazing experience! The trek was well-organized and the views were breathtaking."
}
```

## 🚨 Common Issues

### 1. Authentication Errors
- **401 Unauthorized**: Check if token is valid and not expired
- **403 Forbidden**: Check if user has required role (admin)

### 2. Validation Errors
- **400 Bad Request**: Check required fields in request body
- **422 Unprocessable Entity**: Check data format and constraints

### 3. Not Found Errors
- **404 Not Found**: Check if resource ID exists
- Verify the resource was created successfully

### 4. Server Errors
- **500 Internal Server Error**: Check server logs
- Verify database connection
- Check environment variables

## 📈 Performance Testing

### Load Testing Scenarios
1. **Concurrent Users**: Test with multiple users enrolling simultaneously
2. **Large Data Sets**: Test pagination with large numbers of treks/reviews
3. **File Uploads**: Test image upload performance
4. **Database Queries**: Monitor query performance

### Monitoring Points
- Response times (should be < 2 seconds)
- Memory usage
- Database connection pool
- Error rates

## 🔧 Environment Setup

### Development
- Base URL: `http://localhost:4000`
- Database: MongoDB local instance
- Logs: Console output

### Production
- Base URL: `https://api.avirrtrekkers.com`
- Database: MongoDB Atlas
- Logs: File-based logging

## 📚 Additional Resources

- [Postman Documentation](https://learning.postman.com/docs/)
- [REST API Best Practices](https://restfulapi.net/)
- [JWT Token Guide](https://jwt.io/introduction/)
- [MongoDB Query Optimization](https://docs.mongodb.com/manual/core/query-optimization/)

---

**Happy Testing! 🚀**

For any issues or questions, please refer to the API documentation or contact the development team.
