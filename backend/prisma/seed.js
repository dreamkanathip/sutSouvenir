require("dotenv").config(); // นำเข้า dotenv

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prismaClient = new PrismaClient();

async function main() {
  const superadminEmail = "superadmin@gmail.com";
  const superadminPassword = "superadmin"; // รหัสผ่านที่คุณต้องการใช้

  // ตรวจสอบว่า superadmin มีอยู่แล้วหรือไม่
  const existingSuperadmin = await prismaClient.user.findUnique({
    where: { email: superadminEmail },
  });

  if (!existingSuperadmin) {
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(superadminPassword, 10);

    // สร้าง superadmin
    const superadmin = await prismaClient.user.create({
      data: {
        firstName: "Super",
        lastName: "Admin",
        email: superadminEmail,
        password: hashedPassword,
        role: "SUPERADMIN",
        gender: "male",
        enabled: true,
      },
    });

    console.log("Superadmin created successfully!");

    // สร้าง JWT Token สำหรับ superadmin โดยไม่มีวันหมดอายุ
    const payload = {
      email: superadmin.email,
      role: superadmin.role,
      id: superadmin.id,
    };

    const secretKey = process.env.JWT_SECRET || "your-secret-key"; // ใช้ค่า JWT_SECRET จาก .env
    const token = jwt.sign(payload, secretKey); // สร้าง JWT token

    console.log(`Superadmin JWT Token: ${token}`); // แสดง JWT token
  } else {
    console.log("Superadmin already exists!");
  }

  // เพิ่มหมวดหมู่ (Category)
  const categories = ["เสื้อผ้า", "อุปกรณ์เครื่องใช้", "อื่นๆ"];

  for (const categoryName of categories) {
    const existingCategory = await prismaClient.category.findUnique({
      where: { name: categoryName },
    });

    if (!existingCategory) {
      // ถ้ายังไม่มีหมวดหมู่นี้ในฐานข้อมูล
      const newCategory = await prismaClient.category.create({
        data: { name: categoryName },
      });
      console.log(`Category "${categoryName}" created successfully.`);
    } else {
      console.log(`Category "${categoryName}" already exists.`);
    }
  }
}

// เรียกใช้ฟังก์ชัน main
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });
