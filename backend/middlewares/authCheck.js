const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

// ฟังก์ชันสำหรับดึง token จาก header หรือ cookie
const getToken = (req) => {
  // ตรวจสอบใน headers.authorization
  const headerToken = req.headers.authorization;
  if (headerToken) {
    return headerToken.split(" ")[1];
  }

  // ตรวจสอบใน cookies["jwt"]
  const cookieToken = req.cookies["jwt"];
  console.log("Cookie Token:", cookieToken); // เพิ่มการดีบัก
  if (cookieToken) {
    return cookieToken;
  }

  // หากไม่มี token ในทั้งสองที่
  return null;
};

// Middleware สำหรับตรวจสอบการเข้าสู่ระบบ
const authCheck = async (req, res, next) => {
  try {
    const token = getToken(req); // เรียกใช้ฟังก์ชัน getToken เพื่อตรวจสอบใน headers หรือ cookies
    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    // ตรวจสอบความถูกต้องของ token
    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode; // กำหนด user ที่ decode จาก token ลงใน req

    // ตรวจสอบว่า user มีอยู่ในระบบและ enabled หรือไม่
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
    });

    if (!user || !user.enabled) {
      return res.status(403).json({ message: "This account cannot access" });
    }

    req.user = user; // เพิ่มข้อมูลผู้ใช้งานจากฐานข้อมูลลงใน req
    next();
  } catch (err) {
    console.error("Error in authCheck middleware:", err); // เพิ่มข้อความผิดพลาดเพื่อการดีบัก
    res.status(401).json({ message: "Invalid authentication token" });
  }
};

// Middleware สำหรับตรวจสอบการเป็น Admin
const adminCheck = async (req, res, next) => {
  try {
    // ตรวจสอบว่า req.user ถูกตั้งค่าไว้หรือไม่
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data" });
    }

    const { email } = req.user;
    const adminUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admin Only" });
    }

    next(); // ถ้าทุกอย่างถูกต้อง, ดำเนินการต่อไป
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Admin access denied" });
  }
};

// ส่งออกฟังก์ชันที่ใช้งาน
module.exports = {
  authCheck,
  adminCheck,
  getToken,
};
