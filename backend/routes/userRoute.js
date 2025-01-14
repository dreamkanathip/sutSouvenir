const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController");
const userController = require("../controllers/userController");
const {
  authenticateToken,
  authenticateAdmin,
  authenticateUser,
  authenticateSuperAdmin,
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

// Route สำหรับดึงข้อมูลผู้ใช้ (เฉพาะ SUPERADMIN)
router.get(
  "/superadmin/users",
  authenticateToken,
  authenticateSuperAdmin,
  userController.getUser
);

// Route สำหรับอัปเดตข้อมูลผู้ใช้
router.put("/user/update", authenticateToken, userController.updateUser);

// Route สำหรับอัปเดตข้อมูลรหัสผ่านผู้ใช้
router.patch(
  "/user/password",
  authenticateToken,
  userController.updateUserPassword
);

// Route สำหรับดึงข้อมูลคำสั่งซื้อของผู้ใช้
router.get("/user/storage", authenticateToken, userController.getUserStorage);

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
  userController.deleteUser // ฟังก์ชันลบผู้ใช้
);

module.exports = router;
