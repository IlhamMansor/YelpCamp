const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require("../models/review");
const Joi = require("joi");
const catchAsync = require("../utils/CatchAsync");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  const reviewSchema = Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  });
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Added your review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted your review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
