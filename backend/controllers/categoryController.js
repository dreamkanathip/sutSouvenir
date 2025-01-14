const prisma = require("../configs/prisma");

exports.create = async (req, res) => {
  const { title, description, price, quantity, categoryId } = req.body;

  try {
    // ตรวจสอบว่า categoryId เป็นตัวเลขที่ถูกต้อง
    const categoryIdParsed = parseInt(categoryId, 10);
    if (isNaN(categoryIdParsed)) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    // สร้างผลิตภัณฑ์ใหม่ในฐานข้อมูล
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        quantity,
        category: {
          connect: {
            id: categoryIdParsed, // ใช้ categoryIdParsed ที่แปลงแล้ว
          },
        },
      },
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res

      .status(500)
      .json({ message: "Error creating product", error: error.message });
    console.log("categoryId:", req.body.categoryId);
    const categoryIdParsed = parseInt(req.body.categoryId, 10);
    console.log("categoryIdParsed:", categoryIdParsed); // ตรวจสอบค่า
  }
};
exports.list = async (req, res) => {
  try {
    // code
    const category = await prisma.category.findMany();
    res.send(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.remove = async (req, res) => {
  try {
    // code
    const { id } = req.params;
    const category = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    res.send(category);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
// ฟังก์ชันดึงข้อมูลหมวดหมู่ทั้งหมด
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลหมวดหมู่ได้" });
  }
};
