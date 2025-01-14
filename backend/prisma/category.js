require("dotenv").config(); // นำเข้า dotenv
const { PrismaClient } = require("@prisma/client");
const prismaClient = new PrismaClient();

async function createInitialCategories() {
  // หมวดหมู่ที่ต้องการเพิ่ม
  const categories = ["เสื้อผ้า", "อุปกรณ์เครื่องใช้", "อื่นๆ"];

  // ลูปผ่านแต่ละหมวดหมู่เพื่อตรวจสอบว่ามีอยู่แล้วหรือไม่ และเพิ่มลงในฐานข้อมูล
  for (const categoryName of categories) {
    try {
      const existingCategory = await prismaClient.category.findUnique({
        where: { name: categoryName },
      });

      if (!existingCategory) {
        // ถ้ายังไม่มีหมวดหมู่นี้ในฐานข้อมูล ก็ทำการเพิ่ม
        const newCategory = await prismaClient.category.create({
          data: { name: categoryName },
        });
        console.log(`Category ${newCategory.name} created successfully.`);
      } else {
        console.log(`Category ${categoryName} already exists.`);
      }
    } catch (error) {
      console.error(`Error creating category ${categoryName}:`, error);
    }
  }
}

// เรียกใช้ฟังก์ชันสร้างหมวดหมู่เมื่อรันเซิร์ฟเวอร์
createInitialCategories()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // ปิดการเชื่อมต่อกับ Prisma หลังจากทำงานเสร็จ
    await prismaClient.$disconnect();
  });
