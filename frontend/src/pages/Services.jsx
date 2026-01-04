import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiDollarSign } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Services = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [departmentFilter, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      setServices(response.data.data || []);
      setFilteredServices(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load services');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    if (departmentFilter === 'all') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(service => service.department === departmentFilter));
    }
  };

  const departments = ['all', ...new Set(services.map(service => service.department))];

  const serviceIcons = {
    'General Medicine': '🏥',
    'Pediatrics': '👶',
    'Orthopedics': '🦴',
    'Gynecology': '👩',
    'Cardiology': '❤️',
    'Diagnostics': '🔬',
    'Dermatology': '🧴',
    'Neurology': '🧠',
    'Oncology': '🎗️'
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-medical-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Medical Services</h1>
            <p className="text-xl text-gray-600">
              Comprehensive healthcare services tailored to meet your needs
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
                {dept === 'all' ? 'All Services' : dept}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-xl">No services found in this department.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="text-5xl mb-4">
                    {service.icon || serviceIcons[service.name] || '🏥'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                    {service.duration && (
                      <div className="flex items-center">
                        <FiClock className="mr-2" />
                        <span>{service.duration} min</span>
                      </div>
                    )}
                    {service.price > 0 && (
                      <div className="flex items-center">
                        <FiDollarSign className="mr-2" />
                        <span>${service.price}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-medical-light text-medical-blue rounded-full text-sm font-medium">
                      {service.department}
                    </span>
                  </div>

                  <Link
                    to="/appointments"
                    className="inline-flex items-center text-medical-blue hover:text-medical-teal font-medium"
                  >
                    Book Appointment <FiArrowRight className="ml-2" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-medical-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing a Service?</h2>
          <p className="text-xl mb-8 text-medical-light">
            Our team is here to help you find the right care for your needs
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-white text-medical-blue rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Services;

