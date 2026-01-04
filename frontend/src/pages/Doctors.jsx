import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiAward, FiMail } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [departmentFilter, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      setDoctors(response.data.data || []);
      setFilteredDoctors(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
    if (departmentFilter === 'all') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter(doc => doc.department === departmentFilter));
    }
  };

  const departments = ['all', ...new Set(doctors.map(doc => doc.department))];

  const handleBookAppointment = (doctorId) => {
    navigate('/appointments', { state: { doctorId } });
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-medical-light via-white to-medical-light py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Expert Doctors</h1>
            <p className="text-xl text-gray-600">
              Meet our team of experienced and compassionate healthcare professionals
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  departmentFilter === dept
                    ? 'bg-medical-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No doctors found in this department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gradient-to-br from-medical-blue to-medical-teal p-8 text-center">
                    <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-6xl">
                      {doctor.image ? (
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <FiUser className="text-medical-blue" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{doctor.name}</h3>
                    <p className="text-medical-light">{doctor.specialization}</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <FiAward className="mr-3 text-medical-blue" />
                        <span>{doctor.qualification}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-3 text-medical-blue font-semibold">Experience:</span>
                        <span>{doctor.experience} years</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="mr-3 text-medical-blue font-semibold">Department:</span>
                        <span>{doctor.department}</span>
                      </div>
                      {doctor.rating > 0 && (
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-lg mr-2">★</span>
                          <span className="text-gray-600">{doctor.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    {doctor.bio && (
                      <p className="text-gray-600 mb-6 text-sm">{doctor.bio}</p>
                    )}
                    <button
                      onClick={() => handleBookAppointment(doctor._id)}
                      className="w-full px-6 py-3 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium flex items-center justify-center"
                    >
                      <FiCalendar className="mr-2" />
                      Book Appointment
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Doctors;

