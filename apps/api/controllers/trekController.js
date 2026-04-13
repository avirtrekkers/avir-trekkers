const mongoose = require("mongoose");
const Trek = require("../Models/TrekModel");
const Enrollment = require("../Models/EnrollmentModel");

/**
 * Normalize itinerary to new format: { day, dayTitle, activities: [{ time, title, description }] }.
 * Converts legacy format (title, description, activities: [String]) for API responses.
 */
function normalizeItinerary(itinerary) {
    if (!itinerary || !Array.isArray(itinerary)) return [];
    return itinerary.map((day) => {
        const dayTitle = day.dayTitle || day.title || `Day ${day.day}`;
        let activities = [];
        if (day.activities && day.activities.length > 0) {
            day.activities.forEach((act) => {
                if (typeof act === "string") {
                    activities.push({ time: "", title: act, description: "" });
                } else if (act && typeof act === "object") {
                    activities.push({
                        time: act.time || "",
                        title: act.title || "",
                        description: act.description || ""
                    });
                }
            });
        }
        if (day.description && activities.length === 0) {
            activities.push({ time: "", title: "Overview", description: day.description });
        } else if (day.description && activities.length > 0 && !activities[0].description) {
            activities[0].description = day.description;
        }
        return { day: day.day, dayTitle, activities };
    });
}

function applyItineraryNormalization(trek) {
    if (trek && trek.itinerary) {
        trek.itinerary = normalizeItinerary(trek.itinerary);
    }
    return trek;
}

// GET: Get all treks with filtering and pagination
const getAllTreks = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status = "Upcoming",
            difficulty,
            location,
            category,
            featured,
            search,
            sortBy = "startDate",
            sortOrder = "asc"
        } = req.query;

        // Build filter object
        const filter = { isActive: true };
        
        // Always filter for future treks (start date >= today)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        filter.startDate = { $gte: today };
        
        if (status) filter.status = status;
        if (difficulty) filter.difficulty = difficulty;
        if (location) filter.location = new RegExp(location, 'i');
        if (featured === 'true') filter.isFeatured = true;
        
        if (category) {
            // Check if category is a valid ObjectId, if not, treat it as a name
            let categoryId = category;
            if (!mongoose.Types.ObjectId.isValid(category)) {
                // Find category by name
                const Category = require("../Models/CategoryModel");
                const categoryDoc = await Category.findOne({ 
                    name: category, 
                    isActive: true 
                });
                
                if (categoryDoc) {
                    categoryId = categoryDoc._id;
                }
            }
            filter.category = categoryId;
        }
        
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { location: new RegExp(search, 'i') }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const treks = await Trek.find(filter)
            .populate('createdBy', 'fullName email')
            .populate('category', 'name description icon color')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Trek.countDocuments(filter);

        // Calculate availability for each trek
        const treksWithAvailability = await Promise.all(
            treks.map(async (trek) => {
                const enrollmentCount = await Enrollment.countDocuments({ 
                    trek: trek._id, 
                    enrollmentStatus: { $in: ["Confirmed", "Pending"] } 
                });
                
                const now = new Date();
                const isAvailableForRegistration = trek.status === 'Upcoming' && 
                                                 trek.isActive && 
                                                 trek.registrationDeadline > now && 
                                                 enrollmentCount < trek.maxParticipants;
                const isFull = enrollmentCount >= trek.maxParticipants;
                
                return applyItineraryNormalization({
                    ...trek,
                    currentParticipants: enrollmentCount,
                    isAvailableForRegistration,
                    isFull
                });
            })
        );

        res.status(200).json({
            success: true,
            data: treksWithAvailability,
            pagination: {
                current: parseInt(page),
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error("Error fetching treks:", error);
        res.status(500).json({ success: false, error: "Failed to fetch treks" });
    }
};

// GET: Get featured treks
const getFeaturedTreks = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const treks = await Trek.find({ 
            isFeatured: true, 
            isActive: true, 
            status: "Upcoming",
            startDate: { $gte: today }
        })
        .populate('createdBy', 'fullName email')
        .populate('category', 'name description icon color')
        .sort({ startDate: 1 })
        .limit(6)
        .lean();

        // Calculate availability for each trek
        const treksWithAvailability = await Promise.all(
            treks.map(async (trek) => {
                const enrollmentCount = await Enrollment.countDocuments({ 
                    trek: trek._id, 
                    enrollmentStatus: { $in: ["Confirmed", "Pending"] } 
                });
                
                const now = new Date();
                const isAvailableForRegistration = trek.status === 'Upcoming' && 
                                                 trek.isActive && 
                                                 trek.registrationDeadline > now && 
                                                 enrollmentCount < trek.maxParticipants;
                const isFull = enrollmentCount >= trek.maxParticipants;
                
                return applyItineraryNormalization({
                    ...trek,
                    currentParticipants: enrollmentCount,
                    isAvailableForRegistration,
                    isFull
                });
            })
        );

        res.status(200).json({
            success: true,
            data: treksWithAvailability
        });
    } catch (error) {
        console.error("Error fetching featured treks:", error);
        res.status(500).json({ success: false, error: "Failed to fetch featured treks" });
    }
};

// GET: Get single trek by ID
const getTrekById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const trek = await Trek.findById(id)
            .populate('createdBy', 'fullName email')
            .populate('category', 'name description icon color')
            .lean();

        if (!trek) {
            return res.status(404).json({ 
                success: false, 
                error: "Trek not found" 
            });
        }

        // Get enrollment count for this trek
        const enrollmentCount = await Enrollment.countDocuments({ 
            trek: id, 
            enrollmentStatus: { $in: ["Confirmed", "Pending"] } 
        });

        // Calculate availability
        const now = new Date();
        const isAvailableForRegistration = trek.status === 'Upcoming' && 
                                         trek.isActive && 
                                         trek.registrationDeadline > now && 
                                         enrollmentCount < trek.maxParticipants;
        const isFull = enrollmentCount >= trek.maxParticipants;

        res.status(200).json({
            success: true,
            data: applyItineraryNormalization({
                ...trek,
                currentParticipants: enrollmentCount,
                isAvailableForRegistration,
                isFull
            })
        });
    } catch (error) {
        console.error("Error fetching trek:", error);
        res.status(500).json({ success: false, error: "Failed to fetch trek" });
    }
};

/**
 * Sanitize itinerary for storage: ensure { day, dayTitle, activities: [{ time, title, description }] }.
 * Accepts legacy shape and converts to new format before saving.
 */
function sanitizeItineraryForSave(itinerary) {
    if (!itinerary || !Array.isArray(itinerary)) return [];
    return itinerary.map((day) => {
        const dayNum = typeof day.day === "number" ? day.day : parseInt(day.day, 10) || 1;
        const dayTitle = day.dayTitle || day.title || `Day ${dayNum}`;
        const activities = [];
        if (day.activities && day.activities.length > 0) {
            day.activities.forEach((act) => {
                if (typeof act === "string") {
                    activities.push({ time: "", title: act.trim(), description: "" });
                } else if (act && typeof act === "object") {
                    activities.push({
                        time: (act.time || "").toString().trim(),
                        title: (act.title || "").toString().trim(),
                        description: (act.description || "").toString().trim()
                    });
                }
            });
        }
        if (day.description && activities.length === 0) {
            activities.push({ time: "", title: "Overview", description: day.description });
        }
        return { day: dayNum, dayTitle, activities };
    });
}

// POST: Create new trek (Admin only)
const createTrek = async (req, res) => {
    try {
        const body = { ...req.body };

        /* ---------- SANITIZE ITINERARY ---------- */
        if (body.itinerary) {
            body.itinerary = sanitizeItineraryForSave(body.itinerary);
        }

        /* ---------- TYPE SAFETY ---------- */
        if (body.height) {
            body.height = Number(body.height);
        }

        if (body.maxParticipants) {
            body.maxParticipants = Number(body.maxParticipants);
        }

        if (body.price) {
            body.price = Number(body.price);
        }

        /* ---------- DATE CONVERSION ---------- */
        if (body.startDate) body.startDate = new Date(body.startDate);
        if (body.endDate) body.endDate = new Date(body.endDate);
        if (body.registrationDeadline) body.registrationDeadline = new Date(body.registrationDeadline);

        const trekData = {
            ...body,
            createdBy: req.user.userId
        };

        const trek = await Trek.create(trekData);

        const populatedTrek = await Trek.findById(trek._id)
            .populate('createdBy', 'fullName email');

        res.status(201).json({
            success: true,
            message: "Trek created successfully",
            data: populatedTrek
        });

    } catch (error) {
        console.error("Error creating trek:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// PUT: Update trek (Admin only)
const updateTrek = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };
        if (updateData.itinerary) {
            updateData.itinerary = sanitizeItineraryForSave(updateData.itinerary);
        }

        const trek = await Trek.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true, lean: true }
        ).populate('createdBy', 'fullName email');

        if (!trek) {
            return res.status(404).json({
                success: false,
                error: "Trek not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Trek updated successfully",
            data: applyItineraryNormalization(trek)
        });
    } catch (error) {
        console.error("Error updating trek:", error);
        res.status(500).json({ success: false, error: "Failed to update trek" });
    }
};

// DELETE: Delete trek (Admin only)
const deleteTrek = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if there are any enrollments
        const enrollmentCount = await Enrollment.countDocuments({ trek: id });
        
        if (enrollmentCount > 0) {
            return res.status(400).json({
                success: false,
                error: "Cannot delete trek with existing enrollments. Consider deactivating instead."
            });
        }

        const trek = await Trek.findByIdAndDelete(id);

        if (!trek) {
            return res.status(404).json({ 
                success: false, 
                error: "Trek not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Trek deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting trek:", error);
        res.status(500).json({ success: false, error: "Failed to delete trek" });
    }
};

// PATCH: Toggle trek status (Admin only)
const toggleTrekStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, isActive } = req.body;

        const updateData = {};
        if (status !== undefined) updateData.status = status;
        if (isActive !== undefined) updateData.isActive = isActive;

        const trek = await Trek.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate('createdBy', 'fullName email');

        if (!trek) {
            return res.status(404).json({ 
                success: false, 
                error: "Trek not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Trek status updated successfully",
            data: trek
        });
    } catch (error) {
        console.error("Error updating trek status:", error);
        res.status(500).json({ success: false, error: "Failed to update trek status" });
    }
};

// GET: Get trek statistics (Admin only)
const getTrekStats = async (req, res) => {
    try {
        const stats = await Trek.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                    totalParticipants: { $sum: "$currentParticipants" }
                }
            }
        ]);

        const totalTreks = await Trek.countDocuments();
        const activeTreks = await Trek.countDocuments({ isActive: true });
        const featuredTreks = await Trek.countDocuments({ isFeatured: true });

        res.status(200).json({
            success: true,
            data: {
                totalTreks,
                activeTreks,
                featuredTreks,
                statusBreakdown: stats
            }
        });
    } catch (error) {
        console.error("Error fetching trek stats:", error);
        res.status(500).json({ success: false, error: "Failed to fetch trek statistics" });
    }
};

// GET: Get treks by category
const getTreksByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 6 } = req.query;

        // Check if category is a valid ObjectId, if not, treat it as a name
        let categoryId = category;
        if (!mongoose.Types.ObjectId.isValid(category)) {
            // Find category by name
            const Category = require("../Models/CategoryModel");
            const categoryDoc = await Category.findOne({ 
                name: category, 
                isActive: true 
            });

            if (!categoryDoc) {
                return res.status(404).json({
                    success: false,
                    error: "Category not found"
                });
            }
            categoryId = categoryDoc._id;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const treks = await Trek.find({ 
            category: categoryId,
            isActive: true, 
            status: "Upcoming",
            startDate: { $gte: today }
        })
        .populate('createdBy', 'fullName email')
        .populate('category', 'name description icon color')
        .sort({ startDate: 1 })
        .limit(parseInt(limit))
        .lean();

        // Calculate availability for each trek
        const treksWithAvailability = await Promise.all(
            treks.map(async (trek) => {
                const enrollmentCount = await Enrollment.countDocuments({ 
                    trek: trek._id, 
                    enrollmentStatus: { $in: ["Confirmed", "Pending"] } 
                });
                
                const now = new Date();
                const isAvailableForRegistration = trek.status === 'Upcoming' && 
                                                 trek.isActive && 
                                                 trek.registrationDeadline > now && 
                                                 enrollmentCount < trek.maxParticipants;
                const isFull = enrollmentCount >= trek.maxParticipants;
                
                return applyItineraryNormalization({
                    ...trek,
                    currentParticipants: enrollmentCount,
                    isAvailableForRegistration,
                    isFull
                });
            })
        );

        res.status(200).json({
            success: true,
            data: treksWithAvailability
        });
    } catch (error) {
        console.error("Error fetching treks by category:", error);
        res.status(500).json({ success: false, error: "Failed to fetch treks by category" });
    }
};

// GET: Get all categories with trek counts
const getCategories = async (req, res) => {
    try {
        const Category = require("../Models/CategoryModel");
        
        const categories = await Category.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: "treks",
                    localField: "_id",
                    foreignField: "category",
                    as: "treks"
                }
            },
            {
                $addFields: {
                    count: { $size: "$treks" }
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    icon: 1,
                    color: 1,
                    count: 1,
                    sortOrder: 1
                }
            },
            { $sort: { sortOrder: 1, createdAt: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ success: false, error: "Failed to fetch categories" });
    }
};

// GET: Get treks grouped by category
const getTreksByCategoryGroup = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        // Get all active upcoming treks with category data
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const treks = await Trek.find({ 
            isActive: true, 
            status: "Upcoming",
            startDate: { $gte: today }
        })
        .populate('createdBy', 'fullName email')
        .populate('category', 'name description icon color')
        .sort({ startDate: 1 })
        .lean();

        // Calculate availability for each trek
        const treksWithAvailability = await Promise.all(
            treks.map(async (trek) => {
                const enrollmentCount = await Enrollment.countDocuments({ 
                    trek: trek._id, 
                    enrollmentStatus: { $in: ["Confirmed", "Pending"] } 
                });
                
                const now = new Date();
                const isAvailableForRegistration = trek.status === 'Upcoming' && 
                                                 trek.isActive && 
                                                 trek.registrationDeadline > now && 
                                                 enrollmentCount < trek.maxParticipants;
                const isFull = enrollmentCount >= trek.maxParticipants;
                
                return {
                    ...trek,
                    currentParticipants: enrollmentCount,
                    isAvailableForRegistration,
                    isFull
                };
            })
        );

        // Group treks by category
        const treksByCategory = {};
        treksWithAvailability.forEach(trek => {
            if (trek.category) {
                const categoryId = trek.category._id.toString();
                if (!treksByCategory[categoryId]) {
                    treksByCategory[categoryId] = {
                        category: trek.category,
                        treks: []
                    };
                }
                treksByCategory[categoryId].treks.push(trek);
            }
        });

        // Limit treks per category and sort categories; normalize itinerary for each trek
        Object.keys(treksByCategory).forEach(categoryId => {
            treksByCategory[categoryId].treks = treksByCategory[categoryId].treks
                .map(t => applyItineraryNormalization(t))
                .slice(0, parseInt(limit))
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        });

        res.status(200).json({
            success: true,
            data: treksByCategory
        });
    } catch (error) {
        console.error("Error fetching treks by category group:", error);
        res.status(500).json({ success: false, error: "Failed to fetch treks by category group" });
    }
};

// GET: Get all treks for admin (including past/completed treks) - for gallery management
const getAllTreksForAdmin = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 1000,
            status,
            difficulty,
            location,
            category,
            search,
            sortBy = "startDate",
            sortOrder = "desc"
        } = req.query;

        // Build filter object - no date restriction for admin
        const filter = {};
        
        if (status) filter.status = status;
        if (difficulty) filter.difficulty = difficulty;
        if (location) filter.location = new RegExp(location, 'i');
        
        if (category) {
            let categoryId = category;
            if (!mongoose.Types.ObjectId.isValid(category)) {
                const Category = require("../Models/CategoryModel");
                const categoryDoc = await Category.findOne({ 
                    name: category, 
                    isActive: true 
                });
                
                if (categoryDoc) {
                    categoryId = categoryDoc._id;
                }
            }
            filter.category = categoryId;
        }
        
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { location: new RegExp(search, 'i') }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const treks = await Trek.find(filter)
            .populate('createdBy', 'fullName email')
            .populate('category', 'name description icon color')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Trek.countDocuments(filter);
        const treksNormalized = treks.map(t => applyItineraryNormalization(t));

        res.status(200).json({
            success: true,
            data: treksNormalized,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error fetching all treks for admin:", error);
        res.status(500).json({ success: false, error: "Failed to fetch treks" });
    }
};

module.exports = {
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
};
