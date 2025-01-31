const { OrderStatus, PaymentStatus } = require("@prisma/client");
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
    const { cartTotal, addressId, shippingId } = req.body;
    const userId = req.user.id

    if (!userId || !cartTotal || !addressId || !shippingId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await prisma.order.create({
      data: {
        userId: Number(userId),
        cartTotal: Number(cartTotal),
        addressId: Number(addressId),
        shippingId: Number(shippingId)
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

    res.status(201).json({ orderDetail });
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
      originBankId,
      destBankId,
      lastFourDigits,
      transferAt,
      addressId,
      shippingId,
      cartTotal,
    } = req.body;

    if (
      !req.file ||
      !total ||
      !orderId ||
      !originBankId ||
      !destBankId ||
      !lastFourDigits ||
      !transferAt
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const uniqueKey = `images/${Date.now()}-${req.file.originalname}`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: uniqueKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
    } catch (s3Error) {
      console.error("S3 Upload Error:", s3Error);
      return res.status(500).json({ message: "Failed to upload receipt" });
    }

    try {
      const [payment, updateOrderStatus] = await prisma.$transaction([
        prisma.payment.create({
          data: {
            total: Number(total),
            orderId: Number(orderId),
            originBankId: Number(originBankId),
            destBankId: Number(destBankId),
            lastFourDigits,
            transferAt: new Date(transferAt),
            receipt: uniqueKey,
          },
        }),
        prisma.order.update({
          where: {
            id: Number(orderId)
          },
          data: {
            orderStatus: OrderStatus.NOT_PROCESSED
          }
        })
      ])
      res.status(201).json({payment, updateOrderStatus})
    } catch (err) {
      console.error("error:", err);
      return res.status(500).json({ message: "Failed to create payment" });
    }

    // Check and update order
    try {
      const checkIfUpdate = await prisma.order.findFirst({
        where: {
          id: Number(orderId),
        },
      });

      if (!checkIfUpdate) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (
        addressId != checkIfUpdate.addressId ||
        shippingId != checkIfUpdate.shippingId ||
        cartTotal != checkIfUpdate.cartTotal
      ) {
        await prisma.order.update({
          where: {
            id: Number(orderId),
          },
          data: {
            addressId: Number(addressId),
            shippingId: Number(shippingId),
            cartTotal: Number(cartTotal),
          },
        });
      }
    } catch (orderError) {
      console.error("Order Update Error:", orderError);
      return res.status(500).json({ message: "Failed to update order" });
    }
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

    const productsOnOrder = await prisma.productOnOrder.findMany({
      where: {
        id: Number(id)
      }
    })
    if (productsOnOrder.length === 0) {
      return res.status(404).json({ message: "No products found for this order" });
    }
    for (const productOnOrder of productsOnOrder) {
      await prisma.product.update({
        where: {
          id: Number(productOnOrder.productId)
        },
        data: {
          quantity: {
            increment: Number(productOnOrder.count)
          }
        }
      })
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


exports.getAllProductOnOrder = async(req, res) => {
    try {
        const productOnOrder = await prisma.productOnOrder.findMany({
            include: {
                order: true,
                product: true,
            }
        })
      res.send(productOnOrder)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err });
    }
}
exports.getOrderStatusEnum = async(req, res) => {
  try {
    res.send(OrderStatus)
  } catch (err) {
    console.error(err);
        res.status(500).json({ message: "Server error", error: err });
  }
}

exports.changeOrderStatus = async(req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    const changeStatus = await prisma.order.update({
      where: {
        id: Number(orderId)
      },
      data: {
        orderStatus: orderStatus
      }
    })
    res.send(changeStatus)
  } catch (err) {
    console.error(err);
        res.status(500).json({ message: "Server error", error: err });
  }
}

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const orders = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        address: true,
        shipping: true
      },
    });

    if (!orders) {
      return res.status(404).send({ message: "ไม่พบประวัติการสั่งซื้อ" });
    }

    return res.status(200).send( orders );
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:", error);
    res.status(500).send({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ" });
  }
}

exports.getOrders = async(req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
        address: true,
        shipping: true,
        payments: {
          include: {
            originBank: true,
            destBank: true
          }
        }
      },
    });
    res.status(200).send(orders);
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ:", err);
    res.status(500).send({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ" });
  }
}