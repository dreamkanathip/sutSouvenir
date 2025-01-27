const prisma = require("../configs/prisma");

exports.createReview = async (req, res) => {
    try {
        const uid = req.user.id
        const { pid } = req.params;
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

    const productId = Number(pid);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId: productId,
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const filteredReviews = reviews.map((review) => {
      if (review.user) {
        const { password, ...filteredUser } = review.user; // ลบ password ออกจาก user
        review.user = filteredUser;
      }
      return review;
    });

    res.status(200).json({
      reviews: filteredReviews,
    });

  } catch (err) {
    console.error("Error in listReview:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const review = await prisma.review.findMany({
            where: {
                userId: Number(userId),
            },
            include: {
              product: {
                include: {
                  images: true,
                }
              },
            }
        })
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
    const { uid } = req.user.id
    const { pid } = req.params;
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

exports.listProductRating = async (req, res) => {
  try {
    const ratings = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        reviews: {
          select: {
            userId: true,
            star: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc", // เลือกรีวิวล่าสุดของแต่ละ user
          },
          distinct: ["userId"], // ใช้คะแนนล่าสุดจาก user แต่ละคน
        },
      },
    });

    const productRatings = ratings.map((product) => {
      const totalStars = product.reviews.reduce((sum, review) => sum + review.star, 0);
      const averageRating = product.reviews.length > 0 ? totalStars / product.reviews.length : 0;
      return {
        id: product.id,
        title: product.title,
        averageRating: parseFloat(averageRating.toFixed(1)), // ทศนิยม 1 ตำแหน่ง
      };
    });

    res.status(200).json(productRatings);
  } catch (err) {
    console.error("Error in listProductRating:", err);
    res.status(500).json({ message: "Server error occurred while listing Review Rating" });
  }
};

