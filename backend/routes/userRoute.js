const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const prisma = require("@prisma/client");
const authenticationController = require("../controllers/authenticationController");
const {
  getUser,
  updateUser,
  updateUserPassword,
  getUserStorage,
  deleteUser,
} = require("../controllers/userController");

const {
  authenticateToken,
  authenticateAdmin,
  authenticateUser,
  authenticateSuperAdmin,
} = require("../middlewares/authMiddleware");

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
  getUser
);

// Route สำหรับดึงข้อมูลผู้ใช้ (เฉพาะ SUPERADMIN)
router.get(
  "/superadmin/users",
  authenticateToken,
  authenticateSuperAdmin,
  getUser
);

// Route สำหรับอัปเดตข้อมูลผู้ใช้
router.put("/user/update", authenticateToken, updateUser);

// Route สำหรับอัปเดตข้อมูลรหัสผ่านผู้ใช้
router.patch(
  "/user/password",
  authenticateToken,
  updateUserPassword
);

// Route สำหรับดึงข้อมูลคำสั่งซื้อของผู้ใช้
router.get("/user/storage", authenticateToken, getUserStorage);

// เส้นทางสำหรับการเข้าสู่หน้า user
router.get("/home", authenticateToken);

// เส้นทางสำหรับการเข้าสู่หน้า admin
router.get("/admin/dashboard", authenticateToken);

// เส้นทางสำหรับการเข้าสู่หน้า superadmin
router.get("/superadmin/dashboard", authenticateToken);

// Route สำหรับลบผู้ใช้ (เฉพาะ SUPERADMIN เท่านั้น)
router.delete(
  "/superadmin/users/:id",
  authenticateToken, // ตรวจสอบ JWT
  authenticateSuperAdmin, // ตรวจสอบสิทธิ์ SUPERADMIN
  deleteUser // ฟังก์ชันลบผู้ใช้
);

module.exports = router;
