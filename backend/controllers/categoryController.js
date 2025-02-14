const prisma = require("../configs/prisma");

exports.create = async (req, res) => {
  try {
    console.log(req.body); // ตรวจสอบข้อมูลที่ส่งมา

    const { name } = req.body;

    // สร้างสินค้าและเชื่อมโยงกับหมวดหมู่
    const category = await prisma.category.create({
      data: {
        name: name
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(500)
      .json({ message: "ไม่สามารถสร้างหมวดหมู่ได้", error: error.message });
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
// ฟังก์ชันสร้างหมวดหมู่
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    // สร้างหมวดหมู่ใหม่ในฐานข้อมูล
    const category = await prisma.category.create({
      data: {
        name,
      },
    });

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error);
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
};
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // ตรวจสอบว่า id ถูกส่งมาหรือไม่ และเป็นตัวเลข
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // ลบสินค้าโดยใช้ Prisma
    const deleteCategoryById = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    // ตอบกลับเมื่อการลบสำเร็จ
    res
      .status(200)
      .json({ message: "Deleted successfully", category: deleteCategoryById });
  } catch (err) {
    console.error("Error deleting product:", err);

    // กรณีที่สินค้าไม่มีในฐานข้อมูล
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Category not found" });
    }

    // กรณีข้อผิดพลาดอื่น
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // ตรวจสอบว่า id ถูกส่งมาหรือไม่ และเป็นตัวเลข
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    // ตรวจสอบว่า category มีอยู่ในฐานข้อมูลหรือไม่
    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // อัปเดต category
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    res.status(200).json(category);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};
