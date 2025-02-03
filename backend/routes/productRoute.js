const express = require("express");
const router = express.Router();
// Controllers
const {
  create,
  list,
  read,
  update,
  remove,
  listby,
  searchFilters,
  uploadImage,
  getProductImage,
} = require("../controllers/productController");

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// @ENDPOINT http://localhost:5000/api/product
router.post("/product", create);
router.get("/products", list);
router.get("/product/:id", read);
router.patch("/product/:id", update);
router.delete("/product/:id", remove);
router.post("/productby", listby);
router.post("/search/filters", searchFilters);
router.post("/productImage", upload.single("image"), uploadImage);
router.get("/productImage/:id", getProductImage); // รับ id ของภาพ

module.exports = router;
