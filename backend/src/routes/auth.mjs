import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.mjs";
import { protect } from "../middleware/auth.mjs";
import { AppError } from "../utils/errorHandler.mjs";
import asyncHandler from "../utils/asyncHandler.mjs";
import { authLimiter } from "../middleware/rateLimiter.mjs";
import constants from "../config/constants.mjs";
import { sendVerificationEmail } from "../utils/emailService.mjs";
import { generateEmailVerificationToken } from "../utils/generateToken.mjs";
import passport from "passport";

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || constants.JWT.DEFAULT_EXPIRE,
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { name, email, phone, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError("User already exists", 400));
    }

    // Generate email verification token
    const emailVerificationToken = generateEmailVerificationToken();
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      emailVerificationToken,
      emailVerificationExpires,
    });

    // Send verification email
    try {
      await sendVerificationEmail(user, emailVerificationToken);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Continue even if email fails
    }

    res.status(201).json({
      status: "success",
      message: "Registration successful! Please check your email to verify your account.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  })
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Invalid credentials", 401));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Invalid credentials", 401));
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return next(
        new AppError(
          "Please verify your email address before logging in. Check your inbox for the verification link.",
          401
        )
      );
    }

    const token = generateToken(user._id);

    res.json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  })
);

// @route   GET /api/auth/verify-email/:token
// @desc    Verify email address
// @access  Public
router.get(
  "/verify-email/:token",
  asyncHandler(async (req, res, next) => {
    const { token } = req.params;

    // Find user with this token and check if it's not expired
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      return next(new AppError("Invalid or expired verification token", 400));
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const jwtToken = generateToken(user._id);

    res.json({
      status: "success",
      message: "Email verified successfully!",
      token: jwtToken,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });
  })
);

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post(
  "/resend-verification",
  authLimiter,
  [body("email").isEmail().withMessage("Please provide a valid email")],
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { email } = req.body;
    const user = await User.findOne({ email }).select(
      "+emailVerificationToken +emailVerificationExpires"
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.isEmailVerified) {
      return next(new AppError("Email already verified", 400));
    }

    // Generate new token
    const emailVerificationToken = generateEmailVerificationToken();
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      await sendVerificationEmail(user, emailVerificationToken);
      res.json({
        status: "success",
        message: "Verification email sent! Please check your inbox.",
      });
    } catch (error) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError("Failed to send email. Please try again.", 500));
    }
  })
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate("appointments");
    res.json({
      status: "success",
      data: {
        user,
      },
    });
  })
);

// @route   GET /api/auth/google
// @desc    Initiate Google OAuth
// @access  Public
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  asyncHandler(async (req, res) => {
    const token = generateToken(req.user._id);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(
      `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          isEmailVerified: req.user.isEmailVerified,
        })
      )}`
    );
  })
);

export default router;

