import express from "express";
import { body, validationResult } from "express-validator";
import Doctor from "../models/Doctor.mjs";
import { protect, authorize } from "../middleware/auth.mjs";
import { AppError } from "../utils/errorHandler.mjs";
import asyncHandler from "../utils/asyncHandler.mjs";
import constants from "../config/constants.mjs";

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { department, specialization } = req.query;
    let query = { isActive: true };

    if (department) query.department = department;
    if (specialization)
      query.specialization = new RegExp(specialization, "i");

    const doctors = await Doctor.find(query).sort({ experience: -1 });
    res.json({
      status: "success",
      results: doctors.length,
      data: {
        doctors,
      },
    });
  })
);

// @route   GET /api/doctors/:id
// @desc    Get single doctor
// @access  Public
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return next(new AppError("Doctor not found", 404));
    }
    res.json({
      status: "success",
      data: {
        doctor,
      },
    });
  })
);

// @route   POST /api/doctors
// @desc    Create new doctor
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize(constants.ROLES.ADMIN),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("specialization")
      .trim()
      .notEmpty()
      .withMessage("Specialization is required"),
    body("department").trim().notEmpty().withMessage("Department is required"),
    body("experience")
      .isNumeric()
      .withMessage("Experience must be a number"),
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const doctor = await Doctor.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        doctor,
      },
    });
  })
);

// @route   PUT /api/doctors/:id
// @desc    Update doctor
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize(constants.ROLES.ADMIN),
  asyncHandler(async (req, res, next) => {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doctor) {
      return next(new AppError("Doctor not found", 404));
    }
    res.json({
      status: "success",
      data: {
        doctor,
      },
    });
  })
);

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize(constants.ROLES.ADMIN),
  asyncHandler(async (req, res, next) => {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!doctor) {
      return next(new AppError("Doctor not found", 404));
    }
    res.json({
      status: "success",
      message: "Doctor deactivated",
    });
  })
);

export default router;
