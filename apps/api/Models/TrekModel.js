const mongoose = require("mongoose");

const trekSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: 200
    },
    location: {
        type: String,
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    difficulty: {
        type: String,
        enum: ["Easy", "Moderate", "Hard", "Expert"],
        required: true
    },

    /* ----------- NEW FIELDS (TREK DETAILS) ----------- */

    height: {
        type: Number, // in meters
        required: true
    },

    grade: {
        type: String, // ex: T1, T2, T3, F, PD
        required: true,
        trim: true
    },

    range: {
        type: String, // Sahyadri / Himalaya
        required: true,
        trim: true
    },

    route: {
        type: String, // Pachnai Route
        required: true,
        trim: true
    }, 

    base: {
        type: String, // Base village
        required: true,
        trim: true
    },

    /* ----------------------------------------------- */

    duration: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    registrationDeadline: {
        type: Date,
        required: true
    },

    maxParticipants: {
        type: Number,
        required: true,
        min: 1
    },

    currentParticipants: {
        type: Number,
        default: 0,
        min: 0
    },

    images: [{
        type: String,
        required: true
    }],

    itinerary: [{
        day: { type: Number, required: true },
        dayTitle: { type: String },
        title: { type: String },
        description: { type: String },
        activities: [{
            type: mongoose.Schema.Types.Mixed
        }]
    }],

    inclusions: [String],
    exclusions: [String],
    requirements: [String],
    pickupPoints: [String],

    status: {
        type: String,
        enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
        default: "Upcoming"
    },

    isFeatured: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegistrationForm",
        required: true
    }

}, { timestamps: true });

trekSchema.index({ startDate: 1, status: 1 });
trekSchema.index({ isFeatured: 1, isActive: 1 });
trekSchema.index({ location: 1 });
trekSchema.index({ difficulty: 1 });
trekSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Trek", trekSchema);