import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, "Please provide patient name"],
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, "Please provide a testimonial"],
    trim: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Testimonial", testimonialSchema);
