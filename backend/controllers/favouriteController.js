const prisma = require("../configs/prisma");

const likeProduct = async (req, res) => {
  const { userId } = req.params;
  const { id } = req.body;
  try {
    // ตรวจสอบว่าผู้ใช้เคยกดถูกใจสินค้านี้หรือยัง
    const existingFavorite = await prisma.favourite.findUnique({
      where: {
        userId_productId: {
          userId: Number(userId),
          productId: Number(id),
        },
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ message: "คุณได้กดถูกใจสินค้านี้แล้ว" });
    }

    // เพิ่มการกดถูกใจสินค้า
    const favourite = await prisma.favourite.create({
      data: {
        userId: Number(userId),
        productId: Number(id),
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
    const { userId } = req.params;

    // ค้นหาสินค้าที่ผู้ใช้ชอบ โดยใช้ userId และ productId
    const likeProducts = await prisma.favourite.findMany({
      where: {
        userId: Number(userId), // ค้นหาตาม userId
      },
      include: {
        product: true, // รวมข้อมูลสินค้าที่เกี่ยวข้อง
      },
    });

    // ส่งข้อมูลกลับไป
    res.status(200).send(likeProducts)
  } catch (err) {
    console.error("Error fetching liked products:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const checkLikeProduct = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const likeProduct = await prisma.favourite.findFirst({
      where: {
        userId: Number(userId),
        productId: Number(productId)
      }
    })
    
    res.status(200).send(likeProduct)
  } catch (err) {
    console.error("Error fetching liked products:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

const unLikeProduct = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // ตรวจสอบว่าค่าที่รับมาถูกต้อง
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }
    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ message: "Invalid or missing productId" });
    }

    const unLiked = await prisma.favourite.delete({
      where: {
        userId_productId: {
          userId: Number(userId),
          productId: Number(productId),
        },
      }
    })

    res.status(200).json({message: "Unlike Product Done"})
  } catch (err) {
    console.error("Error fetching liked products:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { likeProduct, getLikeProducts, checkLikeProduct, unLikeProduct };
