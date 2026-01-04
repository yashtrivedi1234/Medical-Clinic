import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from '../components/Loading.jsx';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful!");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Failed to process authentication");
        navigate("/portal");
      }
    } else {
      toast.error("Invalid authentication response");
      navigate("/portal");
    }
  }, [searchParams, navigate]);

  return <Loading message="Completing authentication..." />;
};

export default AuthCallback;
