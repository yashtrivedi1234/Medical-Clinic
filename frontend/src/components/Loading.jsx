import React from "react";
import { motion } from "framer-motion";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-medical-blue border-t-transparent rounded-full mb-4"
      />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;

