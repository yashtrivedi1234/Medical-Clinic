export default {
  ROLES: {
    PATIENT: "patient",
    ADMIN: "admin",
  },
  APPOINTMENT_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  },
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  JWT: {
    DEFAULT_EXPIRE: "7d",
  },
};
