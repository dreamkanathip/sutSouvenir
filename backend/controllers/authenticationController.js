// controllers/authenticationController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma"); // เรียกใช้ PrismaClient จากไฟล์ config

// Registration
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender } = req.body;

    // ตรวจสอบว่ามีผู้ใช้ที่ใช้อีเมลนี้หรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser)
      return res.status(400).send({ message: "อีเมลนี้ถูกลงทะเบียนแล้ว" });

    // เข้ารหัสรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // สร้างผู้ใช้ใหม่
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender,
      },
    });

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ", user });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการลงทะเบียน:", err);
    res.status(500).send({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).send({ message: "ไม่พบผู้ใช้" });

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).send({ message: "รหัสผ่านไม่ถูกต้อง" });

    const token = jwt.sign(
      { _id: user.id }, 
      "secret", 
      { expiresIn: "1d" });


    res.cookie("jwt", token, { 
        httpOnly: true, 
        secure: false,
        sameSite: "lax",
      });
    res.status(200).send({ message: "เข้าสู่ระบบสำเร็จ", token});
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", err);
    res.status(500).send({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

// Logout
const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.send({ message: "ออกจากระบบสำเร็จ" });
};

// Get Token
const getToken = async (req, res) => {
  const token = req.cookies.jwt; // ดึง token จาก cookie ที่ใช้ HTTP-only
  if (token) {
    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "เข้าถึงไม่ได้" });
      }
      res.status(200).json({ message: "ยืนยันตัวตนสำเร็จ", user });
    });
  } else {
    res.status(401).json({ message: "ไม่ได้รับการยืนยันตัวตน" });
  }
};

module.exports = { register, login, logout, getToken };
