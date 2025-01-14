const prisma = require("../configs/prisma");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  },
  region: process.env.AWS_REGION,
});

exports.initOrder = async (req, res) => {
  try {
    const { userId, cartTotal } = req.body;

    const order = await prisma.order.create({
      data: {
        userId: Number(userId),
        cartTotal: Number(cartTotal),
      },
    });
    res.send(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// add product on order
exports.addOrderDetail = async (req, res) => {
  try {
    const { orderId, productId, quantity, total } = req.body;

    const addOrderDetail = await prisma.productOnOrder.create({
      data: {
        productId: Number(productId),
        orderId: Number(orderId),
        count: Number(quantity),
        price: Number(total),
      },
    });

    const updateOrderTotalPrice = await prisma.order.update({
      where: {
        id: Number(orderId),
      },
      data: {
        cartTotal: { increment: Number(total) },
      },
    });
    res.json({
      addOrderDetail,
      updateOrderTotalPrice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductOnOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const productOnOrder = await prisma.productOnOrder.findMany({
      where: {
        orderId: Number(id),
      },
      include: {
        product: true,
      },
    });
    res.send(productOnOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

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

    let receiptUrl = null;

    if (req.file) {
      const uniqueKey = `images/${Date.now()}-${req.file.originalname}`;

      const params = {
        Bucket: "sutsouvenir-seniorproject",
        Key: uniqueKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        // ACL: 'public-read'
      };
      await s3Client.send(new PutObjectCommand(params));
      receiptUrl = uniqueKey;
    } else {
      throw new Error("No file");
    }
    const upload = await prisma.payment.create({
      data: {
        total: Number(total),
        userId: Number(userId),
        orderId: Number(orderId),
        originBankId: Number(originBankId),
        destBankId: Number(destBankId),
        lastFourDigits: lastFourDigits,
        transferAt: new Date(transferAt),
        receipt: receiptUrl,
      },
    });

    res.send(upload);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", err });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await prisma.payment.findMany();
    res.send(payment);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", err });
  }
};
