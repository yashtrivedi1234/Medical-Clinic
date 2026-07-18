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
    notes: '',
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
      setFormData((prev) => ({
        ...prev,
        patientName: userData.name || '',
        email: userData.email || '',
      }));
    }
    if (location.state?.doctorId) {
      setFormData((prev) => ({ ...prev, doctor: location.state.doctorId }));
    }
  }, [location]);

  useEffect(() => {
    if (formData.department) {
      setFilteredDoctors(doctors.filter((doc) => doc.department === formData.department));
    } else {
      setFilteredDoctors(doctors);
    }
  }, [formData.department, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      const doctorsData = response.data.data?.doctors || [];
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
      setDepartments([...new Set(doctorsData.map((doc) => doc.department))]);
    } catch (error) {
      toast.error('Failed to load doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') {
      setFormData((prev) => ({ ...prev, department: value, doctor: '' }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.patientName ||
      !formData.phone ||
      !formData.email ||
      !formData.department ||
      !formData.doctor ||
      !formData.appointmentDate ||
      !formData.appointmentTime
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const selectedDate = new Date(formData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error('Please select a future date');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/appointments', formData);
      toast.success('Appointment booked successfully! We will contact you soon.');
      setFormData({
        patientName: '',
        phone: '',
        email: '',
        department: '',
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
        notes: '',
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
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="pt-20 min-h-screen bg-medical-light">
      <section className="page-header">
        <div className="container-page max-w-2xl text-center mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-medical-ink mb-4">
              Book an appointment
            </h1>
            <p className="text-xl text-medical-soft">
              Choose a department and doctor — we will confirm your visit shortly.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-soft border border-medical-border/60 p-6 sm:p-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label htmlFor="patientName" className="label-field">
                  <FiUser className="inline mr-1.5" aria-hidden />
                  Patient name *
                </label>
                <input
                  id="patientName"
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="input-field"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="label-field">
                  <FiPhone className="inline mr-1.5" aria-hidden />
                  Phone *
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  className="input-field"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="label-field">
                  <FiMail className="inline mr-1.5" aria-hidden />
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="department" className="label-field">
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="doctor" className="label-field">
                  Doctor *
                </label>
                <select
                  id="doctor"
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                  disabled={!formData.department || loading}
                  className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!formData.department ? 'Select department first' : 'Select doctor'}
                  </option>
                  {filteredDoctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} — {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="appointmentDate" className="label-field">
                  <FiCalendar className="inline mr-1.5" aria-hidden />
                  Date *
                </label>
                <input
                  id="appointmentDate"
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                  min={minDate}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="appointmentTime" className="label-field">
                  <FiClock className="inline mr-1.5" aria-hidden />
                  Time *
                </label>
                <select
                  id="appointmentTime"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="notes" className="label-field">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="input-field min-h-[100px]"
                  placeholder="Symptoms, preferences, or questions..."
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full text-base">
              {submitting ? 'Booking…' : 'Book appointment'}
            </button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Appointments;
