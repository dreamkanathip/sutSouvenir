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
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        })
        const cart = await prisma.cart.findFirst({
            where: {
                userId: userId
            }
        })

        //check if item exist
        const checkItem = await prisma.productOnCart.findFirst({
            where: {
                productId: productId,
                cartId: cart.id
            }
        })

        //if found, update amount instead
        if(checkItem) {

            const [updateAmount, updateCartTotal] = await prisma.$transaction([
                prisma.productOnCart.update({
                    where: {
                        id: checkItem.id
                    },
                    data: {
                        quantity: {
                            increment: quantity
                        },
                        price: {
                            increment: product.price*quantity
                        }
                    }
                }),
                prisma.cart.update({
                    where: {
                        id: cart.id
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
                    cartId: cart.id,
                    productId: productId,
                    quantity: quantity,
                    price: product.price*quantity
                }
            }),
            prisma.cart.update({
                where: {
                    id: cart.id
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