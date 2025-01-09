const express = require('express');
const { initOrder, addOrderDetail, getProductOnOrder, cancelOrder } = require('../controllers/orederController');
const router = express.Router();

router.post("/initialOrder", initOrder)
router.post("/addOrderDetail", addOrderDetail)
router.get("/productOnOrder/:id", getProductOnOrder)
router.patch("/cancelOrder/:id", cancelOrder)

module.exports = router