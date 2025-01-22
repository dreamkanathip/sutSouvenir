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
