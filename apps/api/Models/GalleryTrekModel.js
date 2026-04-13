const mongoose = require("mongoose");

const galleryTrekSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: ""
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    difficulty: {
        type: String,
        enum: ["Easy", "Moderate", "Hard", "Extreme"],
        default: "Moderate"
    },
    duration: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RegistrationForm",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better query performance
galleryTrekSchema.index({ isActive: 1, date: -1 });
galleryTrekSchema.index({ location: 1 });

module.exports = mongoose.model("GalleryTrek", galleryTrekSchema);
