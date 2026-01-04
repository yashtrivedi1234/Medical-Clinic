import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiClock, FiUser, FiXCircle, FiArrowRight } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";
import Loading from '../components/Loading.jsx';

const DashboardAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/user/appointments");
      setAppointments(response.data.data.appointments || []);
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch (error) {
      toast.error("Failed to cancel appointment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "all") return true;
    if (filter === "upcoming") {
      return (
        new Date(apt.appointmentDate) >= new Date() &&
        apt.status !== "cancelled"
      );
    }
    return apt.status === filter;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
          <Link
            to="/appointments"
            className="px-6 py-3 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium flex items-center space-x-2"
          >
            <FiCalendar />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {["all", "upcoming", "pending", "confirmed", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  filter === status
                    ? "bg-medical-blue text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Appointments Found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You don't have any appointments yet."
                : `No ${filter} appointments found.`}
            </p>
            <Link
              to="/appointments"
              className="inline-block px-6 py-3 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium"
            >
              Book an Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <motion.div
                key={apt._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {apt.doctor?.name || "Doctor"}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          apt.status
                        )}`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      <strong>Specialization:</strong>{" "}
                      {apt.doctor?.specialization || "N/A"}
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Department:</strong> {apt.department}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <FiCalendar className="mr-2" />
                        {new Date(apt.appointmentDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <FiClock className="mr-2" />
                        {apt.appointmentTime}
                      </span>
                    </div>
                    {apt.notes && (
                      <p className="text-gray-600 mt-2 text-sm">
                        <strong>Notes:</strong> {apt.notes}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 flex flex-col space-y-2">
                    {apt.status === "pending" && (
                      <button
                        onClick={() => handleCancel(apt._id)}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <FiXCircle />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardAppointments;

