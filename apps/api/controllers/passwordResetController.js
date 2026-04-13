const bcrypt = require("bcryptjs");
const RegistrationForm = require("../Models/AdminModels/RegistrationModel");
const OTP = require("../Models/OTPModel");
const { sendEmail } = require("../utils/emailService");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Always return generic success to avoid revealing whether an account exists
    const genericResponse = {
      success: true,
      message: "If an account exists, a reset code has been sent",
    };

    const user = await RegistrationForm.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(200).json(genericResponse);
    }

    // Delete any existing password-reset OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail, purpose: "password-reset" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP record
    await OTP.create({
      email: normalizedEmail,
      otp,
      purpose: "password-reset",
      attempts: 0,
    });

    // Send email
    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Password Reset</h2>
        <p>Use this code to reset your password:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">${otp}</p>
        <p style="color: #64748b; font-size: 14px;">This code is valid for 10 minutes. Do not share it with anyone.</p>
        <p style="color: #64748b; font-size: 14px;">If you did not request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0;" />
        <p style="color: #94a3b8; font-size: 12px;">Avir Trekkers – Trek with Purpose.</p>
      </div>
    `;

    await sendEmail(normalizedEmail, "Password Reset - Avir Trekkers", html);

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and new password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      purpose: "password-reset",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset code",
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please request a new reset code.",
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: "Invalid reset code",
      });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await RegistrationForm.findOneAndUpdate(
      { email: normalizedEmail },
      { password: hashedPassword }
    );

    // Delete the used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { forgotPassword, resetPassword };
