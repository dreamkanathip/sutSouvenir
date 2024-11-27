// controllers/userController.js
const prisma = require("../configs/prisma"); // เรียกใช้ PrismaClient จากไฟล์ config

// Get User Info - รองรับทั้ง USER และ ADMIN
const getUser = async (req, res) => {
  try {
    const { password, ...userData } = req.user; // กำจัดรหัสผ่านจากข้อมูลที่ส่ง

    // ตรวจสอบ role และให้ข้อมูลตามสิทธิ์การเข้าถึง
    if (req.user.role === "ADMIN") {
      // ถ้าเป็น ADMIN ให้แสดงข้อมูลทั้งหมดของผู้ใช้
      const allUsers = await prisma.user.findMany();
      return res.status(200).json(allUsers);
    } else if (req.user.role === "USER") {
      // ถ้าเป็น USER ให้แสดงข้อมูลของตัวเอง
      res.status(200).json(userData);
    } else {
      return res.status(403).send({ message: "การเข้าถึงถูกปฏิเสธ" });
    }
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", err);
    res.status(500).send({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

module.exports = { getUser };
