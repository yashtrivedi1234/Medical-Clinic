export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  DOCTORS: "/doctors",
  SERVICES: "/services",
  APPOINTMENTS: "/appointments",
  CONTACT: "/contact",
  PORTAL: "/portal",
  ADMIN: "/admin",
};

export const USER_ROLES = {
  PATIENT: "patient",
  ADMIN: "admin",
};

export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export const SERVICE_ICONS = {
  "General Medicine": "🏥",
  Pediatrics: "👶",
  Orthopedics: "🦴",
  Gynecology: "👩",
  Cardiology: "❤️",
  Diagnostics: "🔬",
  Dermatology: "🧴",
  Neurology: "🧠",
  Oncology: "🎗️",
};

