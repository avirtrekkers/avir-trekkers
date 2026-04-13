const express = require("express");
const router = express.Router();

const profileControllers = require("../controllers/profileController");
router.route("/createProfile").post(profileControllers.createProfile)
router.route("/getProfile").get(profileControllers.getProfile)

module.exports =  router;