import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.mjs";
import Appointment from "../models/Appointment.mjs";
import { protect } from "../middleware/auth.mjs";
import { AppError } from "../utils/errorHandler.mjs";
import asyncHandler from "../utils/asyncHandler.mjs";

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get(
  "/profile",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
      .populate("appointments")
      .select("-password");

    res.json({
      status: "success",
      data: {
        user,
      },
    });
  })
);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("phone").optional().trim(),
    body("dateOfBirth").optional().isISO8601().withMessage("Invalid date format"),
    body("gender").optional().isIn(["male", "female", "other"]),
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      status: "success",
      data: {
        user,
      },
    });
  })
);

// @route   GET /api/user/appointments
// @desc    Get user appointments
// @access  Private
router.get(
  "/appointments",
  asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ user: req.user.id })
      .populate("doctor", "name specialization")
      .populate("service", "name")
      .sort({ appointmentDate: -1, appointmentTime: 1 });

    res.json({
      status: "success",
      results: appointments.length,
      data: {
        appointments,
      },
    });
  })
);

// @route   GET /api/user/medical-records
// @desc    Get user medical records
// @access  Private
router.get(
  "/medical-records",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("medicalHistory");

    res.json({
      status: "success",
      data: {
        medicalHistory: user.medicalHistory || [],
      },
    });
  })
);

export default router;
