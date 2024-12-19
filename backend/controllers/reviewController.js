const prisma = require("../configs/prisma");

exports.createReview = async (req, res) => {
    try {
        const { uid, pid } = req.params;
        const { comment, star } = req.body

        const user = await prisma.user.findFirst({
            where: {
            id: Number(uid),
            },
        });
    
        if (!user || !user.enabled) {
            return res.status(404).json({ message: "User Not found or not Enabled" });
        }

        const product = await prisma.product.findFirst({
            where: {
                id: Number(pid)
            }
        })

        if(!product) {
            return res.status(404).json({ message: "Product Not found" });
        }

        const review = prisma.review.create({
            data : {
                comment: comment,
                star: star,
                user: {
                    connect: { id: user.id },
                },
                product: {
                    connect: { id: product.id }
                }
            }
        })
        return res.status(200).send({ message: "Review Created Successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.listReview = async (req, res) => {
    try {
      const { pid } = req.params;
      const reviews = await prisma.review.findMany({
        where: {
          id: Number(pid),
        },
        orderBy: { createdAt: "desc" },
      });
      res.send(reviews);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
};

exports.getReview = async (req, res) => {
    try {
        const { uid, pid } = req.params;
        const review = await prisma.review.findFirst({
            where: {
                userId: Number(uid),
                productId: Number(pid)
            }
        })
        if (!review) {
            return res.status(404).json({ message: "No Review Found" })
        }
        res.send(review)
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

exports.removeReview = async (req, res) => {
    try {
      const { rid } = req.params;
  
      await prisma.review.delete({
        where: {
          id: Number(rid),
        },
      });
  
      res.status(200).json({ message: "Review Deleted Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
};

exports.updateReview = async (req, res) => {
  try {
    const { uid, pid } = req.params;
    const { id, comment, star } = req.body

    const user = await prisma.user.findFirst({
      where: {
        id: Number(uid),
      },
    });

    if (!user || !user.enabled) {
      return res.status(404).json({ message: "User Not found or not Enabled" });
    }

    const product = await prisma.product.findFirst({
        where: {
            id: Number(pid)
        }
    })

    if(!product) {
        return res.status(404).json({ message: "Product Not found" });
    }

    const oldReview = prisma.review.findFirst({
      where: { 
        id: Number(id) 
      }
    })

    if (!oldReview) {
      return res.status(404).json({ message: "Old Review Not Found" })
    }

    const review = prisma.review.update({
      where: {
        id: Number(id),
      },
      data : {
          comment: comment,
          star: star,
          user: {
              connect: { id: user.id },
          },
          product: {
              connect: { id: product.id }
          }
      }
    })
    res.status(200).json({ message: "Address Updated Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};