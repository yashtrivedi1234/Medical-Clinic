import express from "express";
import { body, validationResult } from "express-validator";
import Service from "../models/Service.mjs";
import { protect, authorize } from "../middleware/auth.mjs";
import { AppError } from "../utils/errorHandler.mjs";
import asyncHandler from "../utils/asyncHandler.mjs";
import constants from "../config/constants.mjs";

const router = express.Router();

// @route   GET /api/services
// @desc    Get all services
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { department } = req.query;
    let query = { isActive: true };

    if (department) query.department = department;

    const services = await Service.find(query).sort({ name: 1 });
    res.json({
      status: "success",
      results: services.length,
      data: {
        services,
      },
    });
  })
);

// @route   GET /api/services/:id
// @desc    Get single service
// @access  Public
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return next(new AppError("Service not found", 404));
    }
    res.json({
      status: "success",
      data: {
        service,
      },
    });
  })
);

// @route   POST /api/services
// @desc    Create new service
// @access  Private/Admin
router.post(
  "/",
  protect,
  authorize(constants.ROLES.ADMIN),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("department").trim().notEmpty().withMessage("Department is required"),
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const service = await Service.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        service,
      },
    });
  })
);

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize(constants.ROLES.ADMIN),
  asyncHandler(async (req, res, next) => {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return next(new AppError("Service not found", 404));
    }
    res.json({
      status: "success",
      data: {
        service,
      },
    });
  })
);

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize(constants.ROLES.ADMIN),
  asyncHandler(async (req, res, next) => {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) {
      return next(new AppError("Service not found", 404));
    }
    res.json({
      status: "success",
      message: "Service deactivated",
    });
  })
);

export default router;
