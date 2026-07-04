const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authController");
const authenticateJWT = require("../middleware/authMiddleware");

// Creating admin accounts requires an authenticated admin — never public.
router.route("/registration").post(authenticateJWT, authControllers.registration);
router.route("/login").post(authControllers.login);
router.route("/change-password").post(authenticateJWT, authControllers.changePassword);

module.exports = router;
