const prisma = require('../config/prisma');

//initial cart for user
exports.initial = async(req, res) => {
    try {
        const { userId, cartTotal } = req.body;
        const cart = await prisma.cart.create({
            data: {
                userId: Number(userId),
                cartTotal: Number(cartTotal)
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
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        //check if item exist
        const checkItem = await prisma.productOnCart.findFirst({
            where: {
                productId: Number(productId),
                cartId: Number(cart.id)
            }
        })
        //if found, update amount instead
        if(checkItem) {
            const [updateAmount, updateCartTotal, updateProductAmount] = await prisma.$transaction([
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
                }),
                prisma.product.update({
                    where: {
                        id: Number(productId)
                    },
                    data: {       
                        quantity: {
                            decrement: Number(quantity)
                        }
                    }
                })
            ])

           return res.json({
                updateAmount, updateCartTotal, updateProductAmount
            })
        }

        const [addItem, updateCartTotal, updateProductAmount] = await prisma.$transaction([
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
            }),
            prisma.product.update({
                where: {
                    id: Number(productId)
                },
                data: {       
                    quantity: {
                        decrement: Number(quantity)
                    }
                }
            })
        ])
        res.json({
            addItem, updateCartTotal, updateProductAmount
        });  
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}
exports.decreaseProductOnCart = async(req, res) => {
    try {
        const { userId, productId} = req.body
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(userId)
            }
        })
        const productOnCart = await prisma.productOnCart.findFirst({
            where: {
                cartId: Number(cart.id),
                productId: productId
            }
        })
        const [decreaseProductOnCart, increaseProductQuantity] = await prisma.$transaction([
            prisma.productOnCart.update({
                where: {
                    id: Number(productOnCart.id)
                },
                data: {
                    quantity: {
                        decrement: Number(1)
                    }
                }
            }),
            prisma.product.update({
                where: {
                    id: Number(productId)
                },
                data: {
                    quantity: {
                        increment: Number(1)
                    }
                }
            })
        ])
        res.json({
            decreaseProductOnCart, increaseProductQuantity
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}
exports.increaseProductOnCart = async(req, res) => {
    try {
        const { userId, productId} = req.body
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(userId)
            }
        })
        const productOnCart = await prisma.productOnCart.findFirst({
            where: {
                cartId: Number(cart.id),
                productId: productId
            }
        })
        const [increaseProductOnCart, decreaseProductQuantity] = await prisma.$transaction([
            prisma.productOnCart.update({
                where: {
                    id: Number(productOnCart.id)
                },
                data: {
                    quantity: {
                        increment: Number(1)
                    }
                }
            }),
            prisma.product.update({
                where: {
                    id: Number(productId)
                },
                data: {
                    quantity: {
                        decrement: Number(1)
                    }
                }
            })
        ])
        res.json({
            increaseProductOnCart, decreaseProductQuantity
        })
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

        const [removeItem, restoreStock] = await prisma.$transaction([
            prisma.productOnCart.delete({
                where: {
                    id: Number(itemOnCart.id)
                }
            }),
            prisma.product.update({
                where: { id: Number(productId) },
                data: {
                    quantity: { increment: itemOnCart.quantity }
                }
            })
        ])
        res.json({ message: "Item removed from cart", removeItem, restoreStock });
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Server error"})
    }
}