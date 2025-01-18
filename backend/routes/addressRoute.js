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
} = require("../controllers/addressController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// @ENDPOINT http://localhost:5000/api/address
router.post("/address/:uid", authenticateToken, create);
router.get("/listAddress/:uid", authenticateToken, list);
router.get("/address/:id", authenticateToken, read);
router.get("/address/getDefaultAddr/:uid", authenticateToken, getDefaultAddress)
router.patch("/address/default/:id", authenticateToken, defaultAddress);
router.put("/address/:uid/:id", authenticateToken, update);
router.delete("/address/:id", authenticateToken, remove);

module.exports = router;
