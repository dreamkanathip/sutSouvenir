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
router.post("/favourites", authenticateToken, likeProduct);
router.get("/favourites", authenticateToken, getLikeProducts);
router.get("/favourites/:productId", authenticateToken, checkLikeProduct)
router.delete("/favourites/:productId", authenticateToken, unLikeProduct)

module.exports = router;
