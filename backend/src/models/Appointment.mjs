import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, "Please provide patient name"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Please provide phone number"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    lowercase: true,
    trim: true,
  },
  department: {
    type: String,
    required: [true, "Please select a department"],
    trim: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: [true, "Please select a doctor"],
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
  },
  appointmentDate: {
    type: Date,
    required: [true, "Please select appointment date"],
  },
  appointmentTime: {
    type: String,
    required: [true, "Please select appointment time"],
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  notes: {
    type: String,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1, doctor: 1 });

export default mongoose.model("Appointment", appointmentSchema);
