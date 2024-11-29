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
    increaseProductOnCart
} = require('../controllers/cartController');


router.get('/itemsOnCart/:id', getItemsOnCart);
router.get('/allCarts', getAllCarts);
router.get('/cart/:userId', getCartById)
router.post('/initialCart', initial);
router.delete('/cart/:userId', deleteCart);
router.delete('/deleteItemFromCart', deleteItemFromCart)
router.post('/addToCart', addItemToCart);
router.patch('/decreaseProductOnCart', decreaseProductOnCart)
router.patch('/increaseProductOnCart', increaseProductOnCart)

module.exports = router;
