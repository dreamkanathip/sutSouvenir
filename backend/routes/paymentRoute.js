const express = require("express");
const {
  uploadReceipt,
  getPayment,
} = require("../controllers/orderController");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage(); // Store files in memory for base64 conversion
const upload = multer({ storage });

router.post("/payment", upload.single("receipt"), uploadReceipt);
router.get("/allPayment", getPayment);

module.exports = router;
