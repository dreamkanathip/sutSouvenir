const express = require("express");
const router = express.Router();

const {
    createReview,
    listReview,
    getReview,
    removeReview,
    updateReview,
} = require("../controllers/reviewController");

router.post("/review/:pid/:uid", createReview);
router.get("/review/:pid", listReview);
router.get("/review/:pid/:uid", getReview);
router.delete("/review/:rid", removeReview);
router.put("/review/:pid/:uid", updateReview)

module.exports = router;