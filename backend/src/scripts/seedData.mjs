import mongoose from "mongoose";
import dotenv from "dotenv";
import Doctor from "../models/Doctor.mjs";
import Service from "../models/Service.mjs";
import Testimonial from "../models/Testimonial.mjs";

dotenv.config();

const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    qualification: "MD, FACC",
    experience: 15,
    bio: "Expert in cardiovascular diseases with over 15 years of experience.",
    department: "Cardiology",
    consultationFee: 200,
    rating: 4.8,
    isActive: true,
  },
  {
    name: "Dr. Michael Chen",
    specialization: "Pediatrician",
    qualification: "MD, FAAP",
    experience: 12,
    bio: "Dedicated pediatrician specializing in child healthcare and development.",
    department: "Pediatrics",
    consultationFee: 150,
    rating: 4.9,
    isActive: true,
  },
  {
    name: "Dr. Emily Rodriguez",
    specialization: "Orthopedic Surgeon",
    qualification: "MD, FACS",
    experience: 18,
    bio: "Specialized in bone and joint surgeries with excellent patient outcomes.",
    department: "Orthopedics",
    consultationFee: 250,
    rating: 4.7,
    isActive: true,
  },
  {
    name: "Dr. James Wilson",
    specialization: "General Medicine",
    qualification: "MD",
    experience: 20,
    bio: "Experienced general practitioner providing comprehensive primary care.",
    department: "General Medicine",
    consultationFee: 120,
    rating: 4.6,
    isActive: true,
  },
  {
    name: "Dr. Lisa Anderson",
    specialization: "Gynecologist",
    qualification: "MD, FACOG",
    experience: 14,
    bio: "Expert in women's health and reproductive medicine.",
    department: "Gynecology",
    consultationFee: 180,
    rating: 4.8,
    isActive: true,
  },
  {
    name: "Dr. Robert Taylor",
    specialization: "Diagnostic Specialist",
    qualification: "MD, Radiology",
    experience: 10,
    bio: "Specialized in advanced diagnostic imaging and laboratory services.",
    department: "Diagnostics",
    consultationFee: 160,
    rating: 4.5,
    isActive: true,
  },
];

const services = [
  {
    name: "General Medicine",
    description:
      "Comprehensive primary care services for all ages, including routine checkups, preventive care, and treatment of common illnesses.",
    icon: "🏥",
    department: "General Medicine",
    price: 120,
    duration: 30,
  },
  {
    name: "Pediatrics",
    description:
      "Specialized healthcare for infants, children, and adolescents, including vaccinations, growth monitoring, and developmental assessments.",
    icon: "👶",
    department: "Pediatrics",
    price: 150,
    duration: 30,
  },
  {
    name: "Orthopedics",
    description:
      "Expert care for bone, joint, and muscle conditions, including fractures, arthritis, and sports injuries.",
    icon: "🦴",
    department: "Orthopedics",
    price: 250,
    duration: 45,
  },
  {
    name: "Gynecology",
    description:
      "Comprehensive women's health services including annual exams, reproductive health, and gynecological procedures.",
    icon: "👩",
    department: "Gynecology",
    price: 180,
    duration: 30,
  },
  {
    name: "Cardiology",
    description:
      "Advanced cardiac care including heart disease diagnosis, treatment, and preventive cardiology services.",
    icon: "❤️",
    department: "Cardiology",
    price: 200,
    duration: 45,
  },
  {
    name: "Diagnostics",
    description:
      "State-of-the-art diagnostic services including lab tests, imaging (X-ray, MRI, CT scan), and health screenings.",
    icon: "🔬",
    department: "Diagnostics",
    price: 160,
    duration: 60,
  },
];

const testimonials = [
  {
    patientName: "John Smith",
    rating: 5,
    comment:
      "Excellent care and professional staff. Dr. Johnson was very thorough and explained everything clearly.",
    isApproved: true,
  },
  {
    patientName: "Maria Garcia",
    rating: 5,
    comment:
      "The best medical facility I've been to. Clean, modern, and the doctors are truly caring.",
    isApproved: true,
  },
  {
    patientName: "David Lee",
    rating: 4,
    comment:
      "Great experience overall. The appointment booking was easy and the wait time was minimal.",
    isApproved: true,
  },
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/medical-clinic";
    await mongoose.connect(mongoURI);
    console.log(`Connected to MongoDB: ${mongoose.connection.host}`);

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Doctor.deleteMany({});
    // await Service.deleteMany({});
    // await Testimonial.deleteMany({});

    // Insert doctors
    const insertedDoctors = await Doctor.insertMany(doctors);
    console.log(`Inserted ${insertedDoctors.length} doctors`);

    // Insert services
    const insertedServices = await Service.insertMany(services);
    console.log(`Inserted ${insertedServices.length} services`);

    // Insert testimonials
    const insertedTestimonials = await Testimonial.insertMany(testimonials);
    console.log(`Inserted ${insertedTestimonials.length} testimonials`);

    console.log("Seed data inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
