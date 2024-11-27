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
} = require("../controllers/productController");

// @ENDPOINT http://localhost:5000/api/product
router.post("/product", create);
router.get("/products", list);
router.get("/product/:id", read);
router.put("/product/:id", update);
router.delete("/product/:id", remove);
router.post("/productby", listby);
router.post("/search/filters", searchFilters);

module.exports = router;
