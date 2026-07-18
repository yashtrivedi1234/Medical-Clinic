import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiCalendar,
  FiActivity,
  FiSettings,
  FiLogOut,
  FiCheckCircle,
  FiClock,
  FiStar,
  FiMenu,
  FiX,
  FiHome,
  FiMessageSquare,
  FiExternalLink,
} from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LogoMark } from '../components/Layout/Navbar';

const statusClass = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-amber-100 text-amber-900';
    case 'completed':
      return 'bg-primary-100 text-primary-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      if (activeTab === 'dashboard') fetchDashboard();
      if (activeTab === 'appointments') fetchAppointments();
      if (activeTab === 'doctors') fetchDoctors();
      if (activeTab === 'services') fetchServices();
      if (activeTab === 'testimonials') fetchTestimonials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setLoading(true);
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
      setLoading(true);
      const response = await api.get('/admin/appointments');
      setAppointments(response.data.data?.appointments || []);
    } catch {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      setDoctors(response.data.data?.doctors || []);
    } catch {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      setServices(response.data.data?.services || []);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/testimonials');
      setTestimonials(response.data.data?.testimonials || []);
    } catch {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await api.put(`/admin/appointments/${id}/status`, { status });
      toast.success('Appointment status updated');
      if (activeTab === 'appointments') fetchAppointments();
      else fetchDashboard();
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
    toast.success('Logged out');
    navigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: FiActivity },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    { id: 'doctors', label: 'Doctors', icon: FiUsers },
    { id: 'services', label: 'Services', icon: FiSettings },
    { id: 'testimonials', label: 'Reviews', icon: FiMessageSquare },
  ];

  const setTab = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-200 border-t-medical-blue" />
      </div>
    );
  }

  const stats = dashboard?.stats;
  const recent = dashboard?.recentAppointments || [];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-medical-deep/40 z-40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-medical-deep text-white flex flex-col transform transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark className="w-9 h-9" />
            <div>
              <p className="font-heading font-bold leading-tight">MediCare</p>
              <p className="text-xs text-teal-200/70">Admin console</p>
            </div>
          </div>
          <button
            type="button"
            className="lg:hidden min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1" aria-label="Admin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 min-h-[44px] px-3 rounded-lg text-left font-medium transition-colors ${
                  active
                    ? 'bg-medical-blue text-white'
                    : 'text-teal-100/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon aria-hidden />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-2">
            <p className="font-heading font-semibold text-sm">{user.name}</p>
            <p className="text-xs text-teal-200/70 truncate">{user.email}</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 min-h-[40px] px-3 rounded-lg text-sm text-teal-100/80 hover:bg-white/10 hover:text-white"
          >
            <FiHome aria-hidden /> View website
            <FiExternalLink className="ml-auto opacity-60" size={14} aria-hidden />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 min-h-[44px] px-3 rounded-lg text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200"
          >
            <FiLogOut aria-hidden /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-medical-ink"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
            <div>
              <h1 className="font-heading text-lg sm:text-xl font-bold text-medical-ink">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-medical-soft hidden sm:block">Clinic operations</p>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-medical-light text-medical-blue">
            Admin
          </span>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {loading && !dashboard && activeTab === 'dashboard' ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-medical-blue" />
            </div>
          ) : null}

          {activeTab === 'dashboard' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                {[
                  { label: 'Appointments', value: stats.totalAppointments, icon: FiCalendar },
                  { label: 'Pending', value: stats.pendingAppointments, icon: FiClock },
                  { label: 'Doctors', value: stats.totalDoctors, icon: FiUsers },
                  { label: 'Patients', value: stats.totalPatients, icon: FiUsers },
                  { label: 'Services', value: stats.totalServices, icon: FiSettings },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs sm:text-sm text-medical-soft">{stat.label}</p>
                        <p className="font-heading text-2xl sm:text-3xl font-bold text-medical-ink mt-1 tabular-nums">
                          {stat.value}
                        </p>
                      </div>
                      <stat.icon className="w-5 h-5 text-medical-blue shrink-0 mt-0.5" aria-hidden />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="font-heading font-semibold text-medical-ink">Recent appointments</h2>
                  <button
                    type="button"
                    onClick={() => setTab('appointments')}
                    className="text-sm font-medium text-medical-blue hover:text-medical-teal"
                  >
                    Manage all
                  </button>
                </div>
                {recent.length === 0 ? (
                  <p className="p-8 text-center text-medical-soft text-sm">No appointments yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-left">
                        <tr>
                          {['Patient', 'Doctor', 'When', 'Status'].map((h) => (
                            <th
                              key={h}
                              className="px-5 py-3 text-xs font-heading font-semibold text-medical-soft uppercase tracking-wide"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recent.map((apt) => (
                          <tr key={apt._id} className="hover:bg-slate-50/80">
                            <td className="px-5 py-3.5">
                              <p className="font-medium text-medical-ink">{apt.patientName}</p>
                              <p className="text-xs text-medical-soft">{apt.email}</p>
                            </td>
                            <td className="px-5 py-3.5 text-medical-ink">
                              {apt.doctor?.name || '—'}
                            </td>
                            <td className="px-5 py-3.5 text-medical-soft whitespace-nowrap">
                              {new Date(apt.appointmentDate).toLocaleDateString()} · {apt.appointmentTime}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2 py-1 text-xs font-medium rounded-md capitalize ${statusClass(apt.status)}`}>
                                {apt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-heading font-semibold text-medical-ink">All appointments</h2>
                <p className="text-sm text-medical-soft mt-0.5">Update status as patients are seen</p>
              </div>
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-medical-blue" />
                </div>
              ) : appointments.length === 0 ? (
                <p className="p-10 text-center text-medical-soft">No appointments booked yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {['Patient', 'Doctor', 'Date', 'Time', 'Status', 'Update'].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-xs font-heading font-semibold text-medical-soft uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appointments.map((apt) => (
                        <tr key={apt._id} className="hover:bg-slate-50/80">
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="font-medium text-medical-ink">{apt.patientName}</div>
                            <div className="text-xs text-medical-soft">{apt.email}</div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <div className="text-medical-ink">{apt.doctor?.name || 'N/A'}</div>
                            <div className="text-xs text-medical-soft">{apt.department}</div>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-medical-ink">
                            {new Date(apt.appointmentDate).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap text-medical-ink">
                            {apt.appointmentTime}
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-md capitalize ${statusClass(apt.status)}`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 whitespace-nowrap">
                            <select
                              value={apt.status}
                              onChange={(e) => updateAppointmentStatus(apt._id, e.target.value)}
                              className="input-field min-h-[36px] py-1.5 text-sm w-auto max-w-[140px]"
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
            </div>
          )}

          {activeTab === 'doctors' && (
            <div>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-heading font-semibold text-medical-ink text-lg">Doctors roster</h2>
                  <p className="text-sm text-medical-soft">{doctors.length} active clinicians</p>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-medical-blue" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {doctors.map((doctor) => (
                    <article
                      key={doctor._id}
                      className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm"
                    >
                      <h3 className="font-heading text-lg font-semibold text-medical-ink">{doctor.name}</h3>
                      <p className="text-medical-blue text-sm font-medium mt-0.5">{doctor.specialization}</p>
                      <dl className="mt-4 space-y-1.5 text-sm text-medical-soft">
                        <div className="flex justify-between gap-2">
                          <dt>Department</dt>
                          <dd className="text-medical-ink font-medium">{doctor.department}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt>Experience</dt>
                          <dd className="text-medical-ink font-medium">{doctor.experience} yrs</dd>
                        </div>
                        {doctor.consultationFee != null && (
                          <div className="flex justify-between gap-2">
                            <dt>Fee</dt>
                            <dd className="text-medical-ink font-medium">${doctor.consultationFee}</dd>
                          </div>
                        )}
                      </dl>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="mb-4">
                <h2 className="font-heading font-semibold text-medical-ink text-lg">Services catalog</h2>
                <p className="text-sm text-medical-soft">{services.length} offerings</p>
              </div>
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-medical-blue" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <article
                      key={service._id}
                      className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col"
                    >
                      <h3 className="font-heading text-lg font-semibold text-medical-ink">{service.name}</h3>
                      <p className="text-medical-soft text-sm mt-2 leading-relaxed flex-1">{service.description}</p>
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-medical-blue font-medium">{service.department}</span>
                        {service.price > 0 && (
                          <span className="font-heading font-semibold text-medical-ink">${service.price}</span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-3">
              <div className="mb-2">
                <h2 className="font-heading font-semibold text-medical-ink text-lg">Patient reviews</h2>
                <p className="text-sm text-medical-soft">Approve reviews before they appear on the site</p>
              </div>
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-medical-blue" />
                </div>
              ) : testimonials.length === 0 ? (
                <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-medical-soft">
                  No testimonials yet.
                </p>
              ) : (
                testimonials.map((testimonial) => (
                  <article
                    key={testimonial._id}
                    className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-heading font-semibold text-medical-ink">
                          {testimonial.patientName}
                        </h3>
                        <div className="flex items-center gap-0.5 mt-1" aria-label={`${testimonial.rating} stars`}>
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'text-amber-500' : 'text-slate-300'}`}
                              aria-hidden
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {testimonial.isApproved ? (
                          <span className="text-xs font-medium px-2 py-1 rounded-md bg-green-100 text-green-800">
                            Live
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => approveTestimonial(testimonial._id)}
                            className="btn-primary text-sm py-2 min-h-[36px]"
                          >
                            <FiCheckCircle aria-hidden /> Approve
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-medical-soft text-sm leading-relaxed">{testimonial.comment}</p>
                    <p className="text-xs text-medical-soft mt-3">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </p>
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
