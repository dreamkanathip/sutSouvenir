const prisma = require('../config/prisma');
const { read } = require('./product');

//initial cart for user
exports.initial = async(req, res) => {
    try {
        const { userId, cartTotal } = req.body;
        const cart = await prisma.cart.create({
            data: {
                userId: parseInt(userId),
                cartTotal: parseFloat(cartTotal)
            }
        });
        res.send(cart)
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

//delete cart when user done with cart
exports.deleteCart = async(req, res) => {
    try {
        const { id } = req.body;
        await prisma.cart.delete({
            where: {
                id: Number(id)
            }
        });
        res.send("Delete success")
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }   
}

//when user add product to cart by user id and product id
exports.addItemToCart = async(req, res) => {
    try {
        const { userId, productId, quantity } = req.body
        console.log("check backend", Number(productId))

        //find certain cart and product for certain user
        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId)
            }
        })
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(userId)
            }
        })

        //check if item exist
        const checkItem = await prisma.productOnCart.findFirst({
            where: {
                productId: Number(productId),
                cartId: Number(cart.id)
            }
        })

        //if found, update amount instead
        if(checkItem) {

            const [updateAmount, updateCartTotal] = await prisma.$transaction([
                prisma.productOnCart.update({
                    where: {
                        id: Number(checkItem.id)
                    },
                    data: {
                        quantity: {
                            increment: Number(quantity)
                        },
                        price: {
                            increment: product.price*quantity
                        }
                    }
                }),
                prisma.cart.update({
                    where: {
                        id: Number(cart.id)
                    },
                    data: {
                        cartTotal: {
                            increment: product.price*quantity
                        }
                    }
                })
            ])

           return res.json({
                updateAmount, updateCartTotal
            })
        }

        const [addItem, updateCartTotal] = await prisma.$transaction([
            prisma.productOnCart.create({
                data: {
                    cartId: Number(cart.id),
                    productId: productId,
                    quantity: Number(quantity),
                    price: product.price*quantity
                }
            }),
            prisma.cart.update({
                where: {
                    id: Number(cart.id)
                },
                data: {
                    cartTotal: {
                        increment: product.price*quantity
                    }
                }
            })
        ])
        res.json({
            addItem, updateCartTotal
        });  
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

//to see all of the carts
exports.getAllCarts = async(req, res) => {
    try {
        const cart = await prisma.cart.findMany()
        res.send(cart)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.getCartById = async(req, res) => {
    try {
        const { userId } = req.params;

        const cart = await prisma.cart.findFirst({
            where: {
                userId: userId
            }
        })
        res.send(cart)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

//to see product on specify cart
exports.getItemsOnCart = async(req, res) => {
    try {
        const { cartId } = req.params;

        const itemsOnCart = await prisma.productOnCart.findMany({
            where: {
                cartId: cartId
            },
            include: {
                product: true
            }
        })


        res.send(itemsOnCart)
    } catch(err) {
        console.log(err)
        res.status(500).json({message: "Server error"})
    }
}
exports.deleteItemFromCart =  async(req, res) => {
    try {
        const { userId, productId} = req.body

        //find certain cart for certain user
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(userId)
            }
        })

        const itemOnCart = await prisma.productOnCart.findFirst({
            where: {
                productId: Number(productId),
                cartId: Number(cart.id)
            }
        })

        const remove = await prisma.productOnCart.delete({
            where: {
                id: Number(itemOnCart.id)
            }
        })
        res.send(remove)

    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Server error"})
    }
}