import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiAward, FiStar } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (departmentFilter === 'all') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter((doc) => doc.department === departmentFilter));
    }
  }, [departmentFilter, doctors]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      const doctorsData = response.data.data?.doctors || [];
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
    } catch (error) {
      toast.error('Failed to load doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['all', ...new Set(doctors.map((doc) => doc.department))];

  const handleBookAppointment = (doctorId) => {
    navigate('/appointments', { state: { doctorId } });
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-medical-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-medical-border border-t-medical-blue mx-auto mb-4" />
          <p className="text-medical-soft">Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-medical-light">
      <section className="page-header">
        <div className="container-page max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-medical-ink mb-4">
              Our expert doctors
            </h1>
            <p className="text-xl text-medical-soft">
              Experienced clinicians who listen first — then treat with precision.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-6 bg-white border-b border-medical-border sticky top-20 z-30">
        <div className="container-page">
          <div className="flex flex-wrap gap-2 justify-start md:justify-center">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartmentFilter(dept)}
                className={departmentFilter === dept ? 'chip-active' : 'chip-idle'}
              >
                {dept === 'all' ? 'All departments' : dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-medical-soft text-lg">No doctors found in this department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor, index) => (
                <motion.article
                  key={doctor._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-soft overflow-hidden border border-medical-border/60 flex flex-col"
                >
                  <div className="bg-gradient-to-br from-medical-blue to-medical-teal p-8 text-center">
                    <div className="w-28 h-28 bg-white rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-soft">
                      {doctor.image ? (
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <FiUser className="text-medical-blue w-12 h-12" aria-hidden />
                      )}
                    </div>
                    <h2 className="font-heading text-xl font-bold text-white mb-1">{doctor.name}</h2>
                    <p className="text-primary-100 text-sm">{doctor.specialization}</p>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <ul className="space-y-2.5 mb-5 text-sm text-medical-soft">
                      <li className="flex items-center gap-2">
                        <FiAward className="text-medical-blue flex-shrink-0" aria-hidden />
                        {doctor.qualification}
                      </li>
                      <li>
                        <span className="font-medium text-medical-ink">Experience:</span> {doctor.experience} years
                      </li>
                      <li>
                        <span className="font-medium text-medical-ink">Department:</span> {doctor.department}
                      </li>
                      {doctor.rating > 0 && (
                        <li className="flex items-center gap-1.5">
                          <FiStar className="text-amber-500" aria-hidden />
                          <span>{doctor.rating.toFixed(1)}</span>
                        </li>
                      )}
                    </ul>
                    {doctor.bio && <p className="text-medical-soft text-sm mb-5 flex-1">{doctor.bio}</p>}
                    <button
                      type="button"
                      onClick={() => handleBookAppointment(doctor._id)}
                      className="btn-primary w-full mt-auto"
                    >
                      <FiCalendar aria-hidden />
                      Book appointment
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Doctors;
