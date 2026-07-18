import React, { useState, useEffect } from "react";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get("/user/profile");
      const nextUser = response.data.data.user;
      if (nextUser.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
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
    { path: "/dashboard", label: "Overview", icon: FiHome },
    { path: "/dashboard/profile", label: "Profile", icon: FiUser },
    { path: "/dashboard/appointments", label: "Appointments", icon: FiCalendar },
    { path: "/dashboard/medical-records", label: "Records", icon: FiFileText },
    { path: "/dashboard/settings", label: "Settings", icon: FiSettings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medical-light pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-medical-border border-t-medical-blue" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medical-light pt-20">
      <div className="flex">
        {sidebarOpen && (
          <button
            type="button"
            className="fixed inset-0 bg-medical-deep/40 z-40 lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-medical-border transform transition-transform duration-200 ease-out pt-20 lg:pt-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:inset-0 lg:min-h-[calc(100vh-5rem)]`}
        >
          <div className="flex flex-col h-full lg:h-[calc(100vh-5rem)] lg:sticky lg:top-20">
            <div className="p-5 border-b border-medical-border flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-medical-ink">My care</h2>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-medical-soft rounded-lg hover:bg-medical-muted"
                aria-label="Close menu"
              >
                <FiX size={22} />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1" aria-label="Dashboard">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 min-h-[44px] px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-medical-blue text-white"
                        : "text-medical-ink hover:bg-medical-muted"
                    }`}
                  >
                    <Icon aria-hidden />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-medical-border">
              <div className="mb-3 p-3 bg-medical-light rounded-lg">
                <p className="font-heading font-semibold text-medical-ink text-sm">{user?.name}</p>
                <p className="text-xs text-medical-soft truncate">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 min-h-[44px] px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <FiLogOut aria-hidden />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="lg:hidden bg-white border-b border-medical-border px-4 py-3 flex items-center justify-between sticky top-20 z-30">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-medical-ink rounded-lg hover:bg-medical-muted"
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
            <h1 className="font-heading text-base font-semibold text-medical-ink">
              {menuItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
            </h1>
            <div className="w-11" />
          </div>

          <div className="p-5 sm:p-8 max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
