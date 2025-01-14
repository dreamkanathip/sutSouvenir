// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController");
const userController = require("../controllers/userController");

// Route สำหรับการลงทะเบียน
router.post("/register", authenticationController.register);

// Route สำหรับการเข้าสู่ระบบ
router.post("/login", authenticationController.login);

// Route สำหรับการออกจากระบบ
router.post("/logout", authenticationController.logout);

module.exports = router;
