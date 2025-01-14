const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma"); // เชื่อมต่อกับ PrismaClient จากไฟล์ config
require("dotenv").config(); // โหลด environment variables

const COOKIE_NAME = "authToken"; // ชื่อคุกกี้ที่ใช้เก็บ JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // ใช้ตัวแปรจริงจาก .env สำหรับ production
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // ใช้ secure เฉพาะ production
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000, // อายุคุกกี้ (1 วัน)
};

// ** Registration **
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, role } = req.body;

    // ตรวจสอบว่ามีผู้ใช้อีเมลนี้หรือยัง
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return res.status(400).json({ message: "อีเมลนี้ถูกลงทะเบียนแล้ว" });

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่ในฐานข้อมูล
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender,
        role: role || "USER", // กำหนด role เป็น USER ถ้าไม่ได้ระบุ
      },
    });

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ", user });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการลงทะเบียน:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

// ** Login **
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });

    // สร้าง JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // ส่ง token กลับไปเก็บในคุกกี้
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      role: user.role,
      token: token,
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

// ** Logout **
const logout = (req, res) => {
  res.cookie(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  res.json({ message: "ออกจากระบบสำเร็จ" });
};

// ** Get Token **
const getToken = async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token)
      return res.status(401).json({ message: "ไม่ได้รับการยืนยันตัวตน" });

    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ message: "ยืนยันตัวตนสำเร็จ", user: decoded });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการยืนยันตัวตน:", err);
    res.status(403).json({ message: "เข้าถึงไม่ได้" });
  }
};

// ** Middleware สำหรับตรวจสอบสิทธิ์ **
const authorize = (roles) => {
  return (req, res, next) => {
    try {
      const token = req.cookies[COOKIE_NAME];
      if (!token)
        return res.status(401).json({ message: "ไม่ได้รับการยืนยันตัวตน" });

      const decoded = jwt.verify(token, JWT_SECRET);

      // ตรวจสอบบทบาท
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "คุณไม่มีสิทธิ์เข้าถึง" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์:", err);
      res.status(403).json({ message: "เข้าถึงไม่ได้" });
    }
  };
};

module.exports = { register, login, logout, getToken, authorize };
