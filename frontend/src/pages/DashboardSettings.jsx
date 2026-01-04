import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiBell, FiShield, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";

const DashboardSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSettingsChange = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setSaving(true);
      // TODO: Implement password change API call
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FiBell className="mr-2" />
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-600">
                    Receive notifications via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleSettingsChange("emailNotifications")}
                  className="w-5 h-5 text-medical-blue rounded focus:ring-medical-blue"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-800">SMS Notifications</p>
                  <p className="text-sm text-gray-600">
                    Receive notifications via SMS
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={() => handleSettingsChange("smsNotifications")}
                  className="w-5 h-5 text-medical-blue rounded focus:ring-medical-blue"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="font-medium text-gray-800">Appointment Reminders</p>
                  <p className="text-sm text-gray-600">
                    Get reminders before appointments
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.appointmentReminders}
                  onChange={() => handleSettingsChange("appointmentReminders")}
                  className="w-5 h-5 text-medical-blue rounded focus:ring-medical-blue"
                />
              </label>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FiLock className="mr-2" />
              Change Password
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
              >
                <FiSave />
                <span>{saving ? "Changing..." : "Change Password"}</span>
              </button>
            </form>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <FiShield className="mr-2" />
              Security
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800 mb-1">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Add an extra layer of security to your account
                </p>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardSettings;

