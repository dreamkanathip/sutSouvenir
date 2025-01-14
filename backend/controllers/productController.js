const prisma = require("../configs/prisma");

exports.create = async (req, res) => {
  try {
    // พิมพ์ข้อมูลที่ได้รับ
    console.log(req.body); // ตรวจสอบข้อมูลที่ส่งมา

    const { title, description, price, quantity, categoryId } = req.body;

    // ตรวจสอบว่า categoryId ถูกส่งมาหรือไม่
    if (!categoryId) {
      return res.status(400).json({ message: "กรุณาระบุหมวดหมู่" });
    }

    // แปลง categoryId เป็นตัวเลข (Int)
    const categoryIdParsed = parseInt(categoryId, 10);
    if (isNaN(categoryIdParsed)) {
      return res.status(400).json({ message: "หมวดหมู่ไม่ถูกต้อง" });
    }

    // สร้างสินค้าและเชื่อมโยงกับหมวดหมู่
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        quantity,
        category: {
          connect: { id: categoryIdParsed }, // เชื่อมโยง category ตาม id ที่แปลงแล้ว
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "ไม่สามารถสร้างสินค้าได้", error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    // code
    const products = await prisma.product.findMany();
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.read = async (req, res) => {
  try {
    // code
    const { id } = req.params;
    const products = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.update = async (req, res) => {
  try {
    const { title, description, price, quantity } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!title || !description || !price || !quantity) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
    }

    // อัปเดตสินค้าด้วยข้อมูลใหม่
    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      },
    });

    // ส่งข้อมูลสินค้าที่อัปเดตแล้ว
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    // ส่งข้อความข้อผิดพลาดที่เกิดขึ้น
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
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
    const deletedProduct = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    // ตอบกลับเมื่อการลบสำเร็จ
    res
      .status(200)
      .json({ message: "Deleted successfully", product: deletedProduct });
  } catch (err) {
    console.error("Error deleting product:", err);

    // กรณีที่สินค้าไม่มีในฐานข้อมูล
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }

    // กรณีข้อผิดพลาดอื่น
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.listby = async (req, res) => {
  try {
    // code
    const { sort, order, limit } = req.body;
    console.log(sort, order, limit);
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { [sort]: order },
      include: { category: true },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const handleQuery = async (req, res, query) => {
  try {
    //code
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Search Error" });
  }
};
const handlePrice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0],
          lte: priceRange[1],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error " });
  }
};
const handleCategory = async (req, res, category) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: { equals: category }, // ค้นหาตามชื่อ category
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.searchFilters = async (req, res) => {
  try {
    // code
    const { query, category, price } = req.body;

    if (query) {
      console.log("query-->", query);
      await handleQuery(req, res, query);
    }
    if (category) {
      console.log("category-->", category);
      await handleCategory(req, res, category);
    }
    if (price) {
      console.log("price-->", price);
      await handlePrice(req, res, price);
    }

    // res.send('Hello searchFilters Product')
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
