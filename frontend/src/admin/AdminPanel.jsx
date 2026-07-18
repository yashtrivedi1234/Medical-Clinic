import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiActivity, FiSettings, FiLogOut, FiCheckCircle, FiClock, FiStar } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchDashboard();
      if (activeTab === 'appointments') fetchAppointments();
      if (activeTab === 'doctors') fetchDoctors();
      if (activeTab === 'services') fetchServices();
      if (activeTab === 'testimonials') fetchTestimonials();
    }
  }, [user, activeTab]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      navigate('/portal');
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
    setUser(userData);
  };

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setDashboard(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/admin/appointments');
      setAppointments(response.data.data?.appointments || response.data.data || []);
    } catch {
      toast.error('Failed to load appointments');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data.data?.doctors || []);
    } catch {
      toast.error('Failed to load doctors');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.data?.services || []);
    } catch {
      toast.error('Failed to load services');
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/admin/testimonials');
      setTestimonials(response.data.data?.testimonials || response.data.data || []);
    } catch {
      toast.error('Failed to load testimonials');
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await api.put(`/admin/appointments/${id}/status`, { status });
      toast.success('Appointment status updated');
      fetchAppointments();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const approveTestimonial = async (id) => {
    try {
      await api.put(`/testimonials/${id}/approve`);
      toast.success('Testimonial approved');
      fetchTestimonials();
    } catch {
      toast.error('Failed to approve testimonial');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    toast.success('Logged out');
  };

  if (loading || !user) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-medical-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-medical-border border-t-medical-blue mx-auto mb-4" />
          <p className="text-medical-soft">Loading admin…</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiActivity },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    { id: 'doctors', label: 'Doctors', icon: FiUsers },
    { id: 'services', label: 'Services', icon: FiSettings },
    { id: 'testimonials', label: 'Testimonials', icon: FiUsers },
  ];

  return (
    <div className="pt-20 min-h-screen bg-medical-light">
      <div className="container-page py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-medical-ink">Admin</h1>
            <p className="text-medical-soft text-sm mt-1">Manage clinic operations</p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-ghost border border-slate-200 self-start">
            <FiLogOut aria-hidden />
            Logout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-medical-border/50 mb-8 overflow-hidden">
          <div className="flex overflow-x-auto" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 min-h-[48px] px-5 py-3 border-b-2 font-medium whitespace-nowrap transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-medical-blue text-medical-blue'
                      : 'border-transparent text-medical-soft hover:text-medical-ink'
                  }`}
                >
                  <Icon aria-hidden />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'dashboard' && dashboard && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total appointments', value: dashboard.stats.totalAppointments, icon: FiCalendar, color: 'text-medical-blue' },
              { label: 'Pending', value: dashboard.stats.pendingAppointments, icon: FiClock, color: 'text-amber-600' },
              { label: 'Doctors', value: dashboard.stats.totalDoctors, icon: FiUsers, color: 'text-medical-blue' },
              { label: 'Patients', value: dashboard.stats.totalPatients, icon: FiUsers, color: 'text-medical-green' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-5 rounded-xl shadow-soft border border-medical-border/50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-medical-soft text-sm">{stat.label}</p>
                    <p className="font-heading text-3xl font-bold text-medical-ink mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-10 h-10 ${stat.color}`} aria-hidden />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-soft border border-medical-border/50 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-medical-light/80">
                <tr>
                  {['Patient', 'Doctor', 'Date', 'Time', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-heading font-semibold text-medical-soft uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-medical-border">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-medical-light/40">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-medical-ink">{apt.patientName}</div>
                      <div className="text-medical-soft text-xs">{apt.email}</div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="text-medical-ink">{apt.doctor?.name || 'N/A'}</div>
                      <div className="text-medical-soft text-xs">{apt.department}</div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-medical-ink">
                      {new Date(apt.appointmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-medical-ink">{apt.appointmentTime}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-md capitalize ${
                          apt.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : apt.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : apt.status === 'completed'
                                ? 'bg-primary-100 text-primary-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <select
                        value={apt.status}
                        onChange={(e) => updateAppointmentStatus(apt._id, e.target.value)}
                        className="input-field min-h-[36px] py-1.5 text-sm w-auto"
                        aria-label={`Update status for ${apt.patientName}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="bg-white p-5 rounded-xl shadow-soft border border-medical-border/50">
                <h3 className="font-heading text-lg font-semibold text-medical-ink mb-1">{doctor.name}</h3>
                <p className="text-medical-soft mb-1">{doctor.specialization}</p>
                <p className="text-sm text-medical-soft">{doctor.department}</p>
                <p className="text-sm text-medical-soft mt-2">{doctor.experience} years experience</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service._id} className="bg-white p-5 rounded-xl shadow-soft border border-medical-border/50">
                <h3 className="font-heading text-lg font-semibold text-medical-ink mb-1">{service.name}</h3>
                <p className="text-medical-soft mb-2 text-sm leading-relaxed">{service.description}</p>
                <p className="text-xs font-medium text-medical-blue">{service.department}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-white p-5 rounded-xl shadow-soft border border-medical-border/50">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-heading font-semibold text-medical-ink">{testimonial.patientName}</h3>
                    <div className="flex items-center gap-0.5 mt-1" aria-label={`${testimonial.rating} stars`}>
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-500' : 'text-slate-300'}`}
                          aria-hidden
                        />
                      ))}
                    </div>
                  </div>
                  {!testimonial.isApproved && (
                    <button
                      type="button"
                      onClick={() => approveTestimonial(testimonial._id)}
                      className="btn-primary text-sm py-2"
                    >
                      <FiCheckCircle aria-hidden />
                      Approve
                    </button>
                  )}
                </div>
                <p className="text-medical-soft">{testimonial.comment}</p>
                <p className="text-xs text-medical-soft mt-2">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
