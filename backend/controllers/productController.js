const prisma = require("../configs/prisma");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  },
  region: process.env.AWS_REGION,
});

exports.uploadImage = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!req.file || !productId)
      return res.status(400).json({ message: "Missing required fields" });

    const uniqueKey = `images/${Date.now()}-${req.file.originalname}`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: uniqueKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {
      const image = await s3Client.send(new PutObjectCommand(params));
      console.log(image)
    } catch (s3Error) {
      console.error("S3 Upload Error:", s3Error);
      return res.status(500).json({ message: "Failed to upload image" });
    }

    let product;
    try {
      product = await prisma.product.findFirst({
        where: {
          id: Number(productId),
        },
      });
      if (!product) return res.status(404).send("Product not found");

      const uploadImage = await prisma.image.create({
        data: {
          public_id: "", // You can store a public_id here if needed
          secure_url: `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.BUCKET_NAME}/${uniqueKey}`,
          asset_id: uniqueKey,
          url: `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.BUCKET_NAME}/${uniqueKey}`,
          productId: Number(productId),
        },
      });
      return res.status(201).json(uploadImage);
    } catch (dbError) {
      console.error(dbError);
      return res.status(500).json({ message: "Database error" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId } = req.body;

    // Validate categoryId
    if (!categoryId) {
      return res.status(400).json({ message: "Category is required" });
    }

    const categoryIdParsed = parseInt(categoryId, 10);
    if (isNaN(categoryIdParsed)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Create product and associate with category
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        quantity,
        category: {
          connect: { id: categoryIdParsed },
        },
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
      },
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: {
        category: true,
        images: {
          select: {
            id: true,
            asset_id: true,
            secure_url: true,
            url: true,
          },
        },
      },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, price, quantity } = req.body;

    // Validate required fields
    if (!title || !description || !price || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
      },
    });

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Delete product
    const deletedProduct = await prisma.product.delete({
      where: { id: Number(id) },
    });

    res
      .status(200)
      .json({ message: "Deleted successfully", product: deletedProduct });
  } catch (err) {
    console.error("Error deleting product:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.listby = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { [sort]: order },
      include: { category: true },
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const handleQuery = async (req, res, query) => {
  try {
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
    res.json(products);
  } catch (err) {
    console.error(err);
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
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const handleCategory = async (req, res, category) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          name: { equals: category },
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.searchFilters = async (req, res) => {
  try {
    const { query, category, price } = req.body;

    if (query) {
      await handleQuery(req, res, query);
    }
    if (category) {
      await handleCategory(req, res, category);
    }
    if (price) {
      await handlePrice(req, res, price);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// ในไฟล์ productController.js
exports.getProductImage = async (req, res) => {
  try {
    const { id } = req.params; // รับ id ของภาพ (หรือ productId)

    // ค้นหาภาพในฐานข้อมูลที่เกี่ยวข้อง
    const image = await prisma.image.findUnique({
      where: {
        id: Number(id), // หรือใช้ productId ถ้าต้องการ
      },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // ส่งข้อมูลของภาพกลับมา
    res.status(200).json(image);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
