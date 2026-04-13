const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    icon: {
        type: String,
        required: true,
        default: "🏔️"
    },
    color: {
        type: String,
        required: true,
        default: "sahyadri"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    sortOrder: {
        type: Number,
        default: 0
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
categorySchema.index({ isActive: 1, sortOrder: 1 });
// Note: No need for explicit index on 'name' field as 'unique: true' already creates an index

module.exports = mongoose.model("Category", categorySchema);
