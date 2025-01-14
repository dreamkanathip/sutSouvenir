const express = require('express');
const router = express.Router();
const {
    createShipping,
    getAllShipping,
    getShippingById,
    updateShipping,
    deleteShipping
} = require('../controllers/shippingController');

router.post('/shipping', createShipping);
router.get('/shippings', getAllShipping);
router.get('/shipping/:id', getShippingById);
router.put('/shipping/:id', updateShipping);
router.delete('/shipping/:id', deleteShipping);

module.exports = router;
