import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiXCircle, FiMail } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
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

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Invalid or expired verification link"
        );
        toast.error("Verification failed");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading message="Verifying your email..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {status === "success" ? (
          <>
            <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Email Verified!
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium"
            >
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <FiXCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                to="/portal"
                className="block px-6 py-3 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium"
              >
                Go to Login
              </Link>
              <button
                onClick={() => navigate("/resend-verification")}
                className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Resend Verification Email
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
