const express =  require("express");
const router = express.Router();
const applicationFormControllers = require("../controllers/applicationFormController")
const authControllers = require("../controllers/authController")
const authenticateJWT  = require("../middleware/authMiddleware")

router.route("/").get(applicationFormControllers.home);
router.route("/application").post(applicationFormControllers.createApplication);
router.route("/updateApplication").post(applicationFormControllers.updateApplication);
router.route("/getApplication").get(applicationFormControllers.getApplication);
router.route("/deleteApplication").post(applicationFormControllers.deleteApplication);
router.route("/registration").post(authControllers.registration);
router.route("/login").post(authControllers.login);
router.route("/change-password").post(authenticateJWT, authControllers.changePassword);

module.exports =router;