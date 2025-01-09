const jwt = require("jsonwebtoken");
const prisma = require("../configs/prisma");

// Middleware สำหรับตรวจสอบ token
const authenticateToken = async (req, res, next) => {
  // const token = req.cookies["jwt"];

  // Fixed Token, เปลี่ยนเมื่อจะใช้งานทุกครั้ง
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImlhdCI6MTczNjMyMjQxOCwiZXhwIjoxNzM2NDA4ODE4fQ.sVs-ogLpBQmpa6JPAjf-BcJ51x0IgvBtBmsL7gAVLeE"
  
  if (!token) {
    return res
      .status(401)
      .send({ message: "ต้องมี token สำหรับการยืนยันตัวตน" });
  }

  try {
    // ตรวจสอบ token และดึง claims
    const claims = jwt.verify(token, "secret");

    // ใช้ Prisma เพื่อค้นหาผู้ใช้
    const user = await prisma.user.findUnique({
      where: {
        id: claims._id, // ใช้ _id จาก claims ใน token
      },
    });

    if (!user) {
      return res
        .status(401)
        .send({ message: "token สำหรับการยืนยันตัวตนไม่ถูกต้อง" });
    }

    // แนบข้อมูล user ไปยัง request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ message: "token สำหรับการยืนยันตัวตนไม่ถูกต้อง" });
  }
};

// Middleware สำหรับตรวจสอบว่าเป็น Admin
const authenticateAdmin = (req, res, next) => {
  // ตรวจสอบว่า user ใน request มี role เป็น ADMIN
  if (req.user && req.user.role === "ADMIN") {
    return next(); // ถ้าเป็น admin ให้ดำเนินการต่อไป
  }

  // ถ้าไม่ใช่ admin ส่งคำตอบว่าไม่อนุญาต
  return res
    .status(403)
    .send({ message: "การเข้าถึงถูกปฏิเสธ. สำหรับผู้ดูแลระบบเท่านั้น" });
};

// Middleware สำหรับตรวจสอบว่าเป็น User
const authenticateUser = (req, res, next) => {
  // ตรวจสอบว่า user ใน request มี role เป็น USER
  if (req.user && req.user.role === "USER") {
    return next(); // ถ้าเป็น user ให้ดำเนินการต่อไป
  }

  // ถ้าไม่ใช่ user ส่งคำตอบว่าไม่อนุญาต
  return res
    .status(403)
    .send({ message: "การเข้าถึงถูกปฏิเสธ. สำหรับผู้ใช้ทั่วไปเท่านั้น" });
};

module.exports = {  authenticateToken, authenticateAdmin, authenticateUser };
