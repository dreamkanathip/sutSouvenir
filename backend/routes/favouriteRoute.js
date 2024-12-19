const express = require("express");
const router = express.Router();
const {
  likeProduct,
  getLikeProducts,
} = require("../controllers/favouriteController");

// POST - กดถูกใจสินค้า
router.post("/favourite", likeProduct);
router.get("/favourites", getLikeProducts);

module.exports = router;
