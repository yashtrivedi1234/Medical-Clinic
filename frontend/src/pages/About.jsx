import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiTarget, FiHeart, FiCheckCircle } from 'react-icons/fi';

const About = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-medical-light via-white to-medical-light py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">About MediCare Clinic</h1>
            <p className="text-xl text-gray-600">
              Delivering exceptional healthcare with compassion, innovation, and excellence for over 25 years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 1998, MediCare Clinic has been at the forefront of providing comprehensive
                healthcare services to our community. We started with a simple mission: to make quality
                healthcare accessible to everyone.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Over the years, we have grown into a trusted healthcare institution, serving thousands
                of patients with dedication and care. Our team of experienced doctors, nurses, and
                support staff work together to ensure the best possible outcomes for our patients.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we continue to invest in modern technology, advanced medical equipment, and
                continuous training for our staff to maintain the highest standards of medical care.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-medical-light rounded-2xl p-8 h-96 flex items-center justify-center"
            >
              <div className="text-6xl">🏥</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <FiTarget className="w-12 h-12 text-medical-blue mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide accessible, high-quality healthcare services that improve the health and
                well-being of our community through compassionate care, medical excellence, and
                innovative solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <FiAward className="w-12 h-12 text-medical-blue mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading healthcare provider in the region, recognized for excellence in
                patient care, medical innovation, and community health improvement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <FiHeart className="w-12 h-12 text-medical-blue mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <FiCheckCircle className="mr-2 mt-1 text-medical-green flex-shrink-0" />
                  <span>Compassion</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="mr-2 mt-1 text-medical-green flex-shrink-0" />
                  <span>Excellence</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="mr-2 mt-1 text-medical-green flex-shrink-0" />
                  <span>Integrity</span>
                </li>
                <li className="flex items-start">
                  <FiCheckCircle className="mr-2 mt-1 text-medical-green flex-shrink-0" />
                  <span>Innovation</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Certifications & Accreditations</h2>
            <p className="text-xl text-gray-600">Recognized for excellence in healthcare</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'JCI Accredited',
              'ISO 9001 Certified',
              'NABH Accredited',
              'HIPAA Compliant'
            ].map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-medical-light p-6 rounded-xl text-center"
              >
                <FiAward className="w-10 h-10 text-medical-blue mx-auto mb-3" />
                <p className="font-semibold text-gray-800">{cert}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Modern Infrastructure</h2>
            <p className="text-xl text-gray-600">State-of-the-art facilities for your care</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Advanced Diagnostics', desc: 'Latest imaging and lab equipment' },
              { title: 'Surgical Suites', desc: 'Modern operating rooms with cutting-edge technology' },
              { title: 'Emergency Department', desc: '24/7 emergency care with rapid response' },
              { title: 'ICU Facilities', desc: 'Intensive care units with advanced monitoring' },
              { title: 'Pharmacy', desc: 'In-house pharmacy for convenience' },
              { title: 'Rehabilitation Center', desc: 'Physical therapy and recovery services' }
            ].map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{facility.title}</h3>
                <p className="text-gray-600">{facility.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

