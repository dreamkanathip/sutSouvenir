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

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // ดึง user id จาก middleware (authenticateToken)
    const { firstname, lastname, gender, email, phone } = req.body;

    if (!firstname && !email && !phone) {
      return res
        .status(400)
        .send({ message: "กรุณาระบุข้อมูลที่ต้องการอัปเดต" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(gender && { gender }),
        ...(email && { email }),
        ...(phone && { phone }),
      },
    });

    res.status(200).send({
      message: "อัปเดตข้อมูลสำเร็จ",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      // Prisma error code for record not found
      return res.status(404).send({ message: "ไม่พบข้อมูลผู้ใช้" });
    }

    res.status(500).send({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
};

module.exports = { getUser, updateUser };
