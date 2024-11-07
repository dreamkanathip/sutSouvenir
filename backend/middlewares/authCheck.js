// authCheck.js (middleware สำหรับตรวจสอบการเข้าสู่ระบบ)
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma"); // หรือแหล่งข้อมูลของคุณ

exports.authCheck = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(403)
        .json({ message: "No token, authorization denied" });
    }

    // ตรวจสอบและดึงข้อมูลผู้ใช้จาก token
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await prisma.user.findFirst({
      where: { id: decoded.id },
    });
    const authCheck = (req, res, next) => {
      const token = req.cookies.token; // อ่านคุกกี้จากฝั่ง Client
      if (!token) {
        return res
          .status(403)
          .json({ message: "Authorization denied, no token" });
      }

      try {
        const decoded = jwt.verify(token, process.env.SECRET); // ยืนยัน token
        req.user = decoded; // ใส่ข้อมูลผู้ใช้ใน request
        next(); // ไปยัง middleware หรือ route ถัดไป
      } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
    };

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // เพิ่มข้อมูลผู้ใช้ลงใน request
    next(); // ถ้าทุกอย่างถูกต้องให้ไปที่ controller ต่อไป
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// adminCheck.js (middleware สำหรับตรวจสอบการเข้าสู่ระบบของผู้ดูแลระบบ)
exports.adminCheck = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin resources access denied" });
  }
  next();
};
