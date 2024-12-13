const express = require('express');
const { initOrder, addOrderDetail, getProductOnOrder } = require('../controllers/orederController');
const router = express.Router();

router.post("/initialOrder", initOrder)
router.post("/addOrderDetail", addOrderDetail)
router.get("/productOnOrder/:id", getProductOnOrder)

module.exports = router