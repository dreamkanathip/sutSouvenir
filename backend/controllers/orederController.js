const prisma = require("../configs/prisma");

exports.initOrder = async(req, res) => {
    try {
        const { userId, cartTotal } = req.body;

        const order = await prisma.order.create({
            data: {
                userId: Number(userId),
                cartTotal: Number(cartTotal)
            }
        });
        res.send(order)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

// add product on order
exports.addOrderDetail = async(req, res) => {
    try {
        const { orderId, productId, quantity, total } = req.body

        const [addOrderDetail, updateOrderTotalPrice] = await prisma.$transaction([
            prisma.productOnOrder.create({
                data: {
                    productId: Number(productId),
                    orderId: Number(orderId),
                    count: Number(quantity),
                    price: Number(total)
                }
            }),
            prisma.order.update({
                where: {
                    id: Number(orderId)
                },
                data: {
                    cartTotal: {
                        increment: Number(total)
                    }
                }
            })
        ])
        res.json({
            addOrderDetail, updateOrderTotalPrice
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getProductOnOrder = async(req, res) => {
    try {
        const { id } = req.params

        const productOnOrder = await prisma.productOnOrder.findMany({
            where: {
                orderId: Number(id)
            },
            include: {
                product: true,
            }
        })
        res.send(productOnOrder)
    } catch (err) {

    }
}