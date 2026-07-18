import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FiPlus,
  FiEdit2,
  FiTrash2,
} from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { LogoMark } from '../components/Layout/Navbar';

const DEPARTMENTS = [
  'General Medicine',
  'Pediatrics',
  'Orthopedics',
  'Gynecology',
  'Cardiology',
  'Diagnostics',
];

const emptyDoctor = {
  name: '',
  specialization: '',
  qualification: '',
  experience: '',
  department: '',
  consultationFee: '',
  bio: '',
};

const emptyService = {
  name: '',
  description: '',
  department: '',
  price: '',
  duration: '30',
};

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

const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
    <button
      type="button"
      className="absolute inset-0 bg-medical-deep/50"
      aria-label="Close dialog"
      onClick={onClose}
    />
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className={`relative bg-white w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} rounded-t-2xl sm:rounded-2xl shadow-lift max-h-[90dvh] overflow-y-auto`}
    >
      <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between z-10">
        <h2 id="admin-modal-title" className="font-heading text-lg font-bold text-medical-ink">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg hover:bg-slate-100 text-medical-soft"
          aria-label="Close"
        >
          <FiX size={20} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

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
  const [saving, setSaving] = useState(false);

  const [doctorModal, setDoctorModal] = useState(null); // null | 'create' | doctor
  const [serviceModal, setServiceModal] = useState(null);
  const [doctorForm, setDoctorForm] = useState(emptyDoctor);
  const [serviceForm, setServiceForm] = useState(emptyService);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') loadTab(activeTab);
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

  const apiError = (error, fallback) =>
    toast.error(error.response?.data?.message || error.response?.data?.error || fallback);

  const loadTab = async (tab) => {
    try {
      setLoading(true);
      if (tab === 'dashboard') {
        const res = await api.get('/admin/dashboard');
        setDashboard(res.data.data);
      } else if (tab === 'appointments') {
        const res = await api.get('/admin/appointments');
        setAppointments(res.data.data?.appointments || []);
      } else if (tab === 'doctors') {
        const res = await api.get('/doctors');
        setDoctors(res.data.data?.doctors || []);
      } else if (tab === 'services') {
        const res = await api.get('/services');
        setServices(res.data.data?.services || []);
      } else if (tab === 'testimonials') {
        const res = await api.get('/admin/testimonials');
        setTestimonials(res.data.data?.testimonials || []);
      }
    } catch (error) {
      apiError(error, 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openCreateDoctor = () => {
    setDoctorForm(emptyDoctor);
    setDoctorModal('create');
  };

  const openEditDoctor = (doctor) => {
    setDoctorForm({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      qualification: doctor.qualification || '',
      experience: String(doctor.experience ?? ''),
      department: doctor.department || '',
      consultationFee: String(doctor.consultationFee ?? ''),
      bio: doctor.bio || '',
    });
    setDoctorModal(doctor);
  };

  const saveDoctor = async (e) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.specialization || !doctorForm.department || !doctorForm.qualification) {
      toast.error('Please fill required fields');
      return;
    }
    const payload = {
      name: doctorForm.name.trim(),
      specialization: doctorForm.specialization.trim(),
      qualification: doctorForm.qualification.trim(),
      experience: Number(doctorForm.experience) || 0,
      department: doctorForm.department,
      consultationFee: Number(doctorForm.consultationFee) || 0,
      bio: doctorForm.bio.trim(),
      isActive: true,
    };
    try {
      setSaving(true);
      if (doctorModal === 'create') {
        await api.post('/doctors', payload);
        toast.success('Doctor added');
      } else {
        await api.put(`/doctors/${doctorModal._id}`, payload);
        toast.success('Doctor updated');
      }
      setDoctorModal(null);
      await loadTab('doctors');
    } catch (error) {
      apiError(error, 'Failed to save doctor');
    } finally {
      setSaving(false);
    }
  };

  const deleteDoctor = async (doctor) => {
    if (!window.confirm(`Remove ${doctor.name} from the roster?`)) return;
    try {
      await api.delete(`/doctors/${doctor._id}`);
      toast.success('Doctor removed');
      await loadTab('doctors');
    } catch (error) {
      apiError(error, 'Failed to delete doctor');
    }
  };

  const openCreateService = () => {
    setServiceForm(emptyService);
    setServiceModal('create');
  };

  const openEditService = (service) => {
    setServiceForm({
      name: service.name || '',
      description: service.description || '',
      department: service.department || '',
      price: String(service.price ?? ''),
      duration: String(service.duration ?? 30),
    });
    setServiceModal(service);
  };

  const saveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.description || !serviceForm.department) {
      toast.error('Please fill required fields');
      return;
    }
    const payload = {
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim(),
      department: serviceForm.department,
      price: Number(serviceForm.price) || 0,
      duration: Number(serviceForm.duration) || 30,
      isActive: true,
    };
    try {
      setSaving(true);
      if (serviceModal === 'create') {
        await api.post('/services', payload);
        toast.success('Service added');
      } else {
        await api.put(`/services/${serviceModal._id}`, payload);
        toast.success('Service updated');
      }
      setServiceModal(null);
      await loadTab('services');
    } catch (error) {
      apiError(error, 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (service) => {
    if (!window.confirm(`Remove service “${service.name}”?`)) return;
    try {
      await api.delete(`/services/${service._id}`);
      toast.success('Service removed');
      await loadTab('services');
    } catch (error) {
      apiError(error, 'Failed to delete service');
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await api.put(`/admin/appointments/${id}/status`, { status });
      toast.success('Status updated');
      await loadTab(activeTab === 'dashboard' ? 'dashboard' : 'appointments');
    } catch (error) {
      apiError(error, 'Failed to update status');
    }
  };

  const deleteAppointment = async (apt) => {
    if (!window.confirm(`Delete appointment for ${apt.patientName}?`)) return;
    try {
      await api.delete(`/appointments/${apt._id}`);
      toast.success('Appointment removed');
      await loadTab('appointments');
    } catch (error) {
      apiError(error, 'Failed to delete appointment');
    }
  };

  const approveTestimonial = async (id) => {
    try {
      await api.put(`/testimonials/${id}/approve`);
      toast.success('Review approved');
      await loadTab('testimonials');
    } catch (error) {
      apiError(error, 'Failed to approve');
    }
  };

  const deleteTestimonial = async (t) => {
    if (!window.confirm(`Delete review from ${t.patientName}?`)) return;
    try {
      await api.delete(`/testimonials/${t._id}`);
      toast.success('Review deleted');
      await loadTab('testimonials');
    } catch (error) {
      apiError(error, 'Failed to delete review');
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
      <div className="min-h-dvh flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-200 border-t-medical-blue" />
      </div>
    );
  }

  const stats = dashboard?.stats;
  const recent = dashboard?.recentAppointments || [];

  return (
    <div className="min-h-dvh bg-slate-100">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-medical-deep/40 z-40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col bg-medical-deep text-white transition-transform duration-200 ease-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
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

        <nav className="flex-1 overflow-y-auto p-3 space-y-1" aria-label="Admin">
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

        <div className="p-4 border-t border-white/10 space-y-3 shrink-0">
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

      <div className="min-h-dvh flex flex-col lg:pl-64">
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
              <p className="text-xs text-medical-soft hidden sm:block">Full clinic management</p>
            </div>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-medical-light text-medical-blue">
            Admin
          </span>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {loading && (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-medical-blue" />
            </div>
          )}

          {!loading && activeTab === 'dashboard' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                {[
                  { label: 'Appointments', value: stats.totalAppointments, icon: FiCalendar },
                  { label: 'Pending', value: stats.pendingAppointments, icon: FiClock },
                  { label: 'Doctors', value: stats.totalDoctors, icon: FiUsers },
                  { label: 'Patients', value: stats.totalPatients, icon: FiUsers },
                  { label: 'Services', value: stats.totalServices, icon: FiSettings },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-sm">
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
                  <button type="button" onClick={() => setTab('appointments')} className="text-sm font-medium text-medical-blue">
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
                            <th key={h} className="px-5 py-3 text-xs font-heading font-semibold text-medical-soft uppercase tracking-wide">
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
                            <td className="px-5 py-3.5 text-medical-ink">{apt.doctor?.name || '—'}</td>
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

          {!loading && activeTab === 'appointments' && (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-heading font-semibold text-medical-ink">All appointments</h2>
                <p className="text-sm text-medical-soft mt-0.5">Update status or delete bookings</p>
              </div>
              {appointments.length === 0 ? (
                <p className="p-10 text-center text-medical-soft">No appointments booked yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {['Patient', 'Doctor', 'Date', 'Time', 'Status', 'Actions'].map((h) => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-heading font-semibold text-medical-soft uppercase tracking-wide">
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
                          <td className="px-5 py-3.5 whitespace-nowrap text-medical-ink">{apt.appointmentTime}</td>
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
                          <td className="px-5 py-3.5">
                            <button
                              type="button"
                              onClick={() => deleteAppointment(apt)}
                              className="min-h-[36px] px-3 inline-flex items-center gap-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <FiTrash2 aria-hidden /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'doctors' && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading font-semibold text-medical-ink text-lg">Doctors roster</h2>
                  <p className="text-sm text-medical-soft">{doctors.length} active clinicians</p>
                </div>
                <button type="button" onClick={openCreateDoctor} className="btn-primary text-sm">
                  <FiPlus aria-hidden /> Add doctor
                </button>
              </div>
              {doctors.length === 0 ? (
                <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-medical-soft">
                  No doctors yet. Add your first clinician.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {doctors.map((doctor) => (
                    <article key={doctor._id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
                      <h3 className="font-heading text-lg font-semibold text-medical-ink">{doctor.name}</h3>
                      <p className="text-medical-blue text-sm font-medium mt-0.5">{doctor.specialization}</p>
                      <dl className="mt-4 space-y-1.5 text-sm text-medical-soft flex-1">
                        <div className="flex justify-between gap-2">
                          <dt>Qualification</dt>
                          <dd className="text-medical-ink font-medium text-right">{doctor.qualification}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt>Department</dt>
                          <dd className="text-medical-ink font-medium">{doctor.department}</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt>Experience</dt>
                          <dd className="text-medical-ink font-medium">{doctor.experience} yrs</dd>
                        </div>
                        <div className="flex justify-between gap-2">
                          <dt>Fee</dt>
                          <dd className="text-medical-ink font-medium">${doctor.consultationFee || 0}</dd>
                        </div>
                      </dl>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                        <button type="button" onClick={() => openEditDoctor(doctor)} className="btn-secondary flex-1 text-sm py-2 min-h-[40px]">
                          <FiEdit2 aria-hidden /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteDoctor(doctor)}
                          className="min-h-[40px] px-3 inline-flex items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          aria-label={`Delete ${doctor.name}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'services' && (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading font-semibold text-medical-ink text-lg">Services catalog</h2>
                  <p className="text-sm text-medical-soft">{services.length} offerings</p>
                </div>
                <button type="button" onClick={openCreateService} className="btn-primary text-sm">
                  <FiPlus aria-hidden /> Add service
                </button>
              </div>
              {services.length === 0 ? (
                <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-medical-soft">
                  No services yet. Add your first offering.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <article key={service._id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col">
                      <h3 className="font-heading text-lg font-semibold text-medical-ink">{service.name}</h3>
                      <p className="text-medical-soft text-sm mt-2 leading-relaxed flex-1">{service.description}</p>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-medical-blue font-medium">{service.department}</span>
                        <span className="font-heading font-semibold text-medical-ink">
                          ${service.price || 0} · {service.duration || 30}m
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                        <button type="button" onClick={() => openEditService(service)} className="btn-secondary flex-1 text-sm py-2 min-h-[40px]">
                          <FiEdit2 aria-hidden /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteService(service)}
                          className="min-h-[40px] px-3 inline-flex items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          aria-label={`Delete ${service.name}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'testimonials' && (
            <div className="space-y-3">
              <div className="mb-2">
                <h2 className="font-heading font-semibold text-medical-ink text-lg">Patient reviews</h2>
                <p className="text-sm text-medical-soft">Approve or delete reviews</p>
              </div>
              {testimonials.length === 0 ? (
                <p className="bg-white rounded-xl border border-slate-200 p-10 text-center text-medical-soft">
                  No testimonials yet.
                </p>
              ) : (
                testimonials.map((testimonial) => (
                  <article key={testimonial._id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-heading font-semibold text-medical-ink">{testimonial.patientName}</h3>
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
                          <span className="text-xs font-medium px-2 py-1 rounded-md bg-green-100 text-green-800">Live</span>
                        ) : (
                          <button type="button" onClick={() => approveTestimonial(testimonial._id)} className="btn-primary text-sm py-2 min-h-[36px]">
                            <FiCheckCircle aria-hidden /> Approve
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteTestimonial(testimonial)}
                          className="min-h-[36px] px-3 inline-flex items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          aria-label="Delete review"
                        >
                          <FiTrash2 />
                        </button>
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

      {doctorModal && (
        <Modal title={doctorModal === 'create' ? 'Add doctor' : 'Edit doctor'} onClose={() => setDoctorModal(null)} wide>
          <form onSubmit={saveDoctor} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label-field" htmlFor="doc-name">Name *</label>
                <input id="doc-name" className="input-field" value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} required />
              </div>
              <div>
                <label className="label-field" htmlFor="doc-spec">Specialization *</label>
                <input id="doc-spec" className="input-field" value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} required />
              </div>
              <div>
                <label className="label-field" htmlFor="doc-qual">Qualification *</label>
                <input id="doc-qual" className="input-field" value={doctorForm.qualification} onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })} required />
              </div>
              <div>
                <label className="label-field" htmlFor="doc-dept">Department *</label>
                <select id="doc-dept" className="input-field" value={doctorForm.department} onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })} required>
                  <option value="">Select</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-field" htmlFor="doc-exp">Experience (years)</label>
                <input id="doc-exp" type="number" min="0" className="input-field" value={doctorForm.experience} onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })} />
              </div>
              <div>
                <label className="label-field" htmlFor="doc-fee">Consultation fee</label>
                <input id="doc-fee" type="number" min="0" className="input-field" value={doctorForm.consultationFee} onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label-field" htmlFor="doc-bio">Bio</label>
                <textarea id="doc-bio" rows="3" className="input-field min-h-[80px]" value={doctorForm.bio} onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setDoctorModal(null)} className="btn-ghost border border-slate-200 flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : doctorModal === 'create' ? 'Add doctor' : 'Save changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {serviceModal && (
        <Modal title={serviceModal === 'create' ? 'Add service' : 'Edit service'} onClose={() => setServiceModal(null)} wide>
          <form onSubmit={saveService} className="space-y-4">
            <div>
              <label className="label-field" htmlFor="svc-name">Name *</label>
              <input id="svc-name" className="input-field" value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })} required />
            </div>
            <div>
              <label className="label-field" htmlFor="svc-desc">Description *</label>
              <textarea id="svc-desc" rows="3" className="input-field min-h-[80px]" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label-field" htmlFor="svc-dept">Department *</label>
                <select id="svc-dept" className="input-field" value={serviceForm.department} onChange={(e) => setServiceForm({ ...serviceForm, department: e.target.value })} required>
                  <option value="">Select</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-field" htmlFor="svc-price">Price</label>
                <input id="svc-price" type="number" min="0" className="input-field" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} />
              </div>
              <div>
                <label className="label-field" htmlFor="svc-dur">Duration (min)</label>
                <input id="svc-dur" type="number" min="5" className="input-field" value={serviceForm.duration} onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setServiceModal(null)} className="btn-ghost border border-slate-200 flex-1">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Saving…' : serviceModal === 'create' ? 'Add service' : 'Save changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminPanel;
