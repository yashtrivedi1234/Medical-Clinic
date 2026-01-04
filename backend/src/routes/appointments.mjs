import express from "express";
import { body, validationResult } from "express-validator";
import Appointment from "../models/Appointment.mjs";
import Doctor from "../models/Doctor.mjs";
import { protect } from "../middleware/auth.mjs";
import { AppError } from "../utils/errorHandler.mjs";
import asyncHandler from "../utils/asyncHandler.mjs";
import constants from "../config/constants.mjs";

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments (filtered by user if patient)
// @access  Private
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    let query = {};

    // If patient, only show their appointments
    if (req.user.role === constants.ROLES.PATIENT) {
      query.user = req.user.id;
    }

    const appointments = await Appointment.find(query)
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

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res, next) => {
    let query = { _id: req.params.id };

    // If patient, ensure they own the appointment
    if (req.user.role === constants.ROLES.PATIENT) {
      query.user = req.user.id;
    }

    const appointment = await Appointment.findOne(query)
      .populate("doctor")
      .populate("service");

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

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Public
router.post(
  "/",
  [
    body("patientName")
      .trim()
      .notEmpty()
      .withMessage("Patient name is required"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("department")
      .trim()
      .notEmpty()
      .withMessage("Department is required"),
    body("doctor").notEmpty().withMessage("Doctor selection is required"),
    body("appointmentDate")
      .notEmpty()
      .withMessage("Appointment date is required"),
    body("appointmentTime")
      .trim()
      .notEmpty()
      .withMessage("Appointment time is required"),
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(req.body.doctor);
    if (!doctor || !doctor.isActive) {
      return next(
        new AppError("Doctor not found or not available", 404)
      );
    }

    // Check for duplicate appointments
    const existingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      status: {
        $in: [
          constants.APPOINTMENT_STATUS.PENDING,
          constants.APPOINTMENT_STATUS.CONFIRMED,
        ],
      },
    });

    if (existingAppointment) {
      return next(new AppError("This time slot is already booked", 400));
    }

    // Add user if authenticated
    const appointmentData = {
      ...req.body,
      user: req.user ? req.user.id : null,
    };

    const appointment = await Appointment.create(appointmentData);

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("doctor", "name specialization")
      .populate("service", "name");

    res.status(201).json({
      status: "success",
      data: {
        appointment: populatedAppointment,
      },
      message: "Appointment booked successfully",
    });
  })
);

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res, next) => {
    let query = { _id: req.params.id };

    // If patient, ensure they own the appointment
    if (req.user.role === constants.ROLES.PATIENT) {
      query.user = req.user.id;
    }

    const appointment = await Appointment.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("doctor", "name specialization")
      .populate("service", "name");

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

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res, next) => {
    let query = { _id: req.params.id };

    // If patient, ensure they own the appointment
    if (req.user.role === constants.ROLES.PATIENT) {
      query.user = req.user.id;
    }

    const appointment = await Appointment.findOneAndUpdate(
      query,
      { status: constants.APPOINTMENT_STATUS.CANCELLED },
      { new: true }
    );

    if (!appointment) {
      return next(new AppError("Appointment not found", 404));
    }

    res.json({
      status: "success",
      message: "Appointment cancelled",
    });
  })
);

export default router;
