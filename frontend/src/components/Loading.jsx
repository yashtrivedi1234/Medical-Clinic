import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px]" role="status" aria-live="polite">
      <div className="w-12 h-12 border-2 border-medical-border border-t-medical-blue rounded-full animate-spin mb-4" />
      <p className="text-medical-soft text-sm">{message}</p>
    </div>
  );
};

export default Loading;
