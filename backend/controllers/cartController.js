const prisma = require('../configs/prisma');

//initial cart for user
exports.initial = async(req, res) => {
    try {
        const { cartTotal } = req.body;
        const userId = req.user.id
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
    // delete by user id
    try {
        const userId = req.user.id;
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(userId)
            }
        })
        await prisma.cart.delete({
            where: {
                id: Number(cart.id)
            }
        });
        res.json({message: "Delete success"})
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }   
}

//when user add product to cart by user id and product id
exports.addItemToCart = async(req, res) => {
    try {
        const { productId, quantity } = req.body
        const userId = req.user.id

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid input" });
        }
        
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(userId)
            }
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    userId: Number(userId),
                    cartTotal: 0, // Initialize with 0, will update later
                },
            });
        }

        //find certain cart and product for certain user
        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId)
            }
        })

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        if (Number(quantity) > product.quantity) {
            return res.status(400).json({ message: "Requested quantity exceeds available stock" });
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

        const expirationTime = new Date();
        expirationTime.setDate(expirationTime.getDate() + 3);

        const [addItem, updateCartTotal, updateProductAmount] = await prisma.$transaction([
            prisma.productOnCart.create({
                data: {
                    cartId: Number(cart.id),
                    productId: productId,
                    quantity: Number(quantity),
                    price: product.price*quantity,
                    expire: expirationTime
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
        res.status(200).json({
            success: true,
            data: {
                addItem,
                updateCartTotal,
                updateProductAmount
            }
        });  
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error", err});
    }
}

exports.decreaseProductOnCart = async(req, res) => {
    try {
        const { productId} = req.body
        const userId = req.user.id
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(userId)
            },
        })
        const productOnCart = await prisma.productOnCart.findFirst({
            where: {
                cartId: Number(cart.id),
                productId: productId
            },
            include: {
                product: true
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
                    },
                    price: {
                        decrement: Number(productOnCart.product.price)
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
        const { productId} = req.body
        const userId = req.user.id
        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(userId)
            }
        })
        const productOnCart = await prisma.productOnCart.findFirst({
            where: {
                cartId: Number(cart.id),
                productId: productId
            },
            include: {
                product: true
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
                    },
                    price: {
                        increment: Number(productOnCart.product.price)
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
        // const { userId } = req.params;
        const userId = req.user.id

        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(userId)
            }
        })
        res.send(cart)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error"});
    }
}

//to see product on specify cart
exports.getItemsOnCart = async(req, res) => {
    try {
        // const { id } = req.params;
        const userId = req.user.id

        const cart = await prisma.cart.findFirst({
            where: {
                userId: Number(userId)
            }
        })

        if(!cart) {
            return res.json({ message: "Cart not found" });
        }

        const itemsOnCart = await prisma.productOnCart.findMany({
            where: {
                cartId: Number(cart.id)
            },
            include: {
                product: {
                    include: {
                      category: true,
                      images: true,
                    },
                  },
            }
        })
        res.status(200).send(itemsOnCart)
    } catch(err) {
        console.log(err)
        res.status(500).json({message: "Server error"})
    }
}

exports.deleteItemFromCart =  async(req, res) => {
    try {
        const { productId } = req.params
        const userId = req.user.id
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

exports.removeItemWithoutRestock = async(req, res) => {
    try {
        const { productId } = req.params
        const userId = req.user.id
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

        const removeItem = await prisma.productOnCart.delete({
            where: {
                id: Number(itemOnCart.id)
            }
        })

        res.json({ message: "Item removed from cart", removeItem});
    } catch (err) {
        res.status(500).json({message: "Server error", err})
    }
}


const deleteExpiredCartItems = async() => {
    const now = new Date();
    try {
        const expiredItems = await prisma.productOnCart.findMany({
            where: {
              expire: {
                lt: now,
              },
            },
            include: {
              product: true,
            },
        });
        for (const item of expiredItems) {
            await prisma.product.update({
                where: { 
                    id: Number(item.productId) 
                },
                data: {
                    quantity: { 
                        increment: item.quantity, 
                    }
                }
            })
        }

        await prisma.productOnCart.deleteMany({
            where: {
                expire: {
                    lt: now
                }
            }
        })
    } catch (err) {
        console.error('Failed to delete expired items:', err);
    }
}

setInterval(deleteExpiredCartItems, 6000);