const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// โหลด dotenv เพื่อให้สามารถใช้งานตัวแปรจาก .env ได้
require("dotenv").config();

// Register
const register = async (req, res) => {
  try {
    const { firstname, lastname, email, password, gender } = req.body;

    // Validate input
    if (!email || !password || !firstname || !lastname || !gender) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        gender,
        enabled: true,
      },
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        gender: newUser.gender,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findFirst({
      where: { email },
    });
    if (!user || !user.enabled) {
      return res.status(404).json({ message: "User not found or disabled" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET, // ใช้ค่า secret จาก .env
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
      maxAge: 24 * 60 * 60 * 1000, // 1 วัน
      secure: process.env.NODE_ENV === "production", // ใช้ secure cookie เมื่อใช้ HTTPS
      sameSite: "Strict", // ป้องกันการส่งคุกกี้จากโดเมนอื่น
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Current User
const currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        gender: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching current user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout
const logout = (req, res) => {
  try {
    res.clearCookie("jwt", { httpOnly: true }); // ลบ JWT จาก Cookies
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error during logout" });
  }
};

// Validate Token (Optional)
const getToken = (req, res) => {
  const token = req.cookies.jwt; // Get the token from the HTTP-only cookie
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(200).json({ message: "Authenticated", user });
  });
};

// Get User Info
const getUser = (req, res) => {
  try {
    // Assume req.user contains the authenticated user after JWT verification
    const { password, ...userData } = req.user; // กำจัดรหัสผ่านจากข้อมูลที่ส่ง
    res.status(200).json(userData);
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export the functions
module.exports = { register, login, currentUser, logout, getToken, getUser };
