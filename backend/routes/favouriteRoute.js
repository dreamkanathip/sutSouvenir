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
router.post("/favourites/:userId", authenticateToken, likeProduct);
router.get("/favourites/:userId", authenticateToken, getLikeProducts);
router.get("/favourites/:userId/:productId", authenticateToken, checkLikeProduct)
router.delete("/favourites/:userId/:productId", authenticateToken, unLikeProduct)

module.exports = router;
