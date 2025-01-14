// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const prisma = require("@prisma/client");
const authenticationController = require("../controllers/authenticationController");
const {
  getUser,
  updateUser,
  updateUserPassword,
  getUserStorage
} = require("../controllers/userController");

const {
  authenticateToken,
  authenticateAdmin,
  authenticateUser,
} = require("../middlewares/authMiddleware");

// Route สำหรับดึงข้อมูลผู้ใช้ (เฉพาะ ADMIN)
router.get(
  "/admin/profile",
  authenticateToken,
  authenticateAdmin,
  getUser
);

// Route สำหรับดึงข้อมูลผู้ใช้ (เฉพาะ USER)
router.get("/user/profile", authenticateToken, getUser);

router.put("/user/update", authenticateToken, updateUser);

router.patch("/user/password", authenticateToken, updateUserPassword);

router.get("/user/storage", authenticateToken, getUserStorage);

module.exports = router;
