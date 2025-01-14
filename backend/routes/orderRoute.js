const express = require('express');
const { initOrder, addOrderDetail, getProductOnOrder, getAllOrder, getAllProductOnOrder, cancelOrder } = require('../controllers/orederController');
const router = express.Router();

router.post("/initialOrder", initOrder)
router.post("/addOrderDetail", addOrderDetail)
router.get("/productOnOrder/:id", getProductOnOrder)
router.get("/orders", getAllOrder)
router.get("/productOnOrder", getAllProductOnOrder)
router.patch("/cancelOrder/:id", cancelOrder)

module.exports = router