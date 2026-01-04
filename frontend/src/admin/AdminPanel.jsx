import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiActivity, FiSettings, FiLogOut, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
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
      setAppointments(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load appointments');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load doctors');
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load services');
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await api.get('/admin/testimonials');
      setTestimonials(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load testimonials');
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await api.put(`/admin/appointments/${id}/status`, { status });
      toast.success('Appointment status updated');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const approveTestimonial = async (id) => {
    try {
      await api.put(`/testimonials/${id}/approve`);
      toast.success('Testimonial approved');
      fetchTestimonials();
    } catch (error) {
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
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiActivity },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    { id: 'doctors', label: 'Doctors', icon: FiUsers },
    { id: 'services', label: 'Services', icon: FiSettings },
    { id: 'testimonials', label: 'Testimonials', icon: FiUsers }
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-medical-blue text-medical-blue'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && dashboard && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Appointments</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboard.stats.totalAppointments}</p>
                </div>
                <FiCalendar className="w-12 h-12 text-medical-blue" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{dashboard.stats.pendingAppointments}</p>
                </div>
                <FiClock className="w-12 h-12 text-yellow-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Doctors</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboard.stats.totalDoctors}</p>
                </div>
                <FiUsers className="w-12 h-12 text-medical-blue" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Patients</p>
                  <p className="text-3xl font-bold text-gray-800">{dashboard.stats.totalPatients}</p>
                </div>
                <FiUsers className="w-12 h-12 text-medical-green" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Appointments Table */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{apt.patientName}</div>
                        <div className="text-sm text-gray-500">{apt.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{apt.doctor?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{apt.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(apt.appointmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{apt.appointmentTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={apt.status}
                        onChange={(e) => updateAppointmentStatus(apt._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
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

        {/* Doctors List */}
        {activeTab === 'doctors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{doctor.name}</h3>
                <p className="text-gray-600 mb-2">{doctor.specialization}</p>
                <p className="text-sm text-gray-500">{doctor.department}</p>
                <p className="text-sm text-gray-500 mt-2">{doctor.experience} years experience</p>
              </div>
            ))}
          </div>
        )}

        {/* Services List */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service._id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-2">{service.description}</p>
                <p className="text-sm text-gray-500">{service.department}</p>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials */}
        {activeTab === 'testimonials' && (
          <div className="space-y-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{testimonial.patientName}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {!testimonial.isApproved && (
                    <button
                      onClick={() => approveTestimonial(testimonial._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <FiCheckCircle />
                      <span>Approve</span>
                    </button>
                  )}
                </div>
                <p className="text-gray-600">{testimonial.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
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

