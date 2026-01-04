import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiCalendar,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/user/profile");
      setUser(response.data.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/portal");
      }
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: FiHome },
    { path: "/dashboard/profile", label: "Profile", icon: FiUser },
    { path: "/dashboard/appointments", label: "Appointments", icon: FiCalendar },
    {
      path: "/dashboard/medical-records",
      label: "Medical Records",
      icon: FiFileText,
    },
    { path: "/dashboard/settings", label: "Settings", icon: FiSettings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-medical-blue text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">
              {menuItems.find((item) => item.path === location.pathname)
                ?.label || "Dashboard"}
            </h1>
            <div className="w-6"></div>
          </div>

          {/* Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

