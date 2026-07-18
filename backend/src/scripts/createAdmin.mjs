import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.mjs";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/medical-clinic"
    );
    console.log("Connected to MongoDB");

    const adminData = {
      name: "Admin User",
      email: "admin@medicareclinic.com",
      phone: "+1 (555) 000-0000",
      password: "admin123", // Change this in production!
      role: "admin",
      isEmailVerified: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      existingAdmin.role = "admin";
      existingAdmin.isEmailVerified = true;
      existingAdmin.password = adminData.password;
      await existingAdmin.save();
      console.log("Admin user reset (verified + password admin123).");
      console.log("Email:", existingAdmin.email);
      console.log("Password: admin123");
      process.exit(0);
    }

    const admin = await User.create(adminData);
    console.log("Admin user created successfully!");
    console.log("Email:", admin.email);
    console.log("Password: admin123 (Please change this immediately!)");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
