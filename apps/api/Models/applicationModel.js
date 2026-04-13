const mongoose = require("mongoose");

const applicationFormSchema = new mongoose.Schema({
    trekName:{
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
    },
    bloodGroup: {
        type: String,
        // enum: ["A+", "B+", "O+"],
        required: true,
    },
   
    address: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    pickupPoint: {
        type: String,
        // enum: ["Pimpri", "Akurdi", "Nigdi"],
        required: true,
    },
    foodPreference: {
        type: String,
        enum: ["Veg", "Non-veg"],
        required: true,
    },
    medicalCondition: {
        type: String,
        enum: ["Yes", "No"],
        required: true,
    },
    medicalConditionDetails: {
        type: String,
        required: true,
    },
    // currentMedication: {
    //     type: String,
    //     enum: ["Yes", "No"],
    //     required: true,
    // },
    emergencyName: {
        type: String,
        required: true,
    },
    emerContactNumber: {
        type: String,
        required: true,
    },
    emergencyRelation: {
        type: String,
        required: true,
    },
    isPaid: {
        type: String,
        required: true,
    }
});

// If you want to allow multiple applications in a single submission
const multiFormSchema = new mongoose.Schema({
    applications: [applicationFormSchema], // array of applications
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ApplicationForm", multiFormSchema);
