const router = require("express").Router();
const { forgotPassword, resetPassword } = require("../controllers/passwordResetController");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
