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

        const review = await prisma.review.create({
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
        return res.status(200).send({ message: "Review Created Successfully"} )
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
          productId: Number(pid),
        },
        include: {
          user: true
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
    const { id, comment, star } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "ID รีวิวไม่ถูกต้อง" });
    }

    if (!star || isNaN(star) || star < 1 || star > 5) {
      return res.status(400).json({ message: "คะแนนต้องอยู่ระหว่าง 1 ถึง 5" });
    }

    const oldReview = await prisma.review.findFirst({
      where: { id: Number(id) },
    });
    if (!oldReview) {
      return res.status(404).json({ message: "ไม่พบรีวิวเก่า" });
    }

    const review = await prisma.review.update({
      where: { id: Number(id) },
      data: {
        comment,
        star,
        user: { connect: { id: Number(uid) } },
        product: { connect: { id: Number(pid) } },
      },
    });

    res.status(200).json({ message: "Review updated successfully" });
  } catch (err) {
    console.error("Error in updateReview:", err);
    res.status(500).json({ message: "Server error occurred while updating review" });
  }
};
