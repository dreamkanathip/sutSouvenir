const express = require('express');
const { initOrder, addOrderDetail, getProductOnOrder, getAllOrder, getAllProductOnOrder, cancelOrder, getAllProductOnOrderByUserId, getOrderStatusEnum } = require('../controllers/orederController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/initialOrder", initOrder)
router.post("/addOrderDetail", addOrderDetail)
router.get("/productOnOrder/:id", getProductOnOrder)
router.get("/productsOnOrders", getAllProductOnOrder)
router.patch("/cancelOrder/:id", cancelOrder)
router.get("/order-status-enum", getOrderStatusEnum)
module.exports = router