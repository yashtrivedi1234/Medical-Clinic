import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiSave } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";
import Loading from '../components/Loading.jsx';

const DashboardProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/user/profile");
      const userData = response.data.data.user;
      setUser(userData);
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        dateOfBirth: userData.dateOfBirth
          ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: userData.gender || "",
        address: {
          street: userData.address?.street || "",
          city: userData.address?.city || "",
          state: userData.address?.state || "",
          zipCode: userData.address?.zipCode || "",
          country: userData.address?.country || "",
        },
        emergencyContact: {
          name: userData.emergencyContact?.name || "",
          phone: userData.emergencyContact?.phone || "",
          relationship: userData.emergencyContact?.relationship || "",
        },
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value },
      });
    } else if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        emergencyContact: { ...formData.emergencyContact, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await api.put("/user/profile", formData);
      setUser(response.data.data.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FiUser className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FiMail className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FiPhone className="inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FiCalendar className="inline mr-2" />
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Address Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiMapPin className="mr-2" />
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                />
              </div>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
              <input
                type="text"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                placeholder="Zip Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
              <input
                type="text"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                placeholder="Country"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
                placeholder="Contact Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
              <input
                type="tel"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
              <input
                type="text"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleChange}
                placeholder="Relationship"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
          >
            <FiSave />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default DashboardProfile;

