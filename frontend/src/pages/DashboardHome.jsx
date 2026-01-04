import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiFileText, FiUser, FiArrowRight } from "react-icons/fi";
import api from "../utils/api";
import Loading from "../components/Loading";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    appointments: 0,
    upcomingAppointments: 0,
    medicalRecords: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, profileRes] = await Promise.all([
        api.get("/user/appointments"),
        api.get("/user/profile"),
      ]);

      const appointments = appointmentsRes.data.data.appointments || [];
      const upcoming = appointments.filter(
        (apt) =>
          new Date(apt.appointmentDate) >= new Date() &&
          apt.status !== "cancelled"
      );

      setStats({
        appointments: appointments.length,
        upcomingAppointments: upcoming.length,
        medicalRecords: profileRes.data.data.user.medicalHistory?.length || 0,
      });

      setUpcomingAppointments(upcoming.slice(0, 3));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.appointments}
                </p>
              </div>
              <FiCalendar className="w-12 h-12 text-medical-blue" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.upcomingAppointments}
                </p>
              </div>
              <FiCalendar className="w-12 h-12 text-medical-green" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Medical Records</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.medicalRecords}
                </p>
              </div>
              <FiFileText className="w-12 h-12 text-medical-teal" />
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/appointments"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Book Appointment
                </h3>
                <p className="text-gray-600">
                  Schedule a new appointment with our doctors
                </p>
              </div>
              <FiArrowRight className="w-8 h-8 text-medical-blue" />
            </div>
          </Link>

          <Link
            to="/dashboard/medical-records"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  View Medical Records
                </h3>
                <p className="text-gray-600">
                  Access your complete medical history
                </p>
              </div>
              <FiArrowRight className="w-8 h-8 text-medical-blue" />
            </div>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Upcoming Appointments
            </h2>
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {apt.doctor?.name || "Doctor"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {apt.doctor?.specialization || "Specialization"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(apt.appointmentDate).toLocaleDateString()} at{" "}
                        {apt.appointmentTime}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/dashboard/appointments"
              className="mt-4 inline-block text-medical-blue hover:text-medical-teal font-medium"
            >
              View All Appointments <FiArrowRight className="inline ml-1" />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardHome;

