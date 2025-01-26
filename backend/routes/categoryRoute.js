const express = require("express");
const router = express.Router();
const {
  create,
  list,
  getCategories,
  createCategory,
  remove,
  update,
} = require("../controllers/categoryController");

// @ENDPOINT http://localhost:5000/api/category
router.post("/category", create);
router.get("/category", list);
router.get("/categories", getCategories);
router.post("/add/categories", createCategory);
// Route สำหรับการลบหมวดหมู่
router.delete("/categories/:id", remove);

// Route สำหรับการแก้ไขหมวดหมู่
router.put("/edit/category/:id", update);

module.exports = router;
