const express = require("express");
const router = express.Router();

// Import Controller
// Import Controller
const { register, login, logout, currentUser } = require("../controllers/auth");

// Import Middleware
const { authCheck, adminCheck } = require("../middlewares/authCheck");
// Route สำหรับการลงทะเบียน
router.post("/register", register);

// Route สำหรับการเข้าสู่ระบบ
router.post("/login", login);

router.post("/logout", logout);
// Route สำหรับดึงข้อมูลผู้ใช้ปัจจุบัน (จำเป็นต้องเข้าสู่ระบบก่อน)
router.post("/current-user", authCheck, currentUser);

// Route สำหรับดึงข้อมูลผู้ดูแลระบบ (ต้องเข้าสู่ระบบและเป็นผู้ดูแลระบบ)
router.post("/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;
