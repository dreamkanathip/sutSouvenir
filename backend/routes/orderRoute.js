const express = require('express');
const { 
    initOrder, 
    addOrderDetail, 
    getProductOnOrder, 
    getAllOrder, 
    getAllProductOnOrder, 
    cancelOrder, 
    getAllProductOnOrderByUserId, 
    getOrderStatusEnum, 
    changeOrderStatus, 
    getOrderById, 
    getOrders, 
    confirmOrder, 
    addTrackingNumber 
} = require('../controllers/orderController');
const { authenticateToken, authenticateAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/initialOrder",authenticateToken, initOrder)
router.post("/addOrderDetail",authenticateToken, addOrderDetail)
router.get("/productOnOrder/:id",authenticateToken, getProductOnOrder)
router.get("/productsOnOrders",authenticateToken, getAllProductOnOrder)
router.patch("/cancelOrder/:id",authenticateToken, cancelOrder)
router.get("/order-status-enum",authenticateToken, getOrderStatusEnum)
router.get("/order/:orderId", getOrderById)
router.patch("/updateOrderStatus", changeOrderStatus)
router.get('/orders', authenticateToken, authenticateAdmin, getOrders)
router.patch("/confirmOrder",authenticateToken, authenticateAdmin, confirmOrder)
router.patch("/addTracking",authenticateToken, authenticateAdmin, addTrackingNumber)

module.exports = router