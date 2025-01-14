const express = require("express");
const router = express.Router();
const {
  create,
  list,
  remove,
  getCategories,
} = require("../controllers/categoryController");

// @ENDPOINT http://localhost:5000/api/category
router.post("/category", create);
router.get("/category", list);
router.delete("/category/:id", remove);
// กำหนด route สำหรับดึงข้อมูลหมวดหมู่
router.get("/categories", getCategories);

module.exports = router;
