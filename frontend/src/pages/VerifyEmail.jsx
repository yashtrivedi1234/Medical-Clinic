import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        const { token: jwtToken, data } = response.data;
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setStatus("success");
        setMessage("Email verified successfully! Redirecting to dashboard...");
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Invalid or expired verification link");
        toast.error("Verification failed");
      }
    };
    if (token) verifyEmail();
  }, [token, navigate]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medical-light pt-20">
        <Loading message="Verifying your email..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-medical-light px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-soft border border-medical-border/60 p-8 text-center"
      >
        {status === "success" ? (
          <>
            <FiCheckCircle className="w-16 h-16 text-medical-green mx-auto mb-4" aria-hidden />
            <h1 className="font-heading text-2xl font-bold text-medical-ink mb-3">Email verified</h1>
            <p className="text-medical-soft mb-6">{message}</p>
            <Link to="/dashboard" className="btn-primary">
              Go to dashboard
            </Link>
          </>
        ) : (
          <>
            <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" aria-hidden />
            <h1 className="font-heading text-2xl font-bold text-medical-ink mb-3">Verification failed</h1>
            <p className="text-medical-soft mb-6">{message}</p>
            <div className="space-y-3">
              <Link to="/portal" className="btn-primary w-full">
                Go to login
              </Link>
              <Link to="/portal" className="btn-secondary w-full">
                Back to portal
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
