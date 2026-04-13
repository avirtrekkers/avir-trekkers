const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.SMTP_HOST || "mail.avirtrekkers.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_USER = process.env.SMTP_USER || "no-reply@avirtrekkers.com";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FROM_NAME = process.env.SMTP_FROM_NAME || "Avir Trekkers";

let transporter = null;

function getTransporter() {
    if (transporter) return transporter;
    if (!SMTP_PASS) {
        console.warn("SMTP_PASS not set; OTP emails will not be sent.");
        return null;
    }
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });
    return transporter;
}

/**
 * Send an email (e.g. OTP).
 * @param {string} to - Recipient email
 * @param {string} subject - Subject
 * @param {string} html - HTML body
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
async function sendEmail(to, subject, html) {
    const transport = getTransporter();
    if (!transport) {
        return { success: false, error: "Email not configured" };
    }
    try {
        await transport.sendMail({
            from: `"${FROM_NAME}" <${SMTP_USER}>`,
            to,
            subject,
            html
        });
        return { success: true };
    } catch (err) {
        console.error("Send email error:", err);
        return { success: false, error: err.message || "Failed to send email" };
    }
}

/**
 * Send OTP to email.
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP
 */
async function sendOtpEmail(to, otp) {
    const subject = "Your OTP for Trek Enrollment - Avir Trekkers";
    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e293b;">Verify your email</h2>
        <p>Use this OTP to complete your trek enrollment:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #2563eb;">${otp}</p>
        <p style="color: #64748b; font-size: 14px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0;" />
        <p style="color: #94a3b8; font-size: 12px;">Avir Trekkers – Trek with Purpose.</p>
      </div>
    `;
    return sendEmail(to, subject, html);
}

module.exports = { sendEmail, sendOtpEmail, getTransporter };
