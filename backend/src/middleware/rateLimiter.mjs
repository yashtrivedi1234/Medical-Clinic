import rateLimit from "express-rate-limit";
import constants from "../config/constants.mjs";

const limiter = rateLimit({
  windowMs: constants.RATE_LIMIT.WINDOW_MS,
  max: constants.RATE_LIMIT.MAX_REQUESTS,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: "Too many login attempts, please try again after 15 minutes.",
  },
  skipSuccessfulRequests: true,
});

export { limiter };
