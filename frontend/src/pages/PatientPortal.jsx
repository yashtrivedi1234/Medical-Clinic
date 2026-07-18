import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { LogoMark } from "../components/Layout/Navbar";

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
        navigate(userData.role === "admin" ? "/admin" : "/dashboard");
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
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Login failed. Please try again."
      );
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
      toast.success(
        response.data.message ||
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
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (user && user.isEmailVerified) {
    navigate(user.role === "admin" ? "/admin" : "/dashboard");
    return null;
  }

  return (
    <div className="pt-20 min-h-screen bg-medical-light">
      <div className="absolute inset-0 top-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-100/60 via-transparent to-transparent pointer-events-none" aria-hidden />
      <div className="relative container-page py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <LogoMark className="w-12 h-12 mx-auto mb-3" />
            <h1 className="font-heading text-3xl font-bold text-medical-ink mb-2">
              Patient portal
            </h1>
            <p className="text-medical-soft">
              {isLogin
                ? "Sign in to manage appointments and records"
                : "Create an account to get started"}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-medical-border/60 p-6 sm:p-8">
            <div className="flex mb-6 bg-medical-muted rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 min-h-[44px] rounded-md font-heading font-medium transition-colors duration-200 ${
                  isLogin ? "bg-medical-blue text-white shadow-soft" : "text-medical-soft hover:text-medical-ink"
                }`}
              >
                <FiLogIn className="inline mr-2" aria-hidden />
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 min-h-[44px] rounded-md font-heading font-medium transition-colors duration-200 ${
                  !isLogin ? "bg-medical-blue text-white shadow-soft" : "text-medical-soft hover:text-medical-ink"
                }`}
              >
                <FiUserPlus className="inline mr-2" aria-hidden />
                Register
              </button>
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="login-email" className="label-field">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    autoComplete="email"
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="label-field">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    autoComplete="current-password"
                    className="input-field"
                    placeholder="Your password"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label htmlFor="reg-name" className="label-field">Full name</label>
                  <input
                    id="reg-name"
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                    autoComplete="name"
                    className="input-field"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label htmlFor="reg-email" className="label-field">Email</label>
                  <input
                    id="reg-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    autoComplete="email"
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="reg-phone" className="label-field">Phone (optional)</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    autoComplete="tel"
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="reg-password" className="label-field">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="input-field"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <label htmlFor="reg-confirm" className="label-field">Confirm password</label>
                  <input
                    id="reg-confirm"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, confirmPassword: e.target.value })
                    }
                    required
                    autoComplete="new-password"
                    className="input-field"
                    placeholder="Confirm password"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>
            )}

            {!isLogin && (
              <p className="mt-4 text-sm text-medical-soft text-center">
                We will send a verification email after you register.
              </p>
            )}

            {isLogin && (
              <p className="mt-6 text-center text-sm">
                <Link to="/portal" className="text-medical-blue hover:text-medical-teal font-medium">
                  Need help signing in?
                </Link>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientPortal;
