const prisma = require("../configs/prisma"); // เรียกใช้ PrismaClient จากไฟล์ config
const bcrypt = require("bcryptjs");
// Get User Info - รองรับทั้ง USER, ADMIN และ SUPERADMIN
const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // เพิ่ม header เพื่อปิดการ cache
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    // ตรวจสอบ role และให้ข้อมูลตามสิทธิ์การเข้าถึง
    if (req.user.role === "ADMIN" || req.user.role === "SUPERADMIN") {
      // ถ้าเป็น ADMIN หรือ SUPERADMIN ให้แสดงข้อมูลทั้งหมดของผู้ใช้
      const allUsers = await prisma.user.findMany();
      // console.log("admin")
      return res.status(200).json(allUsers);

    } else if (req.user.role === "USER") {
      // ถ้าเป็น USER ให้แสดงข้อมูลของตัวเอง
      const user = await prisma.user.findFirst({
        where: {
          id: Number(userId)
        }
      })
      const { password, ...userData } = user; // กำจัดรหัสผ่านจากข้อมูลที่ส่ง
      return res.status(200).json(userData);
    } else {
      // console.log("Denial")
      return res.status(403).send({ message: "การเข้าถึงถูกปฏิเสธ" });

    }
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", err);
    res.status(500).send({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

// Update User Info
const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, gender, email } = req.body;

    if (!firstName && !lastName && !email && !gender) {
      return res
        .status(400)
        .send({ message: "กรุณาระบุข้อมูลที่ต้องการอัปเดต" });
    }

    // ตรวจสอบอีเมลซ้ำ
    const uniqueEmail = await prisma.user.findFirst({
      where: {
        email: email,
        NOT: { id: userId }, // ID ต้องไม่ตรงกับผู้ใช้คนนี้
      },
    });

    if (uniqueEmail) {
      return res.status(409).send({ message: "อีเมลผู้ใช้งานซ้ำกัน" });
    }

    // อัปเดตข้อมูลผู้ใช้
    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        email: email,
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

// Update User Password
const updateUserPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // ตรวจสอบผู้ใช้
    const user = await prisma.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!user || !user.enabled) {
      return res
        .status(400)
        .json({ message: "ผู้ใช้ไม่พบหรือไม่ได้เปิดใช้งาน" });
    }

    // ตรวจสอบรหัสผ่านเก่า
    const compareOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!compareOldPassword) {
      return res.status(403).send({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // เข้ารหัสรหัสผ่านใหม่
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // อัปเดตข้อมูลรหัสผ่านใหม่
    await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).send({
      message: "อัปเดตข้อมูลรหัสผ่านสำเร็จ",
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error);
    res.status(500).send({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
};

// Get User Storage (Order History)
const getUserStorage = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        userId: Number(userId),
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                reviews: {
                  where: {
                    userId: userId
                  }
                }, // ดึงข้อมูลรีวิวที่เกี่ยวข้องกับสินค้า
              },
            },
          },
        },
        address: true,
        shipping: true,
      },
    });

    if (!orders || orders.length === 0) {
      return res.status(404).send({ message: "ไม่พบประวัติการสั่งซื้อ" });
    }

    return res.status(200).send({ orders });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:", error);
    res.status(500).send({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ" });
  }
};

// ฟังก์ชันลบผู้ใช้
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่าผู้ใช้มีอยู่ในระบบหรือไม่
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    // ลบผู้ใช้ออกจากฐานข้อมูล
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: "ลบผู้ใช้สำเร็จ" });
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการลบผู้ใช้:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};
module.exports = {
  getUser,
  updateUser,
  updateUserPassword,
  getUserStorage,
  deleteUser,
};
