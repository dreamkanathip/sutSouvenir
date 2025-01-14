const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController");
const userController = require("../controllers/userController");
const {
  authenticateToken,
  authenticateAdmin,
  authenticateUser,
  authenticateSuperAdmin, // เพิ่มการยืนยันตัวตนสำหรับ SuperAdmin
} = require("../middlewares/authMiddleware");

// Route สำหรับการลงทะเบียน
router.post("/register", authenticationController.register);

// Route สำหรับการเข้าสู่ระบบ
router.post("/login", authenticationController.login);

// Route สำหรับการออกจากระบบ
router.post("/logout", authenticationController.logout);

// Route สำหรับดึงข้อมูลผู้ใช้ (ต้องมีการยืนยันตัวตน)
router.get("/profile", authenticateToken, userController.getUser);

// Route สำหรับดึงข้อมูลผู้ใช้ (เฉพาะ ADMIN)
router.get(
  "/admin/profile",
  authenticateToken,
  authenticateAdmin,
  userController.getUser
);

// Route สำหรับดึงข้อมูลผู้ใช้ (เฉพาะ USER)
router.get(
  "/user/profile",
  authenticateToken,
  authenticateUser,
  userController.getUser
);

// Route สำหรับดึงข้อมูลผู้ใช้ทั้งหมด (เฉพาะ SUPERADMIN)
router.get(
  "/superadmin/users",
  authenticateToken,
  authenticateSuperAdmin, // เช็คว่าเป็น SuperAdmin หรือไม่
  userController.getUser // ฟังก์ชันนี้จะต้องดึงข้อมูลผู้ใช้ทั้งหมด
);

module.exports = router;
