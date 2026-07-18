import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCalendar, FiFileText, FiArrowRight } from "react-icons/fi";
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
          new Date(apt.appointmentDate) >= new Date() && apt.status !== "cancelled"
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

  if (loading) return <Loading />;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-medical-ink mb-6">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total appointments", value: stats.appointments, icon: FiCalendar, color: "text-medical-blue" },
          { label: "Upcoming", value: stats.upcomingAppointments, icon: FiCalendar, color: "text-medical-green" },
          { label: "Medical records", value: stats.medicalRecords, icon: FiFileText, color: "text-medical-teal" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white p-5 rounded-xl shadow-soft border border-medical-border/50 flex items-center justify-between"
          >
            <div>
              <p className="text-medical-soft text-sm mb-1">{label}</p>
              <p className="font-heading text-3xl font-bold text-medical-ink">{value}</p>
            </div>
            <Icon className={`w-10 h-10 ${color}`} aria-hidden />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/appointments"
          className="bg-white p-5 rounded-xl shadow-soft border border-medical-border/50 hover:border-medical-blue transition-colors group"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-semibold text-medical-ink mb-1">Book appointment</h2>
              <p className="text-sm text-medical-soft">Schedule a visit with our doctors</p>
            </div>
            <FiArrowRight className="w-6 h-6 text-medical-blue group-hover:translate-x-1 transition-transform" aria-hidden />
          </div>
        </Link>
        <Link
          to="/dashboard/medical-records"
          className="bg-white p-5 rounded-xl shadow-soft border border-medical-border/50 hover:border-medical-blue transition-colors group"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-semibold text-medical-ink mb-1">Medical records</h2>
              <p className="text-sm text-medical-soft">View your health history</p>
            </div>
            <FiArrowRight className="w-6 h-6 text-medical-blue group-hover:translate-x-1 transition-transform" aria-hidden />
          </div>
        </Link>
      </div>

      {upcomingAppointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-soft border border-medical-border/50 p-5 sm:p-6">
          <h2 className="font-heading text-xl font-bold text-medical-ink mb-4">Upcoming appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt._id}
                className="border border-medical-border rounded-lg p-4 hover:bg-medical-light/50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-heading font-semibold text-medical-ink">
                      {apt.doctor?.name || "Doctor"}
                    </h3>
                    <p className="text-sm text-medical-soft">
                      {apt.doctor?.specialization || "Specialization"}
                    </p>
                    <p className="text-sm text-medical-soft mt-1">
                      {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                      apt.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
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
            className="mt-4 inline-flex items-center text-medical-blue hover:text-medical-teal font-medium text-sm"
          >
            View all <FiArrowRight className="ml-1" aria-hidden />
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardHome;
