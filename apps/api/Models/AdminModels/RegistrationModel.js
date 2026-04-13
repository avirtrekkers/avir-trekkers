const mongoose = require("mongoose")

const registrationSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});
module.exports = mongoose.model("RegistrationForm", registrationSchema)