// นำเข้าโมดูลที่จำเป็น
const bcrypt = require("bcryptjs"); // ใช้สำหรับเข้ารหัสและตรวจสอบรหัสผ่าน
const jwt = require("jsonwebtoken"); // ใช้สำหรับสร้างและตรวจสอบ JSON Web Token (JWT)
const prisma = require("../configs/prisma"); // เชื่อมต่อกับฐานข้อมูลผ่าน PrismaClient
require("dotenv").config(); // โหลดตัวแปรแวดล้อมจากไฟล์ .env

// ตั้งค่าตัวแปรสำหรับการจัดการคุกกี้และ JWT
const COOKIE_NAME = "authToken"; // ชื่อของคุกกี้ที่ใช้เก็บ JWT
const JWT_SECRET = process.env.JWT_SECRET; // ค่าลับสำหรับเซ็น JWT ดึงจากไฟล์ .env
const COOKIE_OPTIONS = {
  httpOnly: true, // จำกัดการเข้าถึงคุกกี้จากฝั่ง client-side เพื่อป้องกัน XSS
  secure: process.env.NODE_ENV === "production", // ใช้ secure=true เมื่ออยู่ใน production เท่านั้น
  sameSite: "lax", // ป้องกัน CSRF ในระดับหนึ่ง โดยอนุญาตการส่งคุกกี้ในบางกรณี
  maxAge: 24 * 60 * 60 * 1000, // อายุของคุกกี้คือ 1 วัน (หน่วยเป็นมิลลิวินาที)
};

// ** Registration **
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, gender, role } = req.body; // ดึงข้อมูลจาก body ของ request

    // ตรวจสอบว่ามีผู้ใช้งานที่ใช้อีเมลนี้อยู่แล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email }, // ค้นหาผู้ใช้ด้วยอีเมล
    });

    if (existingUser)
      // ถ้ามีผู้ใช้อีเมลนี้อยู่แล้ว
      return res.status(400).json({ message: "อีเมลนี้ถูกลงทะเบียนแล้ว" }); // ส่งข้อความแจ้งข้อผิดพลาดกลับ

    // เข้ารหัสรหัสผ่านก่อนบันทึกลงฐานข้อมูล
    const hashedPassword = await bcrypt.hash(password, 10); // ใช้ salt 10 รอบ

    // สร้างผู้ใช้ใหม่ในฐานข้อมูล
    const user = await prisma.user.create({
      data: {
        firstName, // ชื่อจริง
        lastName, // นามสกุล
        email, // อีเมล
        password: hashedPassword, // รหัสผ่านที่ถูกเข้ารหัสแล้ว
        gender, // เพศ
        role: role || "USER", // หากไม่ได้ระบุ role จะตั้งค่าเริ่มต้นเป็น USER
      },
    });

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ", user }); // ส่งข้อความตอบกลับเมื่อสร้างบัญชีสำเร็จ
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการลงทะเบียน:", err); // แสดงข้อผิดพลาดใน console
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" }); // ส่งข้อความข้อผิดพลาดกลับไปยัง client
  }
};

// ** Login **
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // ดึงอีเมลและรหัสผ่านจาก request

    const user = await prisma.user.findUnique({
      where: { email }, // ค้นหาผู้ใช้ด้วยอีเมล
    });

    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" }); // ถ้าไม่พบผู้ใช้จะส่งข้อผิดพลาดกลับ

    // ตรวจสอบรหัสผ่านว่าตรงกับฐานข้อมูลหรือไม่
    const isPasswordValid = await bcrypt.compare(password, user.password); // เปรียบเทียบรหัสผ่านที่รับมากับรหัสผ่านที่ถูกเข้ารหัสในฐานข้อมูล
    if (!isPasswordValid)
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" }); // ถ้าไม่ถูกต้องส่งข้อผิดพลาดกลับ

    // สร้าง JWT Token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d", // Token มีอายุ 1 วัน
    });

    // เก็บ Token ไว้ในคุกกี้เพื่อใช้งานในการยืนยันตัวตนครั้งถัดไป
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ", // ข้อความแจ้งเตือนเมื่อเข้าสู่ระบบสำเร็จ
      role: user.role, // ส่ง role กลับไปเพื่อจัดการสิทธิ์ใน frontend
      token: token, // ส่ง token กลับไปเผื่อใช้งานเพิ่มเติม
    });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ:", err); // แสดงข้อผิดพลาดใน console
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" }); // ส่งข้อความข้อผิดพลาดกลับไปยัง client
  }
};

// ** Logout **
const logout = (req, res) => {
  res.cookie(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 }); // ลบคุกกี้โดยตั้งค่า maxAge เป็น 0
  res.json({ message: "ออกจากระบบสำเร็จ" }); // แจ้งว่าการออกจากระบบสำเร็จ
};

// ** Get Token **
const getToken = async (req, res) => {
  try {
    const token = req.cookies[COOKIE_NAME]; // ดึง Token จากคุกกี้
    if (!token)
      return res.status(401).json({ message: "ไม่ได้รับการยืนยันตัวตน" }); // ถ้าไม่มี Token ส่งข้อความแจ้งเตือนกลับ

    const decoded = jwt.verify(token, JWT_SECRET); // ตรวจสอบความถูกต้องของ Token
    res.status(200).json({ message: "ยืนยันตัวตนสำเร็จ", user: decoded }); // ส่งข้อมูลผู้ใช้ที่ถอดรหัสได้กลับไป
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการยืนยันตัวตน:", err); // แสดงข้อผิดพลาดใน console
    res.status(403).json({ message: "เข้าถึงไม่ได้" }); // แจ้งว่าไม่สามารถเข้าถึงได้
  }
};

// ** Middleware สำหรับตรวจสอบสิทธิ์ **
const authorize = (roles) => {
  return (req, res, next) => {
    try {
      const token = req.cookies[COOKIE_NAME]; // ดึง Token จากคุกกี้
      if (!token)
        return res.status(401).json({ message: "ไม่ได้รับการยืนยันตัวตน" }); // ถ้าไม่มี Token ส่งข้อผิดพลาดกลับ

      const decoded = jwt.verify(token, JWT_SECRET); // ตรวจสอบความถูกต้องของ Token

      // ตรวจสอบว่าบทบาท (role) ของผู้ใช้ตรงกับที่ระบบกำหนดไว้หรือไม่
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "คุณไม่มีสิทธิ์เข้าถึง" }); // ถ้าไม่ตรง ส่งข้อผิดพลาดกลับ
      }

      req.user = decoded; // เก็บข้อมูลผู้ใช้ที่ถอดรหัสได้ไว้ใน req.user
      next(); // ดำเนินการไปยัง Middleware ถัดไป
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์:", err); // แสดงข้อผิดพลาดใน console
      res.status(403).json({ message: "เข้าถึงไม่ได้" }); // ส่งข้อความข้อผิดพลาดกลับไปยัง client
    }
  };
};

// ส่งออกฟังก์ชันเพื่อใช้งานในไฟล์อื่น
module.exports = { register, login, logout, getToken, authorize };
