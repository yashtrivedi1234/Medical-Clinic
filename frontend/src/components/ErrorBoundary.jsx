import React from "react";
import { FiAlertCircle } from "react-icons/fi";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-medical-light px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-soft border border-medical-border/60 p-8 text-center">
            <FiAlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" aria-hidden />
            <h1 className="font-heading text-2xl font-bold text-medical-ink mb-2">
              Something went wrong
            </h1>
            <p className="text-medical-soft mb-6">
              Something unexpected happened. Please try refreshing the page.
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="btn-primary"
            >
              Go to home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
