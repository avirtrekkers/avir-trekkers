const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RegistrationForm = require("../Models/AdminModels/RegistrationModel");
const JWT_SECRET = process.env.JWT_SECRET;

const registration = async (req, res) => {
    try {
        const { fullName, role, email, password } = req.body;
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
        // Create a new user with hashed password
        const newUser = new RegistrationForm({
            fullName,
            role,
            email,
            password: hashedPassword
        });
        // Save the user to the database
        await newUser.save();
        // Remove password before sending response
        const { password: pw, ...userWithoutPassword } = newUser._doc;

        res.status(201).json({
            message: "Registration successful",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ error: "Failed to register" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 1. Check if the user exists
        const user = await RegistrationForm.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // 2. Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // 3. Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // payload
            JWT_SECRET,                            // secret key
            { expiresIn: "24h" }                     // token expiry
        );
        // 4. Remove password before sending response
        const { password: pw, ...userWithoutPassword } = user._doc;
        // 5. Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error("Unable to login:", error);
        res.status(500).json({ error: "Server error during login" });
    }
};
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current password and new password are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ error: "New password must be at least 6 characters" });
        }
        const userId = req.user?.userId;
        const user = await RegistrationForm.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Failed to change password" });
    }
};

module.exports = { registration, login, changePassword };
