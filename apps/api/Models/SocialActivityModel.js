const mongoose = require("mongoose");

const socialActivitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
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
    category: {
        type: String,
        enum: ["Education", "Environment", "Relief", "Conservation", "Other"],
        default: "Other"
    },
    date: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        default: ""
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
socialActivitySchema.index({ isActive: 1, category: 1 });
socialActivitySchema.index({ date: -1 });

module.exports = mongoose.model("SocialActivity", socialActivitySchema);
