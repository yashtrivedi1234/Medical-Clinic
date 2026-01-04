import express from "express";
import { body, validationResult } from "express-validator";
import Testimonial from "../models/Testimonial.mjs";
import { protect, authorize } from "../middleware/auth.mjs";
import { AppError } from "../utils/errorHandler.mjs";
import asyncHandler from "../utils/asyncHandler.mjs";
import constants from "../config/constants.mjs";

const router = express.Router();

// @route   GET /api/testimonials
// @desc    Get all approved testimonials
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find({ isApproved: true })
      .populate("doctor", "name specialization")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      status: "success",
      results: testimonials.length,
      data: {
        testimonials,
      },
    });
  })
);

// @route   POST /api/testimonials
// @desc    Create new testimonial
// @access  Public
router.post(
  "/",
  [
    body("patientName").trim().notEmpty().withMessage("Name is required"),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment").trim().notEmpty().withMessage("Comment is required"),
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        testimonial,
      },
      message:
        "Thank you for your feedback! It will be reviewed before publishing.",
    });
  })
);

// @route   PUT /api/testimonials/:id/approve
// @desc    Approve testimonial
// @access  Private/Admin
router.put(
  "/:id/approve",
  protect,
  authorize(constants.ROLES.ADMIN),
  asyncHandler(async (req, res, next) => {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!testimonial) {
      return next(new AppError("Testimonial not found", 404));
    }

    res.json({
      status: "success",
      data: {
        testimonial,
      },
    });
  })
);

// @route   DELETE /api/testimonials/:id
// @desc    Delete testimonial
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize(constants.ROLES.ADMIN),
  asyncHandler(async (req, res, next) => {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return next(new AppError("Testimonial not found", 404));
    }
    res.json({
      status: "success",
      message: "Testimonial deleted",
    });
  })
);

export default router;
