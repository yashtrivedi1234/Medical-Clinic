import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const Appointments = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    email: '',
    department: '',
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDoctors();
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setFormData(prev => ({
        ...prev,
        patientName: userData.name || '',
        email: userData.email || ''
      }));
    }

    // Pre-select doctor if coming from doctors page
    if (location.state?.doctorId) {
      setFormData(prev => ({ ...prev, doctor: location.state.doctorId }));
    }
  }, [location]);

  useEffect(() => {
    if (formData.department) {
      setFilteredDoctors(doctors.filter(doc => doc.department === formData.department));
    } else {
      setFilteredDoctors(doctors);
    }
  }, [formData.department, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      const doctorsData = response.data.data || [];
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
      
      // Extract unique departments
      const uniqueDepts = [...new Set(doctorsData.map(doc => doc.department))];
      setDepartments(uniqueDepts);
    } catch (error) {
      toast.error('Failed to load doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset doctor when department changes
    if (name === 'department') {
      setFormData(prev => ({ ...prev, doctor: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.patientName || !formData.phone || !formData.email || 
        !formData.department || !formData.doctor || !formData.appointmentDate || 
        !formData.appointmentTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Date validation
    const selectedDate = new Date(formData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error('Please select a future date');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/appointments', formData);
      toast.success('Appointment booked successfully! We will contact you soon.');
      setFormData({
        patientName: '',
        phone: '',
        email: '',
        department: '',
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: ''
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to book appointment';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="pt-20 min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Book an Appointment</h1>
          <p className="text-xl text-gray-600">
            Fill out the form below to schedule your visit with our expert doctors
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FiUser className="inline mr-2" />
                Patient Name *
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FiPhone className="inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                <FiMail className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Doctor *
              </label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                disabled={!formData.department || loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">
                  {!formData.department ? 'Select Department First' : 'Select Doctor'}
                </option>
                {filteredDoctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FiCalendar className="inline mr-2" />
                Appointment Date *
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
                min={minDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FiClock className="inline mr-2" />
                Appointment Time *
              </label>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
              >
                <option value="">Select Time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                placeholder="Any additional information or concerns..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-8 py-4 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Booking Appointment...' : 'Book Appointment'}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Appointments;

