// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const authenticationController = require("../controllers/authenticationController");
const userController = require("../controllers/userController");
const {
  authenticateToken,
  authenticateAdmin,
  authenticateUser,
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
  // authenticateUser,
  userController.getUser
);

router.put("/user/update", authenticateToken, userController.updateUser);

router.patch("/user/password", authenticateToken, userController.updateUserPassword);

router.get("/user/storage", authenticateToken, userController.getUserStorage);

module.exports = router;
