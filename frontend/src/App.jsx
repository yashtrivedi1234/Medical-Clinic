import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Navbar from "./components/Layout/Navbar.jsx";
import Footer from "./components/Layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Doctors from "./pages/Doctors.jsx";
import Services from "./pages/Services.jsx";
import Appointments from "./pages/Appointments.jsx";
import Contact from "./pages/Contact.jsx";
import PatientPortal from "./pages/PatientPortal.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import DashboardProfile from "./pages/DashboardProfile.jsx";
import DashboardAppointments from "./pages/DashboardAppointments.jsx";
import DashboardMedicalRecords from "./pages/DashboardMedicalRecords.jsx";
import DashboardSettings from "./pages/DashboardSettings.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const hideChrome =
    pathname.startsWith("/dashboard") || isAdmin;

  return (
    <div className="min-h-dvh flex flex-col bg-medical-light">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {!isAdmin && <Navbar />}
      <main id="main-content" className="flex-grow" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portal" element={<PatientPortal />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="appointments" element={<DashboardAppointments />} />
            <Route path="medical-records" element={<DashboardMedicalRecords />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
        </Routes>
      </main>
      {!hideChrome && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <ScrollToTop />
        <AppShell />
      </Router>
    </ErrorBoundary>
  );
}

export default App;
