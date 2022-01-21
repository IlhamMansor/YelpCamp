const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/CatchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.updateReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
