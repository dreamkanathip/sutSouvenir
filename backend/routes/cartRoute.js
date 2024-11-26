const express = require("express");
const router = express.Router();

const {
  addItemToCart,
  getItemsOnCart,
  getAllCarts,
  initial,
  deleteCart,
} = require("../controllers/cartController");

router.get("/itemsOnCart/:id", getItemsOnCart);
router.get("/allCarts", getAllCarts);
router.post("/initialCart", initial);
router.delete("/cart/:id", deleteCart);
router.post("/addToCart", addItemToCart);

module.exports = router;
