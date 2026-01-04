import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLogIn,
  FiUserPlus,
  FiMail as FiMailIcon,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import api from "../utils/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/constants";

const PatientPortal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      if (userData.isEmailVerified) {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/auth/login", loginData);
      const { token, data } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (registerData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...data } = registerData;
      const response = await api.post("/auth/register", data);
      const { message } = response.data;

      toast.success(
        message ||
          "Registration successful! Please check your email to verify your account."
      );
      setIsLogin(true);
      setRegisterData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL.replace("/api", "")}/api/auth/google`;
  };

  if (user && user.isEmailVerified) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Patient Portal
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to access your medical records"
                  : "Create an account to get started"}
              </p>
            </div>

            {/* Toggle */}
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                  isLogin
                    ? "bg-medical-blue text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FiLogIn className="inline mr-2" />
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-md font-medium transition-colors ${
                  !isLogin
                    ? "bg-medical-blue text-white"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <FiUserPlus className="inline mr-2" />
                Register
              </button>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full mb-6 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <FcGoogle className="text-2xl" />
              <span>Continue with Google</span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        email: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
            )}

            {!isLogin && (
              <p className="mt-4 text-sm text-gray-600 text-center">
                By registering, you agree to receive a verification email. Please
                check your inbox.
              </p>
            )}

            {isLogin && (
              <div className="mt-6 text-center">
                <Link
                  to="/resend-verification"
                  className="text-sm text-medical-blue hover:text-medical-teal"
                >
                  Resend verification email?
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientPortal;
