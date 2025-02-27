const express = require("express");
const router = express.Router();

const {
    authenticateToken,
    authenticateAdmin,
    authenticateUser,
  } = require("../middlewares/authMiddleware");

const {
    createReview,
    listReview,
    getUserReview,
    removeReview,
    updateReview,
    listProductRating,
} = require("../controllers/reviewController");

router.post("/review/:pid", authenticateToken, createReview);
router.get("/review/:pid", listReview);
router.get("/userReview/", authenticateToken, getUserReview);
router.delete("/review/:rid", removeReview);
// router.put("/review/:pid", authenticateToken, updateReview);

router.get("/productRating", listProductRating);

module.exports = router;