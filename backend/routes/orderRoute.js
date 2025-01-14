const express = require('express');
const { initOrder, addOrderDetail, getProductOnOrder, getAllOrder, getAllProductOnOrder } = require('../controllers/orederController');
const router = express.Router();

router.post("/initialOrder", initOrder)
router.post("/addOrderDetail", addOrderDetail)
router.get("/productOnOrder/:id", getProductOnOrder)
router.get("/orders", getAllOrder)
router.get("/productOnOrder", getAllProductOnOrder)

module.exports = router