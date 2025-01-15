const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma"); // สามารถใช้สำหรับการเข้าถึงฐานข้อมูลถ้าจำเป็น

// ฟังก์ชันตรวจสอบ Token
const authenticateToken = async (req, res, next) => {
  try {
    // ดึง token จาก Authorization header แบบ Bearer
    const token = req.headers["authorization"]?.split(" ")[1]; // ตรวจสอบว่า Authorization header ส่งมาหรือไม่

    if (!token) {
      // หากไม่มี token
      return res.status(403).json({ message: "Token ไม่ได้ถูกส่งมา" });
    }

    // ตรวจสอบ token ว่าถูกต้องหรือไม่
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
     // ใช้ JWT_SECRET ในการตรวจสอบ
     const user = await prisma.user.findFirst({
      where: {
        id: Number(decoded.id)
      }
     })
    req.user = user; // เก็บข้อมูล user ที่ได้จาก token ไว้ใน req.user
    next(); // ไปที่ middleware หรือ route ถัดไป
  } catch (err) {
    console.error("Token verification failed:", err); // พิมพ์ข้อผิดพลาดใน server log
    return res.status(403).json({
      message: "Token ไม่ถูกต้อง",
      error: err.message, // ส่งข้อความข้อผิดพลาดที่เกิดขึ้นให้ผู้ใช้ทราบ
    });
  }
};

// ฟังก์ชันตรวจสอบสิทธิ์ของ role
const authenticateRole = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res
        .status(403)
        .send({ message: "Token ไม่ถูกต้อง หรือ ไม่มีข้อมูลผู้ใช้" });
    }

    console.log(req.user); // เพิ่มคำสั่งนี้เพื่อตรวจสอบข้อมูลของ user ที่ decoded มาจาก Token

    // เช็คว่า role ของผู้ใช้ที่ login เข้ามาตรงกับ role ที่ได้รับอนุญาตหรือไม่
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .send({ message: "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้" });
    }

    next(); // ไปที่ middleware หรือ route ถัดไป
  };
};

// ใช้ authenticateRole กับ role ต่างๆ
const authenticateAdmin = authenticateRole(["ADMIN", "SUPERADMIN"]);
const authenticateUser = authenticateRole(["USER"]);
const authenticateSuperAdmin = authenticateRole(["SUPERADMIN"]);

module.exports = {
  authenticateToken,
  authenticateAdmin,
  authenticateUser,
  authenticateSuperAdmin,
};
