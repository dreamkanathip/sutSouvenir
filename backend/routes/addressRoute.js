const express = require("express");
const router = express.Router();

const {
  create,
  list,
  read,
  defaultAddress,
  update,
  remove,
  getDefaultAddress,
  getData,
} = require("../controllers/addressController");

const { authenticateToken } = require("../middlewares/authMiddleware");

// @ENDPOINT http://localhost:5000/api/address
router.post("/address", authenticateToken, create);
router.get("/listAddress", authenticateToken, list);
router.get("/address/:id", read);
router.get("/defaultAddress", authenticateToken, getDefaultAddress)
router.patch("/address/default/:id", defaultAddress);
router.put("/address/:id", authenticateToken, update);
router.delete("/address/:id", remove);
// router.get('/test', getData)

module.exports = router;
