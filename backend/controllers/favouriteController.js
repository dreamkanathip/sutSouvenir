const prisma = require("../configs/prisma");

const likeProduct = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    console.log("userId:", userId, "productId:", productId); // ตรวจสอบค่าที่รับมาจาก request

    // ตรวจสอบว่าผู้ใช้เคยกดถูกใจสินค้านี้หรือยัง
    const existingFavorite = await prisma.favourite.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId,
        },
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "คุณได้กดถูกใจสินค้านี้แล้ว" });
    }

    // เพิ่มการกดถูกใจสินค้า
    const favourite = await prisma.favourite.create({
      data: {
        userId: userId,
        productId: productId,
      },
    });

    res.status(201).json(favourite);
  } catch (error) {
    console.error("Error in likeProduct:", error); // พิมพ์ข้อผิดพลาด
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการกดถูกใจสินค้า", error });
  }
};
const getLikeProducts = async (req, res) => {
  try {
    const { userId, productId } = req.params; // รับ userId และ productId จาก params

    // ตรวจสอบว่าค่าที่รับมาถูกต้อง
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }
    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ message: "Invalid or missing productId" });
    }

    // ค้นหาสินค้าที่ผู้ใช้ชอบ โดยใช้ userId และ productId
    const likeProducts = await prisma.like.findMany({
      where: {
        userId: Number(userId), // ค้นหาตาม userId
        productId: Number(productId), // ค้นหาตาม productId
      },
      include: {
        product: true, // รวมข้อมูลสินค้าที่เกี่ยวข้อง
      },
    });

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (likeProducts.length === 0) {
      return res.status(404).json({ message: "No liked products found" });
    }

    // ส่งข้อมูลกลับไป
    res.json({
      userId: Number(userId),
      productId: Number(productId),
      likeProducts,
    });
  } catch (err) {
    console.error("Error fetching liked products:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { likeProduct, getLikeProducts };
