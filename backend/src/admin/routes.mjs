import express from "express";
import Appointment from "../models/Appointment.mjs";
import Doctor from "../models/Doctor.mjs";
import Service from "../models/Service.mjs";
import User from "../models/User.mjs";
import Testimonial from "../models/Testimonial.mjs";
import { protect, authorize } from "../middleware/auth.mjs";
import { AppError } from "../utils/errorHandler.mjs";
import asyncHandler from "../utils/asyncHandler.mjs";
import constants from "../config/constants.mjs";

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize(constants.ROLES.ADMIN));

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get(
  "/dashboard",
  asyncHandler(async (req, res) => {
    const [
      totalAppointments,
      pendingAppointments,
      totalDoctors,
      totalPatients,
      totalServices,
      recentAppointments,
    ] = await Promise.all([
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: constants.APPOINTMENT_STATUS.PENDING }),
      Doctor.countDocuments({ isActive: true }),
      User.countDocuments({ role: constants.ROLES.PATIENT }),
      Service.countDocuments({ isActive: true }),
      Appointment.find()
        .populate("doctor", "name")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    res.json({
      status: "success",
      data: {
        stats: {
          totalAppointments,
          pendingAppointments,
          totalDoctors,
          totalPatients,
          totalServices,
        },
        recentAppointments,
      },
    });
  })
);

// @route   GET /api/admin/appointments
// @desc    Get all appointments (admin view)
// @access  Private/Admin
router.get(
  "/appointments",
  asyncHandler(async (req, res) => {
    const appointments = await Appointment.find()
      .populate("doctor", "name specialization")
      .populate("user", "name email phone")
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

// @route   PUT /api/admin/appointments/:id/status
// @desc    Update appointment status
// @access  Private/Admin
router.put(
  "/appointments/:id/status",
  asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    const validStatuses = Object.values(constants.APPOINTMENT_STATUS);

    if (!validStatuses.includes(status)) {
      return next(new AppError("Invalid status", 400));
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("doctor", "name")
      .populate("user", "name email");

    if (!appointment) {
      return next(new AppError("Appointment not found", 404));
    }

    res.json({
      status: "success",
      data: {
        appointment,
      },
    });
  })
);

// @route   GET /api/admin/testimonials
// @desc    Get all testimonials (including unapproved)
// @access  Private/Admin
router.get(
  "/testimonials",
  asyncHandler(async (req, res) => {
    const testimonials = await Testimonial.find()
      .populate("doctor", "name")
      .sort({ createdAt: -1 });

    res.json({
      status: "success",
      results: testimonials.length,
      data: {
        testimonials,
      },
    });
  })
);

export default router;
