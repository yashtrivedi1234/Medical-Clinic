import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide service name"],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please provide service description"],
    trim: true,
  },
  icon: {
    type: String,
    default: "🏥",
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number, // in minutes
    default: 30,
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

export default mongoose.model("Service", serviceSchema);
