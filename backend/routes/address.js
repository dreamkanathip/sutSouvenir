const express = require("express");
const router = express.Router();

const {
    create,
    list,
    read,
    defaultAddress,
    update,
    remove,
}  = require("../controllers/address");

// @ENDPOINT http://localhost:5000/api/address
router.post("/address/:uid", create);
router.get("/listAddress/:uid", list);
router.get("/address/:id", read);
router.patch("/address/default/:id", defaultAddress);
router.put("/address/:uid/:id", update);
router.delete("/address/:id", remove);

module.exports = router;