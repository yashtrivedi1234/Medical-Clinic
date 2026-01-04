import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide doctor name"],
    trim: true,
  },
  specialization: {
    type: String,
    required: [true, "Please provide specialization"],
    trim: true,
  },
  qualification: {
    type: String,
    required: true,
    trim: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  bio: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  availability: {
    monday: { available: Boolean, slots: [String] },
    tuesday: { available: Boolean, slots: [String] },
    wednesday: { available: Boolean, slots: [String] },
    thursday: { available: Boolean, slots: [String] },
    friday: { available: Boolean, slots: [String] },
    saturday: { available: Boolean, slots: [String] },
    sunday: { available: Boolean, slots: [String] },
  },
  consultationFee: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Doctor", doctorSchema);
