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
  if (cookieToken) {
    return cookieToken;
  }

  // หากไม่มี token ในทั้งสองที่
  return null;
};

// Middleware สำหรับตรวจสอบการเข้าสู่ระบบ
exports.authCheck = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (!token) {
      return res.status(401).json({ message: "Authentication token required" });
    }

    // ตรวจสอบความถูกต้องของ token
    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode;

    // ตรวจสอบว่า user มีอยู่ในระบบและ enabled หรือไม่
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
    });
    if (!user || !user.enabled) {
      return res.status(403).json({ message: "This account cannot access" });
    }

    req.user = user; // เพิ่ม user object เข้า req
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid authentication token" });
  }
};

// Middleware สำหรับตรวจสอบการเป็น Admin
exports.adminCheck = async (req, res, next) => {
  try {
    const { email } = req.user;
    const adminUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access Denied: Admin Only" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error Admin access denied" });
  }
};
