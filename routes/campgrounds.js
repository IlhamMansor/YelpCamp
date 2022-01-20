const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/CatchAsync");
const Campground = require("../models/campground");
const Joi = require("joi");
const ExpressError = require("../utils/ExpressError");

const validateCampground = (req, res, next) => {
  const campgroundSchema = Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
  });
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campground = await Campground.find({});
    res.render("campgrounds/index", { campground });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    if (!campground) {
      req.flash("error", "Cannot find the campground");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body);
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find the campground");
      res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body);
    req.flash("success", "Successfully update the campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
