import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUsers, FiAward, FiHeart, FiCheckCircle } from 'react-icons/fi';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Home = () => {
  const [stats, setStats] = useState({ doctors: 0, experience: 0, patients: 0 });
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsRes, servicesRes, testimonialsRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/services'),
        api.get('/testimonials')
      ]);

      setStats({
        doctors: doctorsRes.data.count || 0,
        experience: 25,
        patients: 10000
      });
      setServices(servicesRes.data.data?.slice(0, 6) || []);
      setTestimonials(testimonialsRes.data.data?.slice(0, 3) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const serviceIcons = {
    'General Medicine': '🏥',
    'Pediatrics': '👶',
    'Orthopedics': '🦴',
    'Gynecology': '👩',
    'Cardiology': '❤️',
    'Diagnostics': '🔬'
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-medical-light via-white to-medical-light py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Your Health, Our
              <span className="text-medical-blue"> Priority</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Experience world-class healthcare with compassionate doctors and state-of-the-art facilities.
              Your trusted partner in wellness and recovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/appointments"
                className="px-8 py-4 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-all transform hover:scale-105 font-medium text-lg shadow-lg"
              >
                Book Appointment
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-medical-blue text-medical-blue rounded-lg hover:bg-medical-blue hover:text-white transition-all font-medium text-lg"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FiUsers, label: 'Expert Doctors', value: stats.doctors },
              { icon: FiAward, label: 'Years Experience', value: stats.experience },
              { icon: FiHeart, label: 'Happy Patients', value: stats.patients.toLocaleString() }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 bg-gradient-to-br from-medical-light to-white rounded-2xl shadow-lg"
              >
                <stat.icon className="w-12 h-12 text-medical-blue mx-auto mb-4" />
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.value}+</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive healthcare services for you and your family</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{service.icon || serviceIcons[service.name] || '🏥'}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link
                  to="/services"
                  className="text-medical-blue hover:text-medical-teal font-medium flex items-center"
                >
                  Learn More <FiArrowRight className="ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="px-8 py-3 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium inline-flex items-center"
            >
              View All Services <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600">Excellence in healthcare delivery</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Expert Doctors', desc: 'Board-certified specialists with years of experience' },
              { title: 'Modern Facilities', desc: 'State-of-the-art equipment and technology' },
              { title: '24/7 Emergency', desc: 'Round-the-clock emergency care services' },
              { title: 'Patient Care', desc: 'Compassionate and personalized treatment approach' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-medical-light rounded-xl"
              >
                <FiCheckCircle className="w-8 h-8 text-medical-blue mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Patients Say</h2>
              <p className="text-xl text-gray-600">Trusted by thousands of satisfied patients</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  <p className="font-semibold text-gray-800">— {testimonial.patientName}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Emergency Banner */}
      <section className="py-12 bg-red-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Medical Emergency?</h3>
          <p className="text-lg mb-4">Call us immediately for 24/7 emergency services</p>
          <a
            href="tel:+15551234567"
            className="text-3xl font-bold hover:underline"
          >
            +1 (555) 123-4567
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;

