import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiClock,
  FiDollarSign,
  FiActivity,
  FiHeart,
  FiShield,
  FiClipboard,
  FiUser,
  FiEye,
} from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';

const serviceIconMap = {
  'General Medicine': FiActivity,
  Pediatrics: FiHeart,
  Orthopedics: FiShield,
  Gynecology: FiHeart,
  Cardiology: FiHeart,
  Diagnostics: FiClipboard,
  Dermatology: FiUser,
  Neurology: FiEye,
  Oncology: FiShield,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (departmentFilter === 'all') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((s) => s.department === departmentFilter));
    }
  }, [departmentFilter, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      const servicesData = response.data.data?.services || [];
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (error) {
      toast.error('Failed to load services');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const departments = ['all', ...new Set(services.map((s) => s.department))];

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-medical-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-medical-border border-t-medical-blue mx-auto mb-4" />
          <p className="text-medical-soft">Loading services...</p>
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
              Medical services
            </h1>
            <p className="text-xl text-medical-soft">
              Comprehensive care tailored to your needs — from prevention to specialized treatment.
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
                {dept === 'all' ? 'All services' : dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          {filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-medical-soft text-lg">No services found in this department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => {
                const Icon = serviceIconMap[service.name] || FiActivity;
                return (
                  <motion.article
                    key={service._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.04, duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-soft border border-medical-border/60 p-7 flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-lg bg-medical-light text-medical-blue flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" aria-hidden />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-medical-ink mb-2">{service.name}</h2>
                    <p className="text-medical-soft mb-5 leading-relaxed flex-1">{service.description}</p>

                    <div className="flex items-center justify-between mb-4 text-sm text-medical-soft">
                      {service.duration && (
                        <span className="inline-flex items-center gap-1.5">
                          <FiClock aria-hidden /> {service.duration} min
                        </span>
                      )}
                      {service.price > 0 && (
                        <span className="inline-flex items-center gap-1.5">
                          <FiDollarSign aria-hidden /> {service.price}
                        </span>
                      )}
                    </div>

                    <span className="inline-block self-start px-3 py-1 bg-medical-light text-medical-blue rounded-md text-sm font-medium mb-5">
                      {service.department}
                    </span>

                    <Link to="/appointments" className="btn-primary w-full mt-auto">
                      Book appointment <FiArrowRight aria-hidden />
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-14 bg-medical-blue text-white">
        <div className="container-page text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-3">Not sure which service you need?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            Our team will help you find the right care path.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center min-h-[44px] px-8 py-3 bg-white text-medical-blue rounded-lg font-heading font-semibold hover:bg-primary-50 transition-colors"
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;
