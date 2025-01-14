const express = require("express");
const router = express.Router();
const {
  likeProduct,
  getLikeProducts,
  unLikeProduct,
  checkLikeProduct,
} = require("../controllers/favouriteController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// POST - กดถูกใจสินค้า
router.post("/favourites/:userId", likeProduct);
router.get("/favourites/:userId", getLikeProducts);
router.get("/favourites/:userId/:productId", checkLikeProduct)
router.delete("/favourites/:userId/:productId", unLikeProduct)

module.exports = router;
