const prisma = require("../configs/prisma");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  },
  region: process.env.AWS_REGION,
});

// Initialize an order
exports.initOrder = async (req, res) => {
  try {
    const { userId, cartTotal } = req.body;

    if (!userId || !cartTotal) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await prisma.order.create({
      data: {
        userId: Number(userId),
        cartTotal: Number(cartTotal),
      },
    });
    res.status(201).send(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add product to order
exports.addOrderDetail = async (req, res) => {
  try {
    const { orderId, productId, quantity, total } = req.body;

    if (!orderId || !productId || !quantity || !total) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderDetail = await prisma.productOnOrder.create({
      data: {
        productId: Number(productId),
        orderId: Number(orderId),
        count: Number(quantity),
        price: Number(total),
      },
    });

    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { cartTotal: { increment: Number(total) } },
    });

    res.status(201).json({ orderDetail, updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get products in an order
exports.getProductOnOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const products = await prisma.productOnOrder.findMany({
      where: { orderId: Number(id) },
      include: { product: true },
    });

    res.status(200).send(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload payment receipt
exports.uploadReceipt = async (req, res) => {
  try {
    const {
      total,
      orderId,
      userId,
      originBankId,
      destBankId,
      lastFourDigits,
      transferAt,
    } = req.body;

    if (
      !req.file ||
      !total ||
      !orderId ||
      !userId ||
      !originBankId ||
      !destBankId ||
      !transferAt
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const uniqueKey = `images/${Date.now()}-${req.file.originalname}`;
    const params = {
      Bucket: "sutsouvenir-seniorproject",
      Key: uniqueKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(params));

    const payment = await prisma.payment.create({
      data: {
        total: Number(total),
        userId: Number(userId),
        orderId: Number(orderId),
        originBankId: Number(originBankId),
        destBankId: Number(destBankId),
        lastFourDigits,
        transferAt: new Date(transferAt),
        receipt: uniqueKey,
      },
    });

    res.status(201).send(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all payments
exports.getPayment = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany();
    res.status(200).send(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    await prisma.order.update({
      where: { id: Number(id) },
      data: { orderStatus: "CANCELLED" },
    });

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};
