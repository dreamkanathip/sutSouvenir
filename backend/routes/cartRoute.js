const express = require("express");
const router = express.Router();
const {
    addItemToCart,
    getItemsOnCart,
    getAllCarts,
    initial,
    deleteCart,
    getCartById,
    deleteItemFromCart,
    decreaseProductOnCart,
    increaseProductOnCart,
    removeItemWithoutRestock
} = require('../controllers/cartController');
const {
    authenticateToken,
    authenticateAdmin,
    authenticateUser,
  } = require("../middlewares/authMiddleware");

router.get('/itemsOnCart',authenticateToken, getItemsOnCart);
router.get('/allCarts',authenticateToken, getAllCarts);
router.get('/cart/',authenticateToken,getCartById);
router.post('/initialCart',authenticateToken, initial);
router.delete('/cart/:userId',authenticateToken, deleteCart);
router.delete('/deleteItemFromCart/:productId',authenticateToken, deleteItemFromCart)
router.delete('/deleteItemWithoutRestock/:productId',authenticateToken, removeItemWithoutRestock)
router.post('/addToCart',authenticateToken, addItemToCart);
router.patch('/decreaseProductOnCart',authenticateToken, decreaseProductOnCart)
router.patch('/increaseProductOnCart',authenticateToken, increaseProductOnCart)

module.exports = router;
