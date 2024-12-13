const express = require("express");
const { 
    addDestBank, 
    addOriginBank,
    getDestBank,
    getOriginBank,
    deleteDestBank,
    deleteOriginbank,
    updateDestBank,
    updateOriginBank
} = require("../controllers/bankController");
const router = express.Router();

router.post("/destBank", addDestBank)
router.post("/originBank", addOriginBank)
router.get("/destBank", getDestBank)
router.get("/originBank", getOriginBank)
router.delete("/destBank/:id", deleteDestBank)
router.delete("/originBank/:id", deleteOriginbank)
router.put("/destBank/:id", updateDestBank)
router.put("/originBank/:id", updateOriginBank)

module.exports = router;
